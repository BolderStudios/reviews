import { ReviewRequest } from "@/components/emails/reviewRequest";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/utils/supabaseClient";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const uniqueId = uuidv4();
  const timestamp = Date.now();
  const messageId = `<${uniqueId}@getbrandarmor.com>`;

  try {
    // Need to add user specific data: specific discount %, business name (location name),
    const { customer, href_campaign, location_id } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Powder Beauty <daniel@bolderstudios.com>",
      to: [customer.email_address],
      subject: `${
        customer.name[0].toUpperCase() + customer.name.slice(1)
      }, leave a review and get 15% OFF today! 🎉`,
      html: `<img src="https://getbrandarmor.com/pixel.gif?id=${uniqueId}" width="1" height="1" style="display:none" alt="" />`,
      headers: {
        "Message-ID": messageId,
        "X-Entity-Ref-ID": uniqueId,
      },
      react: ReviewRequest({
        customer,
        href_campaign,
      }),
      tags: [
        {
          name: "unique_id",
          value: uniqueId,
        },
      ],
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log("Email sent from backend:", data);
    const unique_email_id = data.id;

    // Add a new request to the database from this user
    const { data: request, error: requestError } = await supabase
      .from("requests")
      .insert([
        {
          location_id,
          customer_id: customer.id,
          customer_email_address: customer.email_address,
          date: new Date(),
          source: "email",
          email_id: unique_email_id,
        },
      ]);

    if (requestError) {
      return Response.json({ error: requestError.message }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
