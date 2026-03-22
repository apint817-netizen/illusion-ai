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

    // Step 2: Call the /call/image endpoint (Gradio 4+)
    const callRes = await fetch(`${GRADIO_SPACE}/call/image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [{
          path: filePath,
          meta: { _type: "gradio.FileData" }
        }],
      }),
    });

    if (!callRes.ok) {
      const errText = await callRes.text();
      console.error("Call failed:", callRes.status, errText);
      return NextResponse.json({ error: `Ошибка AI call: ${callRes.status} ${errText}` }, { status: 502 });
    }

    const callResult = await callRes.json();
    const eventId = callResult.event_id;

    if (!eventId) {
      console.error("No event_id:", JSON.stringify(callResult));
      return NextResponse.json({ error: 'AI не вернул event_id' }, { status: 502 });
    }

    // Step 3: Fetch result via SSE endpoint /result/{event_id}
    const resultRes = await fetch(`${GRADIO_SPACE}/call/image/${eventId}`);
    if (!resultRes.ok) {
      const errText = await resultRes.text();
      console.error("Result failed:", resultRes.status, errText);
      return NextResponse.json({ error: `Ошибка получения результата: ${resultRes.status}` }, { status: 502 });
    }

    const resultText = await resultRes.text();
    
    // Parse SSE response - look for "data:" line with JSON
    const lines = resultText.split('\n');
    let outputData: any = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === 'event: complete' || line === 'event:complete') {
        // Next data line is our result
        const dataLine = lines[i + 1]?.trim();
        if (dataLine?.startsWith('data:')) {
          try {
            outputData = JSON.parse(dataLine.substring(5).trim());
          } catch (e) {
            console.error("Failed to parse data line:", dataLine);
          }
        }
      }
    }

    if (!outputData) {
      // Fallback: find any data line with JSON
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data:') && trimmed.includes('"url"')) {
          try {
            outputData = JSON.parse(trimmed.substring(5).trim());
          } catch (e) {}
        }
      }
    }

    if (!outputData) {
      console.error("Could not parse result SSE:", resultText.substring(0, 500));
      return NextResponse.json({ error: 'Не удалось распознать ответ AI' }, { status: 502 });
    }

    // outputData should be array: [slider_data, file_data]
    // file_data (index 1) has the PNG file with transparent background
    const outputFile = Array.isArray(outputData) ? outputData[1] : outputData?.data?.[1];
    
    if (!outputFile?.url && !outputFile?.path) {
      console.error("No output file in result:", JSON.stringify(outputData).substring(0, 500));
      return NextResponse.json({ error: 'AI не вернул изображение' }, { status: 502 });
    }

    // Step 4: Download the result image
    const resultUrl = outputFile.url 
      ? (outputFile.url.startsWith('http') ? outputFile.url : `${GRADIO_SPACE}${outputFile.url}`)
      : `${GRADIO_SPACE}/file=${outputFile.path}`;
    
    const imageRes = await fetch(resultUrl);
    if (!imageRes.ok) {
      console.error("Image download failed:", imageRes.status);
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
