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
  
