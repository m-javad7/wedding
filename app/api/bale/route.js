// app/api/bale/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  // توکن باید به صورت رشته باشد
  const BOT_TOKEN = "CBDGJA0OSJRJABPOQDDPEDXVKMLYQXISGUTBEAQREVQUGPCWZETZNFDSJLXQLYWD";
  
  if (!BOT_TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'Bot token not configured' },
      { status: 500 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // استفاده از متغیر توکن در URL
    const response = await fetch(`https://tapi.bale.ai/bot${BOT_TOKEN}/getUpdates`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Bale API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Bale API Error:', error.message);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Failed to fetch messages',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// برای پشتیبانی از OPTIONS requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}