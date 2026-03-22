import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key отсутствует' }, { status: 500 });
    }

    const imageBuffer = await image.arrayBuffer();

    // Try multiple providers/endpoints for reliability
    const endpoints = [
      "https://router.huggingface.co/hf-inference/models/ZhengPeng7/BiRefNet",
      "https://router.huggingface.co/fal-ai/models/ZhengPeng7/BiRefNet",
    ];

    let lastError = "";

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          headers: { 
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/octet-stream"
          },
          method: "POST",
          body: imageBuffer,
        });

        if (response.ok) {
          const resultBuffer = await response.arrayBuffer();
          return new NextResponse(resultBuffer, {
            headers: { 'Content-Type': 'image/png' },
          });
        }

        lastError = `${url}: ${response.status} ${await response.text()}`;
        console.error("HF endpoint failed:", lastError);
      } catch (e: any) {
        lastError = `${url}: ${e.message}`;
        console.error("HF endpoint error:", lastError);
      }
    }

    return NextResponse.json({ error: `Все AI-провайдеры недоступны. Последняя ошибка: ${lastError}` }, { status: 502 });

  } catch (error) {
    console.error('Error in remove-bg:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
