import { NextResponse } from 'next/server';

const GRADIO_SPACE = "https://Qwen-Qwen2-5-72B-Instruct.hf.space";

export async function POST(req: Request) {
  try {
    const { description } = await req.json();
    
    if (!description) {
      return NextResponse.json({ error: 'Описание не указано' }, { status: 400 });
    }

    const prompt = `Ты — маркетолог для маркетплейсов (Wildberries, Ozon). 
Создай контент для инфографики карточки товара. Товар: "${description}"

Верни ТОЛЬКО JSON (без markdown, без пояснений):
{
  "title": "ЗАГОЛОВОК (2-3 слова, капсом)",
  "subtitle": "подзаголовок (2-4 слова)",
  "callouts": [
    {"text": "преимущество 1 (до 5 слов)", "icon": "эмоджи"},
    {"text": "преимущество 2", "icon": "эмоджи"},
    {"text": "преимущество 3", "icon": "эмоджи"},
    {"text": "преимущество 4", "icon": "эмоджи"}
  ],
  "badges": ["бейдж1", "бейдж2"]
}`;

    // Try to get text from a free Gradio Space LLM
    try {
      const callRes = await fetch(`${GRADIO_SPACE}/call/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [prompt, [], ""],
        }),
      });

      if (callRes.ok) {
        const callResult = await callRes.json();
        const eventId = callResult.event_id;
        
        if (eventId) {
          const resultRes = await fetch(`${GRADIO_SPACE}/call/chat/${eventId}`);
          const resultText = await resultRes.text();
          
          // Parse SSE
          const lines = resultText.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === 'event: complete' || lines[i].trim() === 'event:complete') {
              const dataLine = lines[i + 1]?.trim();
              if (dataLine?.startsWith('data:')) {
                const parsed = JSON.parse(dataLine.substring(5).trim());
                const text = Array.isArray(parsed) ? parsed[0] : parsed;
                // Extract JSON from the response
                const jsonMatch = typeof text === 'string' ? text.match(/\{[\s\S]*\}/) : null;
                if (jsonMatch) {
                  const cardContent = JSON.parse(jsonMatch[0]);
                  return NextResponse.json(cardContent);
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Gradio LLM error:", e);
    }

    // Fallback: generate locally from description
    const words = description.split(' ');
    return NextResponse.json({
      title: words.slice(0, 3).join(' ').toUpperCase(),
      subtitle: 'Лучший выбор',
      callouts: [
        { text: 'Высокое качество', icon: '✨' },
        { text: 'Быстрая доставка', icon: '🚀' },
        { text: 'Гарантия 1 год', icon: '🛡️' },
        { text: 'Лучшая цена', icon: '💰' },
      ],
      badges: ['ХИТ ПРОДАЖ', 'НОВИНКА'],
    });

  } catch (error: any) {
    console.error('Error in generate-text:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
