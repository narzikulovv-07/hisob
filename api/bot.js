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

  let replyText = "Kechirasiz, sizni to'liq tushunmadim. Ma'lumot olish uchun 'narx' yoki 'manzil' deb yozing.";

  if (userText === '/start') {
    replyText = "Assalomu alaykum! TexnoZarFix botiga xush kelibsiz.\n\nKerakli ma'lumotni bilish uchun quyidagi so'zlardan birini yozing:\n- Narxlar\n- Manzil\n- Ish vaqti\n- Telefon";
  } else if (userText.includes('salom') || userText.includes('assalom')) {
    replyText = "Assalomu alaykum! TexnoZarFix ustaxonasiga xush kelibsiz. Sizga qanday yordam bera olamiz?";
  } else if (userText.includes('narx') || userText.includes('qancha') || userText.includes('summa') || userText.includes('pul')) {
    replyText = "🛠 TexnoZarFix xizmatlarining boshlang'ich narxlari:\n\n" +
                "1. Ekran / Modul almashtirish: 50 000 so'mdan boshlab (zapchast alohida)\n" +
                "2. Batareya (AKB) almashtirish: 40 000 so'mdan boshlab\n" +
                "3. Zaryad uyasi (Gnezdo / Subplata): 40 000 – 80 000 so'm\n" +
                "4. Plata ta'mirlash (Qisqa tutashuv / Tok oqishi): 100 000 so'mdan boshlab\n" +
                "5. Mikrosxema almashtirish / BGA rebol (CPU, RAM, Xotira): 150 000 – 350 000 so'm\n" +
                "6. Proshivka / Dasturiy nosozliklar / FRP: 40 000 – 100 000 so'm\n\n" +
                "⚠️ Aniq narxlarni telefoningiz modeli va nosozlik holatiga qarab operatorlarimiz aytadi.\n\n" +
                "📞 Aloqa uchun telefonlar:\n+998 97 910 90 07\n+998 97 599 44 49\n\n" +
                "💬 Telegram: @TexnoZarFix";
  } else if (userText.includes('manzil') || userText.includes('qayerda') || userText.includes('lokatsiya')) {
    replyText = "📍 Bizning manzil: Urgut shahri, TexnoZarFix ustaxonasi.";
  } else if (userText.includes('vaqt') || userText.includes('ish vaqti') || userText.includes('ochiq')) {
    replyText = "⏰ Ish vaqtimiz: Har kuni soat 09:00 dan 19:00 gacha.";
  } else if (userText.includes('telefon') || userText.includes('aloqa') || userText.includes('nomer') || userText.includes('telegram')) {
    replyText = "📞 Aloqa uchun telefon raqamlarimiz:\n+998 97 910 90 07\n+998 97 599 44 49\n\n💬 Telegram: @TexnoZarFix";
  }

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText
      })
    });
  } catch (e) {
    console.error(e);
  }

  return res.status(200).send('OK');
};
