"use client";
// pages/index.js یا app/page.js
import React, { useState, useEffect } from 'react';

function HomePage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      // استفاده از API خودمان (بدون مشکل CORS)
      const response = await fetch('/api/bale/getMessages');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.ok) {
        // فیلتر کردن پیام‌های کانال
        const channelMessages = data.result.filter(
          (update) => update.message && 
          update.message.chat && 
          update.message.chat.type === 'channel'
        );

        const formattedMessages = channelMessages.map((update) => ({
          id: update.update_id,
          messageId: update.message.message_id,
          channelTitle: update.message.chat.title || 'کانال بدون نام',
          channelUsername: update.message.chat.username || '',
          text: update.message.text || 'پیام متنی ندارد',
          date: new Date(update.message.date * 1000).toLocaleString('fa-IR'),
          hasMedia: !!update.message.photo || 
                   !!update.message.video || 
                   !!update.message.document,
          isForwarded: !!update.message.forward_from || 
                       !!update.message.forward_origin,
        }));

        setMessages(formattedMessages);
      } else {
        setError('خطا در دریافت پیام‌ها');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('خطا در ارتباط با سرور: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📢 پیام‌های کانال</h1>
      
      <button 
        onClick={fetchMessages} 
        style={styles.updateButton}
        disabled={loading}
      >
        {loading ? '⏳ در حال بارگذاری...' : '🔄 بروزرسانی'}
      </button>

      {error && (
        <div style={styles.error}>
          ❌ {error}
        </div>
      )}

      <div style={styles.messagesList}>
        {messages.length === 0 && !loading && !error && (
          <p style={styles.noMessages}>هیچ پیامی در کانال یافت نشد</p>
        )}

        {messages.map((msg) => (
          <div key={msg.id} style={styles.messageCard}>
            <div style={styles.messageHeader}>
              <span style={styles.channelTitle}>📌 {msg.channelTitle}</span>
              {msg.channelUsername && (
                <span style={styles.channelUsername}>@{msg.channelUsername}</span>
              )}
              <span style={styles.messageDate}>{msg.date}</span>
            </div>
            
            <div style={styles.messageBody}>
              <p style={styles.messageText}>{msg.text}</p>
              {msg.hasMedia && (
                <span style={styles.mediaBadge}>📎 دارای رسانه</span>
              )}
              {msg.isForwarded && (
                <span style={styles.forwardedBadge}>↩️ بازنشر شده</span>
              )}
            </div>
            
            <div style={styles.messageFooter}>
              <span style={styles.messageId}>شناسه: {msg.messageId}</span>
            </div>
          </div>
        ))}
      </div>

      {messages.length > 0 && (
        <div style={styles.stats}>
          📊 تعداد کل پیام‌ها: {messages.length}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    direction: 'rtl',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    color: '#333',
    borderBottom: '3px solid #4CAF50',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #ef9a9a',
  },
  noMessages: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
  messagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '18px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
  },
  messageHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  channelTitle: {
    fontWeight: 'bold',
    color: '#1a237e',
    fontSize: '16px',
  },
  channelUsername: {
    color: '#666',
    fontSize: '14px',
    backgroundColor: '#f0f0f0',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  messageDate: {
    color: '#999',
    fontSize: '12px',
    marginRight: 'auto',
  },
  messageBody: {
    marginBottom: '10px',
  },
  messageText: {
    margin: '0',
    lineHeight: '1.6',
    color: '#333',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  mediaBadge: {
    display: 'inline-block',
    backgroundColor: '#e3f2fd',
    color: '#0d47a1',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    marginTop: '8px',
  },
  forwardedBadge: {
    display: 'inline-block',
    backgroundColor: '#fff3e0',
    color: '#e65100',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    marginTop: '8px',
    marginRight: '8px',
  },
  messageFooter: {
    borderTop: '1px solid #eee',
    paddingTop: '8px',
    marginTop: '8px',
  },
  messageId: {
    color: '#999',
    fontSize: '11px',
  },
  stats: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#2e7d32',
    fontWeight: 'bold',
  },
};

export default HomePage;