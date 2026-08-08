// یک فایل تست موقت ایجاد کنید: app/api/test/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // تست اتصال به بله
    const response = await fetch('https://tapi.bale.ai', {
      method: 'HEAD',
    });
    
    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      message: 'Connection successful'
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}