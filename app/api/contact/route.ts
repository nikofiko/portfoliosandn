import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { contact, message } = await req.json();

    if (!contact || !message) {
      return NextResponse.json(
        { error: "Wypełnij wszystkie wymagane pola." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Formularz kontaktowy <onboarding@resend.dev>",
      to: "nikodem@sandnstudio.art",
      subject: `Nowa wiadomość z formularza kontaktowego`,
      replyTo: contact.includes("@") ? contact : undefined,
      html: `
        <h2>Nowa wiadomość z formularza kontaktowego</h2>
        <p><strong>Kontakt:</strong> ${contact}</p>
        <hr />
        <p><strong>Wiadomość:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Nie udało się wysłać wiadomości." },
      { status: 500 }
    );
  }
}
