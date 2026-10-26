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

  // 1. Asosiy tugmalar va buyruqlar
  if (lowerText === '/start') {
    await sendTg(BOT_TOKEN, chatId, "Assalomu alaykum! TexnoZarFix ustaxonasining aqlli botiga xush kelibsiz.\n\nMenyudagi tugmalardan foydalanishingiz yoki telefoningizdagi muammoni shunchaki yozib qoldirishingiz mumkin. Sun'iy intellekt sizga darhol javob beradi!", keyboard);
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
    await sendTg(BOT_TOKEN, chatId, `📞 Aloqa uchun:\n+998 97 910 90 07\n+998 97 599 44 49\n\n💬 Telegram: @TexnoZarFix\n📸 Instagram: ${instaUrl}`, keyboard); return res.status(200).send('OK'); }  // 2. Birinchi navbatda xabarni sizga (Adminga) yetkazish const senderName = message.from?.first_name \vert{}\vert{} 'Mijoz'; const senderUser = message.from?.username ? `@${message.from.username}` : "Username yo'q";
  const alertToAdmin = `📩 Yangi mijoz murojaati!\n\n👤 Ismi: ${senderName}\n🔗 Profili: ${senderUser}\n🆔 ID: ${chatId}\n\n💬 Xabari:\n"${userText}"`;

  try {
    await sendTg(BOT_TOKEN, ADMIN_CHAT_ID, alertToAdmin);
  } catch (err) {}

  // 3. Gemini AI orqali mijozga mustaqil javob tayyorlash
  let replyText = "";
  const systemInstruction = `Siz "TexnoZarFix" professional smartfon va elektronika ta'mirlash markazining aqlli maslahatchisisiz. Joylashuv: Urgut shahri. Aloqa: +998 97 910 90 07.
Vazifangiz: Mijoz savoliga o'zbek tilida, muloyim va tajribali usta sifatida aniq javob berish.
Qoidalar:
- Telefon nosozligi (ekran, zaryad, batareya, qisqa tutashuv, plata, chip) sababini tushuntiring.
- Boshlang'ich narxlar: Ekran 50 000 so'mdan, batareya 40 000 so'mdan, plata va tutashuvlar 100 000 so'mdan boshlanadi. Aniq narx mikroskop ostida diagnostika qilingach aytilishini bildiring.
- Javob 2-3 ta ixcham gapdan iborat bo'lsin va ustaxonaga olib kelishni taklif qiling.`;

  try {
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemInstruction}\n\nMijoz savoli: "${userText}"` }]
          }
        ]
      })
    });

    const aiData = await aiResponse.json();
    if (aiData.candidates && aiData.candidates[0]?.content?.parts?.[0]?.text) {
      replyText = aiData.candidates[0].content.parts[0].text.trim();
    } else {
      // Agar API xatolik qaytarsa, xatolik sababini tushunish uchun
      console.error("Gemini Error Response:", JSON.stringify(aiData));
      replyText = "Xabaringiz qabul qilindi. Tez orada usta siz bilan bog'lanadi.\n📞 +998 97 910 90 07";
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    replyText = "Xabaringiz qabul qilindi. Ustaxonamizga olib kelsangiz, bepul diagnostika qilib beramiz.\n📞 +998 97 910 90 07";
  }

  // 4. Mijozga AI javobini yuborish
  await sendTg(BOT_TOKEN, chatId, replyText, keyboard);

  return res.status(200).send('OK');
};

async function sendTg(token, chatId, text, keyboard = null) {
  const body = { chat_id: chatId, text };
  if (keyboard) body.reply_markup = keyboard;
  return await fetch(`https
