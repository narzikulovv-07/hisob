module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot serveri ishlamoqda');
  }

  const { message } = req.body || {};
  if (!message || !message.text) {
    return res.status(200).send('OK');
  }

  const BOT_TOKEN = '8959753899:AAHSvO2UDi8bCtTCnMPV1Gle_Y6zZa39DIA';
  const chatId = message.chat.id;
  const userText = message.text.toLowerCase().trim();

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

  let replyText = "Kechirasiz, sizni to'liq tushunmadim. Menyudagi tugmalardan foydalanishingiz yoki savolingizni yozishingiz mumkin.";

  if (userText === '/start') {
    replyText = "Assalomu alaykum! TexnoZarFix professional elektronika va smartfon ta'mirlash markazining rasmiy botiga xush kelibsiz.\n\nKerakli ma'lumotni olish uchun quyidagi tugmalardan birini tanlang:";
  } else if (userText.includes('salom') || userText.includes('assalom')) {
    replyText = "Assalomu alaykum! TexnoZarFix ustaxonasiga xush kelibsiz. Qanday xizmat kerak?";
  } else if (
    userText.includes('narx') || 
    userText.includes('qancha') || 
    userText.includes('summa') || 
    userText.includes('pul') || 
    userText.includes('xizmatlar')
  ) {
    replyText = "🛠 TexnoZarFix xizmatlarining boshlang'ich narxlari:\n\n" +
                "1. Ekran / Modul almashtirish: 50 000 so'mdan boshlab (zapchast alohida)\n" +
                "2. Batareya (AKB) almashtirish: 40 000 so'mdan boshlab\n" +
                "3. Zaryad uyasi (Gnezdo / Subplata): 40 000 – 80 000 so'm\n" +
                "4. Plata ta'mirlash (Qisqa tutashuv / Tok oqishi): 100 000 so'mdan boshlab\n" +
                "5. Mikrosxema almashtirish / BGA rebol (CPU, RAM, Xotira): 150 000 – 350 000 so'm\n" +
                "6. Proshivka / Dasturiy nosozliklar / FRP: 40 000 – 100 000 so'm\n\n" +
                "⚠️ Aniq narxlarni telefoningiz modeli va nosozlik holatiga qarab operatorlarimiz aytadi.\n\n" +
                "📞 Aloqa: +998 97 910 90 07 | +998 97 599 44 49\n" +
                "💬 Telegram: @TexnoZarFix\n" +
                `📸 Instagram: ${instaUrl}`;
  } else if (
    userText.includes('ishonch') || 
    userText.includes('kafolat') || 
    userText.includes('garantiya') || 
    userText.includes('aldam') || 
    userText.includes('sifat') || 
    userText.includes('tuzatib ber')
  ) {
    replyText = "🛡 TexnoZarFix ishonchliligi va kafolat haqida:\n\n" +
                "✅ Rasmiy kafolat: Bajarilgan barcha turdagi mikrosxema, plata ta'mirlash va ehtiyot qismlarga 1 oydan 6 oygacha rasmiy kafolat beriladi.\n" +
                "🔬 Professional uskunalar: Ta'mirlash ishlari yuqori aniqlikdagi mikroskoplar, professional lehimlash stansiyalari va original diagnostika apparatlarida bajariladi.\n" +
                "📦 Original ehtiyot qismlar: Faqat sinovdan o'tgan, yuqori sifatli zavod detallari ishlatiladi.\n" +
                "🔍 Ochiq diagnostika: Apparat tekshirilgach, nosozlik va uning aniq yechimi sizga to'liq tushuntiriladi, hech qanday yashirin to'lovlar olinmaydi.\n\n" +
                "Savollaringiz bo'lsa, to'g'ridan-to‘g‘ri ustaga murojaat qilishingiz mumkin:\n" +
                "📞 +998 97 910 90 07\n" +
                "💬 @TexnoZarFix\n" +
                `📸 Instagram: ${instaUrl}`;
  } else if (userText.includes('instagram') || userText.includes('insta')) {
    replyText = "📸 Bizning rasmiy Instagram sahifamiz:\n\n" +
                `👉 ${instaUrl}\n\n` +
                "Sahifamizda bajarilgan murakkab ta'mirlash jarayonlari, video-hisobotlar va yangiliklarni kuzatib borishingiz mumkin!";
  } else if (userText.includes('manzil') || userText.includes('qayerda') || userText.includes('lokatsiya')) {
    replyText = "📍 Bizning manzil: Urgut shahri, TexnoZarFix ustaxonasi.\n\nMo'ljal yoki to'liq joylashuvni bilish uchun operatorga yozing: @TexnoZarFix";
  } else if (userText.includes('vaqt') || userText.includes('ish vaqti') || userText.includes('ochiq')) {
    replyText = "⏰ Ish vaqtimiz: Har kuni soat 09:00 dan 19:00 gacha (dam olish kunlarisiz).";
  } else if (
    userText.includes('telefon') || 
    userText.includes('aloqa') || 
    userText.includes('nomer') || 
    userText.includes('telegram') || 
    userText.includes("bog'lanish")
  ) {
    replyText = "📞 Aloqa uchun telefon raqamlarimiz:\n+998 97 910 90 07\n+998 97 599 44 49\n\n" +
                "💬 Telegram: @TexnoZarFix\n" +
                `📸 Instagram: ${instaUrl}`;
  }

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
