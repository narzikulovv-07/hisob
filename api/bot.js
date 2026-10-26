module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot serveri ishlamoqda');
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
    await sendTg(BOT_TOKEN, chatId, "Assalomu alaykum! TexnoZarFix ustaxonasining aqlli botiga xush kelibsiz.\n\nSavolingizni yozib qoldiring, AI yordamchimiz sizga javob beradi!", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('instagram') || lowerText.includes('insta')) {
    await sendTg(BOT_TOKEN, chatId, `📸 Bizning rasmiy Instagram sahifamiz:\n\n👉 ${instaUrl}`, keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('manzil') || lowerText.includes('qayerda') || lowerText.includes('lokatsiya')) {
    await sendTg(BOT_TOKEN, chatId, "📍 Manzilimiz: Urgut shahri, TexnoZarFix ustaxonasi.\n\nMo'ljal yoki to'liq lokatsiya olish uchun: +998 97 910 90 07", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('vaqt') || lowerText.includes('ish vaqti') || lowerText.includes('ochiq')) {
    await sendTg(BOT_TOKEN, chatId, "⏰ Ish vaqtimiz: Har kuni soat 09:00 dan 19:00 gacha (dam olish kunlarisiz).", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('telefon') || lowerText.includes('aloqa') || lowerText.includes('nomer') || lowerText.includes("bog'lanish")) {
    await sendTg(BOT_TOKEN, chatId, `📞 Aloqa uchun:\n+998 97 910 90 07\n+998 97 599 44 49\n\n💬 Telegram: @TexnoZarFix\n📸 Instagram: ${instaUrl}`, keyboard);
    return res.status(200).send('OK');
  }

  // Adminga yangi xabar kelgani haqida bildirishnoma
  const senderName = message.from?.first_name || 'Mijoz';
  const senderUser = message.from?.username ? `@${message.from.username}` : "Username yo'q";
  try {
    await sendTg(BOT_TOKEN, ADMIN_CHAT_ID, `📩 Yangi xabar!\nKimdan: ${senderName} (${senderUser})\nMatn: "${userText}"`);
  } catch (e) {}

  // Gemini AI ga so'rov yuborish
  let replyText = "";
  try {
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `Siz TexnoZarFix servis markazining professional ustasisiz (Urgut shahri). Telefon ta'mirlash, ekran, plata, batareya, BGA rebol bo'yicha qisqa, aniq o'zbekcha maslahat bering.\nMijoz savoli: "${userText}"` }]
          }
        ]
      })
    });

    const aiData = await aiResponse.json();

    if (aiData.candidates && aiData.candidates[0]?.content?.parts?.[0]?.text) {
      replyText = aiData.candidates[0].content.parts[0].text.trim();
    } else if (aiData.error) {
      // Agar Google xatolik bersa, xato matnini chiqaradi
      replyText = `Google API Xatosi: ${aiData.error.message || JSON.stringify(aiData.error)}`;
    } else {
      replyText = `Javob bo'sh keldi: ${JSON.stringify(aiData)}`;
    }
  } catch (err) {
    replyText = `Ulanishda xato: ${err.message}`;
  }

  await sendTg(BOT_TOKEN, chatId, replyText, keyboard);
  return res.status(200).send('OK');
};

async function sendTg(token, chatId, text, keyboard = null) {
  const body = { chat_id:
