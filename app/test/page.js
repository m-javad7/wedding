// app/test-bale/page.js
"use client";
import React, { useState } from 'react';

export default function TestBalePage() {
  const [serverResponse, setServerResponse] = useState(null);
  const [clientResponse, setClientResponse] = useState(null);
  const [loading, setLoading] = useState({ server: false, client: false });
  const [error, setError] = useState({ server: null, client: null });

  const BALE_TOKEN = '1101398776:xxNBOBYHUvmY4nj1pOB2QeLIJKEFPgdYEkU';

  // تست از طریق سرور (API Route)
  const testServer = async () => {
    setLoading(prev => ({ ...prev, server: true }));
    setError(prev => ({ ...prev, server: null }));
    setServerResponse(null);

    try {
      const response = await fetch('/api/bale/getMessages');
      const data = await response.json();
      setServerResponse(data);
    } catch (err) {
      setError(prev => ({ ...prev, server: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, server: false }));
    }
  };

  // تست مستقیم از کلاینت (مرورگر)
  const testClient = async () => {
    setLoading(prev => ({ ...prev, client: true }));
    setError(prev => ({ ...prev, client: null }));
    setClientResponse(null);

    try {
      const response = await fetch(
        `https://tapi.bale.ai/bot${BALE_TOKEN}/getUpdates`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offset: 0,
            limit: 50,
            timeout: 10,
          }),
        }
      );

      const data = await response.json();
      setClientResponse(data);
    } catch (err) {
      setError(prev => ({ ...prev, client: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, client: false }));
    }
  };

  // تست با Webhook (حذف Webhook)
  const testDeleteWebhook = async () => {
    try {
      const response = await fetch(
        `https://tapi.bale.ai/bot${BALE_TOKEN}/deleteWebhook`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      alert('حذف Webhook: ' + JSON.stringify(data, null, 2));
    } catch (err) {
      alert('خطا: ' + err.message);
    }
  };

  // تست ارسال پیام به کانال
  const testSendMessage = async () => {
    const text = prompt('متن پیام تست را وارد کنید:');
    if (!text) return;

    try {
      const response = await fetch(
        `https://tapi.bale.ai/bot${BALE_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: '@weddingMA',
            text: `🧪 پیام تست از صفحه تست: ${text}`,
            parse_mode: 'HTML',
          }),
        }
      );
      const data = await response.json();
      alert('نتیجه ارسال: ' + JSON.stringify(data, null, 2));
    } catch (err) {
      alert('خطا: ' + err.message);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen p-8 bg-gray-50" style={{ fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">🧪 صفحه تست API بله</h1>
        
        {/* اطلاعات */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
          <h2 className="font-semibold mb-2 text-sm text-gray-600">📋 اطلاعات</h2>
          <div className="text-xs space-y-1 text-gray-500">
            <p><span className="font-medium">توکن:</span> {BALE_TOKEN.substring(0, 15)}...</p>
            <p><span className="font-medium">کانال:</span> @weddingMA</p>
            <p><span className="font-medium">آدرس API:</span> https://tapi.bale.ai/bot...</p>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <button
            onClick={testServer}
            disabled={loading.server}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
            }}
          >
            {loading.server ? '⏳ در حال...' : '🖥️ تست از سرور'}
          </button>

          <button
            onClick={testClient}
            disabled={loading.client}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
            }}
          >
            {loading.client ? '⏳ در حال...' : '🌐 تست از کلاینت'}
          </button>

          <button
            onClick={testDeleteWebhook}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
            }}
          >
            🗑️ حذف Webhook
          </button>

          <button
            onClick={testSendMessage}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
            }}
          >
            📤 ارسال پیام تست
          </button>
        </div>

        {/* نتیجه تست سرور */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-sm flex items-center gap-2">
            🖥️ نتیجه تست از سرور
            {loading.server && <span className="text-xs text-gray-400">(در حال بارگذاری...)</span>}
          </h2>
          {error.server && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              ❌ خطا: {error.server}
            </div>
          )}
          {serverResponse && (
            <div className="bg-gray-900 rounded-xl p-4 overflow-auto max-h-96">
              <pre className="text-xs text-green-400 whitespace-pre-wrap">
                {JSON.stringify(serverResponse, null, 2)}
              </pre>
            </div>
          )}
          {!serverResponse && !loading.server && !error.server && (
            <div className="bg-gray-100 rounded-xl p-4 text-gray-400 text-sm text-center">
              برای تست، دکمه "تست از سرور" را بزنید
            </div>
          )}
        </div>

        {/* نتیجه تست کلاینت */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-sm flex items-center gap-2">
            🌐 نتیجه تست از کلاینت
            {loading.client && <span className="text-xs text-gray-400">(در حال بارگذاری...)</span>}
          </h2>
          {error.client && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              ❌ خطا: {error.client}
            </div>
          )}
          {clientResponse && (
            <div className="bg-gray-900 rounded-xl p-4 overflow-auto max-h-96">
              <pre className="text-xs text-green-400 whitespace-pre-wrap">
                {JSON.stringify(clientResponse, null, 2)}
              </pre>
            </div>
          )}
          {!clientResponse && !loading.client && !error.client && (
            <div className="bg-gray-100 rounded-xl p-4 text-gray-400 text-sm text-center">
              برای تست، دکمه "تست از کلاینت" را بزنید
            </div>
          )}
        </div>

        {/* راهنما */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
          <p className="font-semibold mb-1">📖 راهنما:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-600">
            <li><strong>تست از سرور:</strong> درخواست از طریق API Route Next.js (مشکل ممکن است در سرور باشد)</li>
            <li><strong>تست از کلاینت:</strong> درخواست مستقیم از مرورگر (مشکل ممکن است در شبکه باشد)</li>
            <li><strong>حذف Webhook:</strong> اگر Webhook تنظیم شده، getUpdates کار نمی‌کند</li>
            <li><strong>ارسال پیام تست:</strong> یک پیام تست به کانال ارسال می‌کند</li>
          </ul>
        </div>

        {/* دکمه بازگشت */}
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-blue-500 hover:underline">
            ← بازگشت به صفحه اصلی
          </a>
        </div>
      </div>
    </div>
  );
}