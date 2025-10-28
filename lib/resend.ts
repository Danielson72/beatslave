import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";

export const resend = new Resend(resendApiKey);

export const RESEND_FROM = process.env.RESEND_FROM || "BeatSlave <onboarding@resend.dev>";
export const RESEND_TO = process.env.RESEND_TO || "dalvarez@sotsvc.com";

