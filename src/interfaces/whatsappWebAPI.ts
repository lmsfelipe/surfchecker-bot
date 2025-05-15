import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { WhatsappHandler } from '../services/WhatsappHandler';

export function initWhatsapp() {
  const client = new Client({});

  client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.on('message', async (msg) => {
    const contact = await msg.getContact();

    const whatsappHandler = new WhatsappHandler({
      phoneNumber: contact.number,
      senderName: contact.pushname || contact.verifiedName,
      message: msg.body,
    });

    const response = await whatsappHandler.getSurfForecast();
    await whatsappHandler.storeRequest(response);
    msg.reply(response);
  });

  client.initialize();
}
