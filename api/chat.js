export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (process.env.CHAT_ENABLED !== 'true') {
    return res.status(503).json({
      error: 'Chat is currently disabled',
      code: 'chat_disabled'
    });
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "message"' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY env var' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content: 'You are a concise travel assistant helping test a website chatbot. If you are unsure, say so clearly.'
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'OpenAI API error',
        detail: data
      });
    }

    const reply = data.output_text || 'No response text returned.';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({
      error: 'Server error',
      detail: String(err?.message || err)
    });
  }
}
