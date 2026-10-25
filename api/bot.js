module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot serveri ishlamoqda');
  }

  const { message } = req.body || {};
  if (!message || !message.text) {
    return res.status(200).send('OK');
  }

  const BOT_TOKEN = '8959753899:AAEe4_-e4djK9zFIqpJ4tlEJBYUOTVMwGv8';
  const chatId = message.chat.id;
  const userText = message.text.toLowerCase().trim();

  let replyText = "Kechirasiz, sizni to'liq tushunmadim. Xizmatlar haqida bilish uchun 'narx' yoki 'manzil' deb yozing.";

  if (userText === '/start') {
    replyText = "Assalomu alaykum! TexnoZarFix botiga xush kelibsiz.\n\nKerakli ma'lumotni bilish uchun quyidagi so'zlardan birini yozing:\n- Narxlar\n- Manzil\n- Ish vaqti\n- Telefon";
  } else if (userText.includes('salom') || userText.includes('assalom')) {
    replyText = "Assalomu alaykum! Sizga qanday yordam bera olamiz?";
  } else if (userText.includes('narx') || userText.includes('qancha') || userText.includes('summa')) {
    replyText = "Xizmatlarimiz narxi nosozlik turiga bog'liq:\n- Ekran va modul almashtirish\n- Plata va mikrosxema ta'mirlash (BGA/Rebol)\n- Proshivka va dasturiy xizmatlar\n\nNosozlik va telefon modelini yozsangiz, aniq narxini aytamiz.";
  } else if (userText.includes('manzil') || userText.includes('qayerda') || userText.includes('lokatsiya')) {
    replyText = "Bizning manzil: Urgut shahri, TexnoZarFix ustaxonasi.";
  } else if (userText.includes('vaqt') || userText.includes('ish vaqti') || userText.includes('ochiq')) {
    replyText = "Ish vaqtimiz: Har kuni soat 09:00 dan 19:00 gacha.";
  } else if (userText.includes('telefon') || userText.includes('aloqa') || userText.includes('nomer')) {
    replyText = "Bog'lanish uchun telefon raqamimiz: +998 (xx) xxx-xx-xx";
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
