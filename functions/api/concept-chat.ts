interface Env {
  GEMINI_API_KEY: string
}

interface ChatMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
}

interface RequestBody {
  message: string
  concept: {
    title: string
    tagline: string
    explanation: string
    example?: string
  }
  history?: ChatMessage[]
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    const body: RequestBody = await request.json()
    const { message, concept, history = [] } = body

    if (!env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const systemPrompt = `You are helping someone understand the concept of "${concept.title}" in the context of LLM Skills and how Large Language Models work.

Concept: ${concept.title}
Tagline: "${concept.tagline}"
Explanation: ${concept.explanation}
${concept.example ? `Example: ${concept.example}` : ''}

Your role:
- Answer questions about this specific concept
- Provide additional examples when asked
- Explain how this concept relates to LLM Skills
- Keep responses concise (2-3 paragraphs max)
- Use simple language and concrete examples

If asked about something unrelated to this concept or LLMs, gently redirect back to the topic.`

    const contents = [
      ...history,
      { role: 'user' as const, parts: [{ text: message }] }
    ]

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      }
    )

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to get response' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not generate response.'

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
