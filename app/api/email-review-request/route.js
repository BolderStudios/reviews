import { ReviewRequest } from "@/components/emails/reviewRequest";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { customer, href_campaign } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Acme <daniel@bolderstudios.com>",
      to: [customer.email_address],
      subject: "Review Request",
      react: ReviewRequest({
        customer,
        href_campaign,
      }),
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
