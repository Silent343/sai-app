// SAI · Gemini proxy
// -----------------------------------------------------------------------------
// Pequeño backend que actúa como proxy hacia la API de Gemini. Su única razón de
// existir es mantener la GEMINI_API_KEY del lado del servidor: el frontend NUNCA
// la ve. El cliente solo conoce el puerto `/api/v1/assistant/reply` y este server
// se encarga de hablar con Google. Cambiar de Gemini a otro proveedor se hace
// aquí, sin tocar el frontend.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const PORT = process.env.AI_PROXY_PORT || 4000;
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const ENDPOINT = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const SYSTEM_INSTRUCTION = [
  'Eres SAI, un asistente de orientación en salud especializado en enfermedades',
  'infecciosas, pensado para el contexto de Lima, Perú. Ofreces información',
  'general y orientación temprana en español, de forma clara y empática.',
  'Reglas importantes:',
  '- NO entregas diagnósticos definitivos ni recetas; eres orientativo.',
  '- Ante síntomas de alarma recomiendas siempre acudir a un profesional o',
  '  centro de salud.',
  '- Si la consulta no es de salud, respondes con amabilidad y reconduces.',
  '- Respuestas concisas, en lenguaje sencillo, sin tecnicismos innecesarios.',
].join(' ');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true, model: MODEL }));

// Recibe el historial de la conversación y devuelve la respuesta del modelo.
// body: { messages: [{ role: 'user' | 'assistant', content: string }] }
app.post('/api/v1/assistant/reply', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({
      error: 'Falta GEMINI_API_KEY en el entorno del servidor (.env).',
    });
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  if (messages.length === 0) {
    return res.status(400).json({ error: 'No se recibió ningún mensaje.' });
  }

  // Mapea el dominio (user/assistant) al formato de Gemini (user/model).
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content ?? '') }],
  }));

  try {
    const response = await fetch(`${ENDPOINT(MODEL)}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
        generationConfig: { temperature: 0.6, maxOutputTokens: 800 },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('[gemini] HTTP', response.status, detail);
      return res
        .status(502)
        .json({ error: 'El asistente no está disponible en este momento.' });
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim() ||
      'Lo siento, no pude generar una respuesta en este momento.';

    return res.json({ reply });
  } catch (err) {
    console.error('[gemini] error', err);
    return res.status(502).json({ error: 'El asistente no está disponible en este momento.' });
  }
});

app.listen(PORT, () => {
  const keyState = API_KEY ? 'OK' : 'FALTANTE (define GEMINI_API_KEY en .env)';
  console.log(`SAI · Gemini proxy en http://localhost:${PORT}  [modelo: ${MODEL} · key: ${keyState}]`);
});
