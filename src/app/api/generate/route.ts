import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, format } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Hugging Face API Key is missing' }, { status: 500 });
    }

    // Map format to width and height
    let width = 1024;
    let height = 1024;
    if (format === '3:4 (WB)') {
      width = 768;
      height = 1024;
    } else if (format === '16:9 (Баннер)') {
      width = 1280;
      height = 720;
    }

    // Enhance prompt for product photography
    const finalPrompt = `Professional product photography background, empty center, ${prompt}, ultra realistic, 8k resolution, cinematic lighting --no object, text, watermark`;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: { 
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ 
          inputs: finalPrompt,
          parameters: {
            width,
            height,
            num_inference_steps: 4, // Schnell model needs few steps
          }
        }),
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
        'Content-Type': 'image/jpeg',
      },
    });

  } catch (error) {
    console.error('Error in generate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
