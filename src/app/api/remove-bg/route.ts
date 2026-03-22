import { NextResponse } from 'next/server';

const GRADIO_SPACE = "https://briaai-bria-rmbg-2-0.hf.space";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Step 1: Upload file to Gradio Space
    const uploadForm = new FormData();
    uploadForm.append("files", image, image.name || "image.png");

    const uploadRes = await fetch(`${GRADIO_SPACE}/upload`, {
      method: "POST",
      body: uploadForm,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Upload failed:", uploadRes.status, errText);
      return NextResponse.json({ error: `Ошибка загрузки: ${uploadRes.status}` }, { status: 502 });
    }

    const uploadedFiles: string[] = await uploadRes.json();
    const filePath = uploadedFiles[0];

    // Step 2: Call the /image endpoint via Gradio API
    const predictRes = await fetch(`${GRADIO_SPACE}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fn_index: 0,
        data: [{
          path: filePath,
          meta: { _type: "gradio.FileData" }
        }],
        session_hash: Math.random().toString(36).substring(2),
      }),
    });

    if (!predictRes.ok) {
      const errText = await predictRes.text();
      console.error("Predict failed:", predictRes.status, errText);
      return NextResponse.json({ error: `Ошибка AI: ${predictRes.status}` }, { status: 502 });
    }

    const result = await predictRes.json();
    
    // The result contains [slider_data, file_data]
    // file_data (index 1) has the PNG with removed background
    const outputFile = result.data?.[1];
    if (!outputFile?.url) {
      console.error("No output URL in result:", JSON.stringify(result));
      return NextResponse.json({ error: 'AI не вернул результат' }, { status: 502 });
    }

    // Step 3: Download the result image
    const resultUrl = outputFile.url.startsWith('http') 
      ? outputFile.url 
      : `${GRADIO_SPACE}/file=${outputFile.path}`;
    
    const imageRes = await fetch(resultUrl);
    if (!imageRes.ok) {
      return NextResponse.json({ error: 'Не удалось скачать результат' }, { status: 502 });
    }

    const resultBuffer = await imageRes.arrayBuffer();
    return new NextResponse(resultBuffer, {
      headers: { 'Content-Type': 'image/png' },
    });

  } catch (error: any) {
    console.error('Error in remove-bg:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
