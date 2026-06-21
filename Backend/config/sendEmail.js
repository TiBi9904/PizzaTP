import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: `PizzaTP <${process.env.EMAIL_FROM}>`,
      to: sendTo,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error("SendEmail Error:", error);
    return null;
  }
};

export default sendEmail;
