// app/api/eitaa/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { chatId, text, options } = body;

    const response = await fetch(`https://eitaayar.ir/api/bot512974:4249c370-c1b4-43cd-b8d3-dc8e4f6ca1cd/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        ...options,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('خطا در ارسال به ایتایار:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}