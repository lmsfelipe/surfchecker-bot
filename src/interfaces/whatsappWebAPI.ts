import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { WhatsappHandler } from '../services/WhatsappHandler';

export function initWhatsapp() {
  const client = new Client({});
  const whatsappHandler = new WhatsappHandler();

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
    const senderName = contact.pushname || contact.verifiedName;

    console.log(`Message received from: ${senderName}`);
    const response = await whatsappHandler.getSurfForecast(
      msg.body,
      senderName,
    );
    msg.reply(response);

    // if (msg.body == '!ping') {
    //   msg.reply('pong');
    // }
  });

  client.initialize();
}
