// src/app/api/v1/quotes/logistics/submit/route.ts
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/utils/connectDB";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { verifyTurnstileToken, getRequestIp } from "@/lib/utils/turnstile";
import type { ILogisticsQuote } from "@/types/logisticsQuote.types";
import { sendQuoteInternalNotificationEmail } from "@/lib/mail/quotes/sendQuoteInternalNotificationEmail";
import { validateLogisticsQuoteRequest } from "@/lib/utils/quotes/logisticsQuoteValidator";
import { makeEntityFinalPrefix } from "@/lib/utils/s3Helper";
import { finalizeAssetVectorAllOrNothing } from "@/lib/utils/s3Helper/server";
import { ES3Namespace, ES3Folder } from "@/types/aws.types";
import { getSiteUrlFromRequest } from "@/lib/utils/urlHelper";
import { sendQuoteCustomerConfirmationEmail } from "@/lib/mail/quotes/sendQuoteCustomerConfirmationEmail";
import { LogisticsQuoteModel } from "@/mongoose/models/LogisticsQuote";
import { generateUniqueEntityId } from "@/lib/utils/db/generateUniqueEntityId";

type SubmitQuoteBody = {
  // Turnstile
  turnstileToken: string;

  // Quote payload
  serviceDetails: any;
  identification: any;
  contact: any;

  finalNotes?: any;
  attachments?: any;

  marketingEmailConsent?: any;

  /** Optional: affects email subject (e.g. "Website", "LP-A", etc.) */
  sourceLabel?: string;
};

function deriveCrossBorder(serviceDetails: any): boolean | undefined {
  const o = serviceDetails?.origin?.countryCode;
  const d = serviceDetails?.destination?.countryCode;
  if (!o || !d) return undefined;
  return String(o).toUpperCase() !== String(d).toUpperCase();
}

export const POST = async (req: NextRequest) => {
  let rollback: (() => Promise<void>) | null = null;

  try {
    // 1) Parse JSON (cheap)
    const body = await parseJsonBody<SubmitQuoteBody>(req);

    // 2) Turnstile validation (NO DB, NO S3)
    const ip = getRequestIp(req.headers);
    const turnstile = await verifyTurnstileToken({
      token: body?.turnstileToken,
      ip,
      // expectedAction: "quote_submit",
    });

    if (!turnstile.ok) return errorResponse(400, "Turnstile validation failed");

    // 3) Validate quote business rules (NO DB, NO S3)
    const validated = validateLogisticsQuoteRequest({
      serviceDetails: body?.serviceDetails,
      identification: body?.identification,
      contact: body?.contact,
      finalNotes: body?.finalNotes,
      attachments: body?.attachments,
      marketingEmailConsent: body?.marketingEmailConsent,
    });

    // 4) Connect DB only after request is valid
    await connectDB();

    // 5) Pre-generate quote id so final S3 path is stable
    const quoteMongoId = new mongoose.Types.ObjectId().toString();
    const quoteId = await generateUniqueEntityId({
      model: LogisticsQuoteModel,
      fieldName: "quoteId",
      prefix: "NPT",
    });

    const quote = new LogisticsQuoteModel({
      _id: quoteMongoId,
      quoteId,

      serviceDetails: validated.serviceDetails,
      identification: validated.identification,
      contact: validated.contact,

      finalNotes: validated.finalNotes,
      attachments: validated.attachments,
      marketingEmailConsent: validated.marketingEmailConsent,

      crossBorder: deriveCrossBorder(validated.serviceDetails),
    });

    // 6) Finalize attachments (all-or-nothing) with rollback plan
    const attachmentsFolder = makeEntityFinalPrefix(
      ES3Namespace.QUOTES,
      quoteId,
      ES3Folder.ATTACHMENTS,
    );

    const finalized = await finalizeAssetVectorAllOrNothing({
      assets: (quote.attachments as any) ?? [],
      finalFolder: attachmentsFolder,
    });

    rollback = finalized.rollback;
    quote.attachments = finalized.assets as any;

    // 7) Mongoose validate + save (can still throw due to strict schemas)
    await quote.validate();
    await quote.save();

    // 8) Email notifications (non-blocking)
    try {
      const siteUrl = getSiteUrlFromRequest(req);
      const sourceLabel = body?.sourceLabel || siteUrl;

      const quoteObj = quote.toObject({ virtuals: true, getters: true }) as any as ILogisticsQuote;

      // Internal (company)
      await sendQuoteInternalNotificationEmail({
        quote: quoteObj,
        sourceLabel,
      });

      // Customer confirmation
      await sendQuoteCustomerConfirmationEmail({
        quote: quoteObj,
        sourceLabel,
      });
    } catch (mailErr) {
      console.warn("Failed to send quote emails:", mailErr);
    }

    const obj = quote.toObject({ virtuals: true, getters: true });

    return successResponse(201, "Quote submitted", {
      quote: { ...obj, id: obj?._id?.toString?.() ?? quoteMongoId },
      attachmentsFinalizedCount: finalized.movedCount,
    });
  } catch (err) {
    // If anything fails AFTER finalization started, revert temp keys so client retries work
    if (rollback) await rollback();
    return errorResponse(err);
  }
};
