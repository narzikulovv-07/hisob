module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot serveri faol');
  }

  const { message } = req.body || {};
  if (!message || !message.text) {
    return res.status(200).send('OK');
  }

  const BOT_TOKEN = '8959753899:AAHL9I9Q8vu0WGjkm-E82KRIU_i96m811lY';
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

  const instaUrl = "https://www.instagram.com/texnozarfix";

  // Standart tugmalar
  if (lowerText === '/start') {
    await sendTg(BOT_TOKEN, chatId, "Assalomu alaykum! TexnoZarFix ustaxonasining aqlli botiga xush kelibsiz.\n\nTelefoningizdagi muammoni yozing yoki menyudan foydalaning:", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('instagram') || lowerText.includes('insta')) {
    await sendTg(BOT_TOKEN, chatId, `📸 Rasmiy Instagram:\n👉 ${instaUrl}`, keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('manzil') || lowerText.includes('qayerda') || lowerText.includes('lokatsiya')) {
    await sendTg(BOT_TOKEN, chatId, "📍 Manzil: Urgut shahri, TexnoZarFix ustaxonasi.\n📞 Aloqa: +998 97 910 90 07", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('vaqt') || lowerText.includes('ish vaqti') || lowerText.includes('ochiq')) {
    await sendTg(BOT_TOKEN, chatId, "⏰ Ish vaqtimiz: Har kuni 09:00 dan 19:00 gacha (dam olish kunlarisiz).", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('telefon') || lowerText.includes('aloqa') || lowerText.includes('nomer') || lowerText.includes("bog'lanish")) {
    await sendTg(BOT_TOKEN, chatId, `📞 Aloqa uchun:\n+998 97 910 90 07\n+998 97 599 44 49\nTelegram: @TexnoZarFix`, keyboard);
    return res.status(200).send('OK');
  }

  // Gemini AI ga usta rolida so'rov yuborish
  let replyText = "";
  try {
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `Siz Urgut shahridagi "TexnoZarFix" telefon ta'mirlash servisining professional ustasisiz. Telefon ta'mirlash, ekran, plata, batareya, BGA bo'yicha qisqa (2-3 gapda), usta tilida o'zbekcha aniq maslahat bering. Mijoz savoli: "${userText}"` }]
          }
        ]
      })
    });

    const aiData = await aiResponse.json();

    if (aiData.candidates && aiData.candidates[0]?.content?.parts?.[0]?.text) {
      replyText = aiData.candidates[0].content.parts[0].text.trim();
    } else {
      replyText = "Xabaringiz qabul qilindi. Ustaxonamizga olib kelsangiz, bepul diagnostika qilib beramiz.\n📞 +998 97 910 90 07";
    }
  } catch (err) {
    replyText = "Xabaringiz qabul qilindi. Tez orada usta siz bilan bog'lanadi.\n📞 +998 97 910 90 07";
  }

  // Mijozga javob qaytarish
  await sendTg(BOT_TOKEN, chatId, replyText, keyboard);

  // Adminga xabar yuborish
  try {
    const senderName = message.from?.first_name || 'Mijoz';
    const senderUser = message.from?.username ? `@${message.from.username}` : "Username yo'q";
    await sendTg(BOT_TOKEN, ADMIN_CHAT_ID, `📩 Yangi mijoz!\n👤 ${senderName} (${senderUser})\n💬 Savol: "${userText}"\n🤖 AI javobi: "${replyText}"`);
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
