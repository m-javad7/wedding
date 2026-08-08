"use client"
import React, { useState, useEffect } from 'react';

const ChannelMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // توکن ربات
  const token = '1101398776:xxNBOBYHUvmY4nj1pOB2QeLIJKEFPgdYEkU';
  const apiUrl = `https://tapi.bale.ai/bot${token}/getUpdates`;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.ok) {
        // فیلتر کردن پیام‌های کانال
        const channelMessages = data.result
          .filter(update => update.message && update.message.chat.type === 'channel')
          .map(update => ({
            id: update.update_id,
            messageId: update.message.message_id,
            text: update.message.text || '(پیام بدون متن)',
            date: new Date(update.message.date * 1000).toLocaleString('fa-IR'),
            channelTitle: update.message.chat.title || 'کانال',
            channelUsername: update.message.chat.username || '',
            hasMedia: update.message.photo || update.message.document || false
          }));

        setMessages(channelMessages);
      } else {
        setError('خطا در دریافت پیام‌ها');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // فرمت‌بندی متن با پشتیبانی از ایموجی و لینک
  const formatText = (text) => {
    if (!text) return null;
    
    // تشخیص لینک‌ها
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    const matches = text.match(urlRegex) || [];

    return parts.map((part, index) => {
      if (matches.includes(part)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری پیام‌ها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">خطا</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchMessages}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* هدر */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📢 پیام‌های کانال</h1>
              <p className="text-gray-500 mt-1">{messages.length} پیام</p>
            </div>
            <button
              onClick={fetchMessages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              بروزرسانی
            </button>
          </div>
        </div>

        {/* لیست پیام‌ها */}
        <div className="bg-white rounded-b-xl shadow-sm divide-y divide-gray-100">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>هیچ پیامی در کانال یافت نشد</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  {/* آواتار کانال */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {msg.channelTitle.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* هدر پیام */}
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-semibold text-gray-900">{msg.channelTitle}</span>
                      {msg.channelUsername && (
                        <span className="text-sm text-gray-500">@{msg.channelUsername}</span>
                      )}
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400" dir="ltr">{msg.date}</span>
                      {msg.hasMedia && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🖼️ رسانه</span>
                      )}
                    </div>
                    
                    {/* متن پیام */}
                    <div className="mt-2 text-gray-800 whitespace-pre-wrap break-words">
                      {formatText(msg.text)}
                    </div>

                    {/* متادیتا */}
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                      <span>شناسه: {msg.messageId}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* فوتر */}
        <div className="mt-4 text-center text-sm text-gray-400">
          {'نمایش پیام‌های کانال با استفاده از API Bale'}
        </div>
      </div>
    </div>
  );
};

export default ChannelMessages;