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
  turnstileToken: string;

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
    const body = await parseJsonBody<SubmitQuoteBody>(req);

    const ip = getRequestIp(req.headers);
    const turnstile = await verifyTurnstileToken({
      token: body?.turnstileToken,
      ip,
      // expectedAction: "quote_submit",
    });

    if (!turnstile.ok) return errorResponse(400, "Turnstile validation failed");

    const validated = validateLogisticsQuoteRequest({
      serviceDetails: body?.serviceDetails,
      identification: body?.identification,
      contact: body?.contact,
      finalNotes: body?.finalNotes,
      attachments: body?.attachments,
      marketingEmailConsent: body?.marketingEmailConsent,
    });

    await connectDB();

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

    const attachmentsFolder = makeEntityFinalPrefix(
      ES3Namespace.QUOTES,
      quoteMongoId,
      ES3Folder.ATTACHMENTS,
    );

    const finalized = await finalizeAssetVectorAllOrNothing({
      assets: (quote.attachments as any) ?? [],
      finalFolder: attachmentsFolder,
    });

    rollback = finalized.rollback;
    quote.attachments = finalized.assets as any;

    await quote.validate();
    await quote.save();

    try {
      const siteUrl = getSiteUrlFromRequest(req);
      const sourceLabel = body?.sourceLabel || siteUrl;

      const quoteObj = quote.toObject({ virtuals: true, getters: true }) as ILogisticsQuote;

      await sendQuoteInternalNotificationEmail({
        quote: quoteObj,
        sourceLabel,
      });

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
    if (rollback) await rollback();
    return errorResponse(err);
  }
};
