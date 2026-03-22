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
      return NextResponse.json({ error: 'Hugging Face API Key is missing. Вставьте ключ HUGGINGFACE_API_KEY в переменные окружения.' }, { status: 500 });
    }

    const imageBuffer = await image.arrayBuffer();

    // Call Hugging Face API for BRIA RMBG-1.4 model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/briaai/RMBG-1.4",
      {
        headers: { 
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/octet-stream"
        },
        method: "POST",
        body: imageBuffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API Error:", errorText);
      return NextResponse.json({ error: `Failed from AI: ${errorText}` }, { status: response.status });
    }

    const resultBuffer = await response.arrayBuffer();
    
    return new NextResponse(resultBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });

  } catch (error) {
    console.error('Error in remove-bg:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
