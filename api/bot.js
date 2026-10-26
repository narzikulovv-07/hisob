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

  // Asosiy tugmalar (Klaviatura menyusi)
  const keyboard = {
    keyboard: [
      [{ text: "🛠 Xizmatlar va Narxlar" }, { text: "🛡 Kafolat va Ishonch" }],
      [{ text: "📍 Manzil" }, { text: "⏰ Ish vaqti" }],
      [{ text: "📞 Bog'lanish" }, { text: "📸 Instagram" }]
    ],
    resize_keyboard: true
  };

  const instaUrl = "https://www.instagram.com/texnozarfix?mdxt=N2Y1MGRyZjkzdDZs";

  let replyText = "";

  // 1. Asosiy buyruqlar va standart tugmalar
  if (lowerText === '/start') {
    replyText = "Assalomu alaykum! TexnoZarFix professional elektronika va smartfon ta'mirlash markazining aqlli botiga xush kelibsiz.\n\n" +
                "Menyudagi tugmalardan foydalanishingiz yoki telefoningizdagi nosozlikni shunchaki yozib qoldirishingiz mumkin. Sun'iy intellekt yordamchimiz sizga darhol javob beradi!";
  } else if (lowerText.includes('instagram') || lowerText.includes('insta')) {
    replyText = `📸 Bizning rasmiy Instagram sahifamiz:\n\n👉 ${instaUrl}\n\nKuzatib boring, yangiliklar va jarayonlar shu yerda!`;
  } else if (lowerText.includes('manzil') || lowerText.includes('qayerda') || lowerText.includes('lokatsiya')) {
    replyText = "📍 Bizning manzil: Urgut shahri, TexnoZarFix ustaxonasi.\n\nMo'ljal yoki to'liq lokatsiya olish uchun operator bilan bog'laning: +998 97 910 90 07";
  } else if (lowerText.includes('vaqt') || lowerText.includes('ish vaqti') || lowerText.includes('ochiq')) {
    replyText = "⏰ Ish vaqtimiz: Har kuni soat 09:00 dan 19:00 gacha (dam olish kunlarisiz).";
  } else if (
    lowerText.includes('telefon') || 
    lowerText.includes('aloqa') || 
    lowerText.includes('nomer') || 
    lowerText.includes("bog'lanish")
  ) {
    replyText = `📞 Aloqa uchun telefon raqamlarimiz:\n+998 97 910 90 07\n+998 97 599 44 49\n\n💬 Telegram: @TexnoZarFix\n📸 Instagram: ${instaUrl}`;
  } else {
    // 2. Erkin savollar va murojaatlar uchun Gemini AI ga so'rov yuborish
    const systemPrompt = `Siz "TexnoZarFix" professional smartfon va elektronika ta'mirlash servis markazining rasmiy, aqlli virtual maslahatchisisiz.
Ustaxona joylashuvi: Urgut shahri.
Telefonlar: +998 97 910 90 07, +998 97 599 44 49.
Telegram: @TexnoZarFix.
Instagram: ${instaUrl}.

Qoidalar:
1. O'zbek tilida muloyim, aniq, lo'nda va professional usta ohangida javob bering.
2. Telefon modellari, ekranni almashtirish, batareya, plata ta'mirlash, qisqa tutashuv (KЗ), BGA rebol (CPU, RAM, xotira), zaryad uyasi va proshivka bo'yicha texnik jihatdan to'g'ri maslahat bering.
3. Boshlang'ich narxlar: Ekran almashtirish 50 000 so'mdan, Batareya 40 000 so'mdan, Plata/tutashuv 100 000 so'mdan, BGA/Mikrosxema 150 000 - 350 000 so'm atrofida. Aniq narx apparatni mikroskop ostida ko'rib diagnostika qilingach aytilishini eslatib o'ting.
4. Javobingiz juda uzun cho'zilib ketmasin, 2-4 ta ixcham gapda mijozning savoliga aniq yechim bering va do'konga taklif qiling.`;

    try {
      const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemPrompt}\n\nMijoz savoli: "${userText}"` }
              ]
            }
          ]
        })
      });

      const aiData = await aiResponse.json();
      if (aiData.candidates && aiData.candidates[0]?.content?.parts?.[0]?.text) {
        replyText = aiData.candidates[0].content.parts[0].text.trim();
      } else {
        replyText = "Xabaringiz qabul qilindi. Tez orada usta siz bilan bog'lanadi. Shoshilinch bo'lsa: +998 97 910 90 07";
      }
    } catch (err) {
      console.error("AI Error:", err);
      replyText = "Xabaringiz qabul qilindi. Tez orada javob beramiz yoki qo'ng'iroq qilishingiz mumkin:\n📞 +998 97 910 90 07";
    }

    // Mijoz murojaatini shaxsiy profilingizga ham bildirishnoma qilib tashlaydi
    const senderName = message.from?.first_name || 'Mijoz';
    const senderUser = message.from?.username ? `@${message.from.username}` : "Username yo'q";
    const alertToAdmin = `📩 Yangi mijoz murojaati!\n\n👤 Ismi: ${senderName}\n🔗 Profili: ${senderUser}\n💬 Xabari: "${userText}"`;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text: alertToAdmin
        })
      });
    } catch (e) {}
  }

  // Mijozga javob yuborish
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
        reply_markup: keyboard
      })
    });
  } catch (e) {
    console.error(e);
  }

  return res.status(200).send('OK');
};
