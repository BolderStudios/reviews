import { Feedback } from "@/components/emails/feedback";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const {
      userEmail,
      feedback,
      customerName = "",
      customerPhoneNumber = "",
      rating,
      selectedReasons,
      source,
      customer_id,
    } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Acme <daniel@bolderstudios.com>",
      to: [userEmail],
      subject: "Review Request",
      react: Feedback({
        feedback,
        customerName,
        customerPhoneNumber,
        rating,
        selectedReasons,
        source,
        customer_id,
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