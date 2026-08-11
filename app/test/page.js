'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // آدرس API با Rewrite در Next.js
  const botToken = '1101398776:xxNBOBYHUvmY4nj1pOB2QeLIJKEFPgdYEkU';
  const apiUrl = `/bale-api/bot${botToken}/getUpdates`;
  const sendMessageUrl = `/bale-api/bot${botToken}/sendMessage`;

  const fetchUpdates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 ارسال درخواست به:', apiUrl);
      const response = await axios.get(apiUrl, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('✅ پاسخ دریافت شد:', response.status);
      
      if (response.status === 200 && response.data.ok) {
        setUpdates(response.data.result);
        console.log(`📊 ${response.data.result.length} بروزرسانی دریافت شد`);
      } else {
        throw new Error('پاسخ API موفقیت‌آمیز نبود');
      }
    } catch (err) {
      let errorMessage = err.message;
      
      if (err.response) {
        errorMessage = `خطای سرور (${err.response.status})`;
        console.error('خطای سرور:', err.response.data);
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'مدت زمان درخواست به پایان رسید';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'خطای شبکه یا CORS';
      }
      
      setError(errorMessage);
      console.error('❌ خطا:', err);
    } finally {
      setLoading(false);
    }
  };

  // تابع ارسال پیام
  const sendMessage = async () => {
    if (!messageText.trim()) {
      setSendResult({ type: 'error', text: 'لطفاً متن پیام را وارد کنید' });
      return;
    }

    // پیدا کردن chat_id از اولین بروزرسانی
    if (updates.length === 0) {
      setSendResult({ type: 'error', text: 'هیچ چتی برای ارسال پیام وجود ندارد. ابتدا پیام‌ها را دریافت کنید.' });
      return;
    }

    const chatId = updates[0]?.message?.chat?.id;
    if (!chatId) {
      setSendResult({ type: 'error', text: 'شناسه چت پیدا نشد' });
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      console.log('📤 ارسال پیام به:', sendMessageUrl);
      const response = await axios.post(sendMessageUrl, {
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML'
      }, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('✅ پیام ارسال شد:', response.data);
      
      if (response.status === 200 && response.data.ok) {
        setSendResult({ 
          type: 'success', 
          text: '✅ پیام با موفقیت ارسال شد!',
          data: response.data.result
        });
        setMessageText(''); // پاک کردن متن پس از ارسال موفق
        // دریافت مجدد بروزرسانی‌ها برای دیدن پیام ارسال شده
        setTimeout(() => fetchUpdates(), 1000);
      } else {
        throw new Error('ارسال پیام ناموفق بود');
      }
    } catch (err) {
      let errorMessage = err.message;
      
      if (err.response) {
        errorMessage = `خطای سرور (${err.response.status}): ${JSON.stringify(err.response.data)}`;
        console.error('خطای سرور:', err.response.data);
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'مدت زمان درخواست به پایان رسید';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'خطای شبکه یا CORS';
      }
      
      setSendResult({ type: 'error', text: `❌ خطا در ارسال: ${errorMessage}` });
      console.error('❌ خطا در ارسال:', err);
    } finally {
      setSending(false);
    }
  };

  const clearUpdates = () => {
    setUpdates([]);
    setError(null);
    setSendResult(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'تاریخ نامشخص';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getUpdateType = (update) => {
    if (!update.message) return 'unknown';
    if (update.message.new_chat_members) return 'member-join';
    if (update.message.forward_from) return 'forwarded';
    if (update.message.text) return 'message';
    return 'other';
  };

  useEffect(() => {
    fetchUpdates();
    
    const interval = setInterval(() => {
      if (!loading) {
        fetchUpdates();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="app">
      <h1>📨 پیام‌های دریافتی از ربات</h1>
      
      {/* بخش ارسال پیام */}
      <div className="send-message-section">
        <h2>📤 ارسال پیام به ربات</h2>
        <div className="send-message-container">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="متن پیام خود را وارد کنید..."
            className="message-input"
            rows="3"
            disabled={sending}
          />
          <div className="send-controls">
            <button 
              onClick={sendMessage} 
              disabled={sending || loading}
              className="btn-send"
            >
              {sending ? '⏳ در حال ارسال...' : '📤 ارسال پیام'}
            </button>
            {updates.length > 0 && (
              <span className="chat-info">
                💬 ارسال به: {updates[0]?.message?.chat?.title || updates[0]?.message?.chat?.first_name || 'چت خصوصی'}
              </span>
            )}
          </div>
          {sendResult && (
            <div className={`send-result ${sendResult.type}`}>
              {sendResult.text}
            </div>
          )}
        </div>
      </div>

      <div className="controls">
        <button onClick={fetchUpdates} disabled={loading} className="btn-primary">
          {loading ? '⏳ در حال دریافت...' : '📥 دریافت پیام‌ها'}
        </button>
        {updates.length > 0 && (
          <button onClick={clearUpdates} className="btn-secondary">
            🗑️ پاک کردن
          </button>
        )}
      </div>

      {error && (
        <div className="error">
          <strong>❌ خطا:</strong> {error}
          {(error.includes('CORS') || error.includes('Network Error')) && (
            <div className="cors-hint">
              <p>💡 راه‌حل‌های رفع خطا:</p>
              <ul>
                <li>تنظیم rewrite در فایل <code>next.config.mjs</code></li>
                <li>بررسی اتصال به اینترنت</li>
                <li>استفاده از VPN در صورت نیاز</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {updates.length > 0 ? (
        <div className="updates-container">
          <div className="stats">
            <span>📊 تعداد پیام‌ها: {updates.length}</span>
          </div>
          
          {updates.map((update) => (
            <div key={update.update_id} className="update-item">
              <div className="update-header">
                <h3>🔄 بروزرسانی #{update.update_id}</h3>
                <span className={`badge ${getUpdateType(update)}`}>
                  {getUpdateType(update)}
                </span>
              </div>
              
              {update.message && (
                <>
                  <div className="message-meta">
                    <p><strong>🆔 شناسه پیام:</strong> {update.message.message_id}</p>
                    <p><strong>📅 تاریخ:</strong> {formatDate(update.message.date)}</p>
                  </div>
                  
                  {update.message.from && (
                    <div className="info-section">
                      <h4>👤 فرستنده</h4>
                      <p><strong>نام:</strong> {update.message.from.first_name} {update.message.from.last_name || ''}</p>
                      <p><strong>شناسه کاربر:</strong> {update.message.from.id}</p>
                      {update.message.from.username && (
                        <p><strong>نام کاربری:</strong> @{update.message.from.username}</p>
                      )}
                    </div>
                  )}
                  
                  {update.message.chat && (
                    <div className="info-section">
                      <h4>💬 چت</h4>
                      <p><strong>نام:</strong> {update.message.chat.title || update.message.chat.first_name || 'چت خصوصی'}</p>
                      <p><strong>نوع:</strong> {update.message.chat.type}</p>
                      {update.message.chat.username && (
                        <p><strong>نام کاربری:</strong> @{update.message.chat.username}</p>
                      )}
                    </div>
                  )}

                  {update.message.text && (
                    <div className="message-content">
                      <h4>📝 متن پیام</h4>
                      <div className="message-text">{update.message.text}</div>
                    </div>
                  )}

                  {update.message.new_chat_members && (
                    <div className="info-section">
                      <h4>👥 اعضای جدید</h4>
                      <ul>
                        {update.message.new_chat_members.map((member) => (
                          <li key={member.id}>
                            {member.first_name} {member.last_name || ''} 
                            {member.username ? ` (@${member.username})` : ' (بدون نام کاربری)'}
                            <span className={`badge ${member.is_bot ? 'bot' : 'user'}`}>
                              {member.is_bot ? 'ربات' : 'کاربر'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {update.message.forward_from && (
                    <div className="info-section">
                      <h4>↩️ فوروارد شده از</h4>
                      <p>{update.message.forward_from.first_name} {update.message.forward_from.last_name || ''}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && (
          <div className="empty-state">
            <p>📭 هنوز پیامی دریافت نشده است</p>
            <p className="hint">برای دریافت پیام‌ها، دکمه بالا را بزنید</p>
          </div>
        )
      )}
    </div>
  );
}