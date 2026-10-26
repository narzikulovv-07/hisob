module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot ishlayapti');
  }

  const { message } = req.body || {};
  if (!message || !message.text) {
    return res.status(200).send('OK');
  }

  const BOT_TOKEN = '8959753899:AAHSvO2UDi8bCtTCnMPV1Gle_Y6zZa39DIA';
  const GEMINI_API_KEY = 'AQ.Ab8RN6Kh2xZ84QVifQ127S5Dy0Nu4q7QW6PzEVu0-aondUnkXA';
  const ADMIN_CHAT_ID = '1551435907';
  const chatId = message.chat.id;
  const userText = message.text.trim();
  const lowerText = userText.toLowerCase();

  const keyboard = {
    keyboard: [
      [{ text: "🛠 Xizmatlar va Narxlar" }, { text: "🛡 Kafolat va Ishonch" }],
      [{ text: "📍 Manzil" }, { text: "⏰ Ish vaqti" }],
      [{ text: "📞 Bog'lanish" }, { text: "📸 Instagram" }]
    ],
    resize_keyboard: true
  };

  const instaUrl = "https://www.instagram.com/texnozarfix?mdxt=N2Y1MGRyZjkzdDZs";

  // Standart tugmalar
  if (lowerText === '/start') {
    await sendTg(BOT_TOKEN, chatId, "Assalomu alaykum! TexnoZarFix botiga xush kelibsiz.\n\nSavolingizni yozing:", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('instagram') || lowerText.includes('insta')) {
    await sendTg(BOT_TOKEN, chatId, `📸 Rasmiy Instagram:\n👉 ${instaUrl}`, keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('manzil') || lowerText.includes('qayerda') || lowerText.includes('lokatsiya')) {
    await sendTg(BOT_TOKEN, chatId, "📍 Manzil: Urgut shahri, TexnoZarFix ustaxonasi.\nTelefon: +998 97 910 90 07", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('vaqt') || lowerText.includes('ish vaqti') || lowerText.includes('ochiq')) {
    await sendTg(BOT_TOKEN, chatId, "⏰ Ish vaqti: Har kuni 09:00 dan 19:00 gacha.", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('telefon') || lowerText.includes('aloqa') || lowerText.includes('nomer') || lowerText.includes("bog'lanish")) {
    await sendTg(BOT_TOKEN, chatId, `📞 Aloqa:\n+998 97 910 90 07\n+998 97 599 44 49\nTelegram: @TexnoZarFix`, keyboard);
    return res.status(200).send('OK');
  }

  // Gemini AI ga so'rov yuborish
  let replyText = "";
  try {
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `TexnoZarFix telefon ta'mirlash ustaxonasi (Urgut). Savolga o'zbek tilida 2 gapda javob ber: ${userText}` }]
          }
        ]
      })
    });

    const aiData = await aiResponse.json();

    if (aiData.candidates && aiData.candidates[0]?.content?.parts?.[0]?.text) {
      replyText = aiData.candidates[0].content.parts[0].text.trim();
    } else if (aiData.error) {
      replyText = `Google xatosi: ${aiData.error.message || JSON.stringify(aiData.error)}`;
    } else {
      replyText = `Google javobi: ${JSON.stringify(aiData)}`;
    }
  } catch (err) {
    replyText = `Tizim xatosi: ${err.message}`;
  }

  // Mijozga javobni qaytarish
  await sendTg(BOT_TOKEN, chatId, replyText, keyboard);

  // Adminga xabarnoma yuborish
  try {
    await sendTg(BOT_TOKEN, ADMIN_CHAT_ID, `📩 Yangi xabar:\n"${userText}"\n\n🤖 Bot bergan javob:\n"${replyText}"`);
  } catch (e) {}

  return res.status(200).send('OK');
};

async function sendTg(token, chatId, text, keyboard = null) {
  const body = { chat_id: chatId, text };
  if (keyboard) body.reply_markup = keyboard;
  return await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}
