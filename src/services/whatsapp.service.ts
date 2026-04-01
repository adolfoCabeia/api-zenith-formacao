import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';
import uploadPDF from './extrato.service.js';


const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export const enviarWhatsApp = async (numero: string, filePath: string) => {
  const url = await uploadPDF(filePath);
  console.log("TWILIO_WHATSAPP_NUMBER:", process.env.TWILIO_WHATSAPP_NUMBER);

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER!,
    to: `whatsapp:${numero}`,
    body: 'Aqui está o seu extrato em PDF',
    mediaUrl: [url],
  });
};