module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot serveri ishlamoqda');
  }

  const { message } = req.body || {};
  if (!message || !message.text) {
    return res.status(200).send('OK');
  }

  const BOT_TOKEN = '8959753899:AAHSvO2UDi8bCtTCnMPV1Gle_Y6zZa39DIA';
  const GEMINI_API_KEY = 'AQ.Ab8RN6KIL0eX52J70wG7z6Da0MCor0gCg_00PgbC8mhXA0ds6w';
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

  // 1. Standart tugmalar
  if (lowerText === '/start') {
    await sendTg(BOT_TOKEN, chatId, "Assalomu alaykum! TexnoZarFix professional elektronika va smartfon ta'mirlash markazining aqlli botiga xush kelibsiz.\n\nMenyudagi tugmalardan foydalanishingiz yoki telefoningizdagi nosozlikni yozib qoldirishingiz mumkin. Sun'iy intellekt yordamchimiz sizga darhol javob beradi!", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('instagram') || lowerText.includes('insta')) {
    await sendTg(BOT_TOKEN, chatId, `📸 Bizning rasmiy Instagram sahifamiz:\n\n👉 ${instaUrl}`, keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('manzil') || lowerText.includes('qayerda') || lowerText.includes('lokatsiya')) {
    await sendTg(BOT_TOKEN, chatId, "📍 Bizning manzil: Urgut shahri, TexnoZarFix ustaxonasi.\n\nMo'ljal yoki to'liq lokatsiya olish uchun operator bilan bog'laning: +998 97 910 90 07", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('vaqt') || lowerText.includes('ish vaqti') || lowerText.includes('ochiq')) {
    await sendTg(BOT_TOKEN, chatId, "⏰ Ish vaqtimiz: Har kuni soat 09:00 dan 19:00 gacha (dam olish kunlarisiz).", keyboard);
    return res.status(200).send('OK');
  }

  if (lowerText.includes('telefon') || lowerText.includes('aloqa') || lowerText.includes('nomer') || lowerText.includes("bog'lanish")) {
    await sendTg(BOT_TOKEN, chatId, `📞 Aloqa uchun telefon raqamlarimiz:\n+998 97 910 90 07\n+998 97 599 44 49\n\n💬 Telegram: @TexnoZarFix\n📸 Instagram: ${instaUrl}`, keyboard);
    return res.status(200).send('OK');
  }

  // 2. Mijozdan erkin xabar kelsa: BIRINCHI NAVBATDA SIZGA (USTAGA) BILDIRISHNOMA YUBORAMIZ
  const senderName = message.from?.first_name || 'Mijoz';
  const senderUser = message.from?.username ? `@${message.from.username}` : "Username yo'q";
  const alertToAdmin = `📩 Yangi mijoz murojaati!\n\n👤 Ismi: ${senderName}\n🔗 Profili: ${senderUser}\n🆔 Chat ID: ${chatId}\n\n💬 Xabari:\n"${userText}"`;

  try {
    await sendTg(BOT_TOKEN, ADMIN_CHAT_ID, alertToAdmin);
  } catch (err) {
    console.error("Adminga xabar ketmadi:", err);
  }

  // 3. Endi Gemini AI mijozga javob tayyorlaydi
  let replyText = "";
  const systemPrompt = `Siz "TexnoZarFix" professional smartfon va elektronika ta'mirlash servis markazining rasmiy aqlli virtual maslahatchisisiz.
Ustaxona joylashuvi: Urgut shahri.
Telefonlar: +998 97 910 90 07, +998 97 599 44 49.
Telegram: @TexnoZarFix.
Instagram: ${instaUrl}.

Qoidalar:
1. O'zbek tilida muloyim, aniq va usta tilida professional javob bering.
2. Boshlang'ich narxlar: Ekran almashtirish 50 000 so'mdan, Batareya 40 000 so'mdan, Plata/tutashuv 100 000 so'mdan, BGA/Mikrosxema 150 000 - 350 000 so'm atrofida. Aniq narx apparatni mikroskop ostida diagnostika qilib aytiladi.
3. 2-3 ta qisqa gapda tushuntiring va ustaxonaga taklif qiling.`;

  try {
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nMijoz savoli: "${userText}"` }]
          }
        ]
      })
    });

    const aiData = await aiResponse.json();
    if (aiData.candidates && aiData.candidates[0]?.content?.parts?.[0]?.text) {
      replyText = aiData.candidates[0].content.parts[0].text.trim();
    } else {
      replyText = "Xabaringiz qabul qilindi. Tez orada usta siz bilan bog'lanadi.\n📞 +998 97 910 90 07";
    }
  } catch (err) {
    replyText = "Xabaringiz usta yetkazildi. Tez orada siz bilan bog'lanamiz!\n📞 +998 97 910 90 07";
  }

  // 4. Mijozga AI javobini yuborish
  await sendTg(BOT_TOKEN, chatId, replyText, keyboard);

  return res.status(200).send('OK');
};

// Telegramga xabar yuboruvchi yordamchi funksiya
async function sendTg(token, chatId, text, keyboard = null) {
  const body = { chat_id: chatId, text };
  if (keyboard) body.reply_markup = keyboard;
  return await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}
