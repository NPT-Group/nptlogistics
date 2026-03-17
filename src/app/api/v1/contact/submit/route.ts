// src/app/api/v1/contact/submit/route.ts
// src/app/api/v1/contact/submit/route.ts
import { NextRequest } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/utils/connectDB";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { verifyTurnstileToken, getRequestIp } from "@/lib/utils/turnstile";
import { makeEntityFinalPrefix } from "@/lib/utils/s3Helper";
import { finalizeAssetVectorAllOrNothing } from "@/lib/utils/s3Helper/server";
import { getSiteUrlFromRequest } from "@/lib/utils/urlHelper";
import { generateUniqueEntityId } from "@/lib/utils/db/generateUniqueEntityId";

import { ES3Namespace, ES3Folder } from "@/types/aws.types";
import type { IContactInquiry } from "@/types/contactInquiry.types";
import { ContactInquiryModel } from "@/mongoose/models/ContactInquiry";
import { validateContactInquiryRequest } from "@/lib/utils/contact/contactInquiryValidator";
import { sendContactInquiryInternalNotificationEmail } from "@/lib/mail/contact/sendContactInquiryInternalNotificationEmail";
import { sendContactInquiryCustomerConfirmationEmail } from "@/lib/mail/contact/sendContactInquiryCustomerConfirmationEmail";

type SubmitContactInquiryBody = {
  turnstileToken: string;
  inquiry: any;
  attachments?: any;
  marketingEmailConsent?: boolean;

  /** Optional: affects email subject (e.g. "Website", "LP-A", etc.) */
  sourceLabel?: string;
};

export const POST = async (req: NextRequest) => {
  let rollback: (() => Promise<void>) | null = null;

  try {
    const body = await parseJsonBody<SubmitContactInquiryBody>(req);

    const ip = getRequestIp(req.headers);
    const turnstile = await verifyTurnstileToken({
      token: body?.turnstileToken,
      ip,
    });

    if (!turnstile.ok) return errorResponse(400, "Turnstile validation failed");

    const validated = validateContactInquiryRequest({
      inquiry: body?.inquiry,
      attachments: body?.attachments,
      marketingEmailConsent: body?.marketingEmailConsent,
    });

    await connectDB();

    const inquiryMongoId = new mongoose.Types.ObjectId().toString();
    const inquiryId = await generateUniqueEntityId({
      model: ContactInquiryModel,
      fieldName: "inquiryId",
      prefix: "NPT-CI",
    });

    const inquiry = new ContactInquiryModel({
      _id: inquiryMongoId,
      inquiryId,
      inquiry: validated.inquiry,
      attachments: validated.attachments,
      marketingEmailConsent: validated.marketingEmailConsent,
    });

    const attachmentsFolder = makeEntityFinalPrefix(
      ES3Namespace.CONTACT_INQUIRIES,
      inquiryMongoId,
      ES3Folder.ATTACHMENTS,
    );

    const finalized = await finalizeAssetVectorAllOrNothing({
      assets: (inquiry.attachments as any) ?? [],
      finalFolder: attachmentsFolder,
    });

    rollback = finalized.rollback;
    inquiry.attachments = finalized.assets as any;

    await inquiry.validate();
    await inquiry.save();

    try {
      const siteUrl = getSiteUrlFromRequest(req);
      const sourceLabel = body?.sourceLabel || siteUrl;

      const inquiryObj = inquiry.toObject({
        virtuals: true,
        getters: true,
      }) as any as IContactInquiry;

      await sendContactInquiryInternalNotificationEmail({
        inquiry: inquiryObj,
        sourceLabel,
      });

      await sendContactInquiryCustomerConfirmationEmail({
        inquiry: inquiryObj,
        sourceLabel,
      });
    } catch (mailErr) {
      console.warn("Failed to send contact inquiry emails:", mailErr);
    }

    const obj = inquiry.toObject({ virtuals: true, getters: true });

    return successResponse(201, "Contact inquiry submitted", {
      inquiry: { ...obj, id: obj?._id?.toString?.() ?? inquiryMongoId },
      attachmentsFinalizedCount: finalized.movedCount,
    });
  } catch (err) {
    if (rollback) await rollback();
    return errorResponse(err);
  }
};
