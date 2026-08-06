// pages/api/eitaa/getMessages.js (برای Pages Router)
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // دریافت آخرین پیام‌ها از کانال
    // توجه: برخی از APIها ممکن است نیاز به پارامترهای بیشتری داشته باشند
    const response = await fetch(`https://eitaayar.ir/api/bot512974:4249c370-c1b4-43cd-b8d3-dc8e4f6ca1cd/getUpdates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.ok) {
      // فیلتر کردن پیام‌های کانال
      const messages = data.result || [];
      res.status(200).json({ ok: true, result: messages });
    } else {
      res.status(200).json({ ok: false, error: data.description || 'خطا در دریافت پیام‌ها' });
    }
  } catch (error) {
    console.error('خطا در دریافت پیام‌ها:', error);
    res.status(500).json({ error: error.message });
  }
}