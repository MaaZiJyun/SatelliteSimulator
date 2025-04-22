// app/api/compute/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("💥 POST handler triggered");

  try {
    const body = await req.json();

    console.log("Received body:", body);

    // 调用外部服务进行计算
    const response = await fetch('http://localhost:8000/compute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      return NextResponse.json({ error: errorDetails.detail || 'Computation failed' }, { status: 500 });
    }

    const result = await response.json();

    return NextResponse.json({
      message: 'Computation done',
      result: result,  // 从外部 API 获取的结果
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
