interface Env {
  GEMINI_API_KEY: string
}

interface RequestBody {
  task: string
  name?: string
  description?: string
  step: number
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
    const { task, name, description, step } = body

    if (!env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    let prompt = ''
    if (step === 1) {
      prompt = `You are helping someone design an LLM Skill (a folder with prompts and scripts for Claude).

They described their task as: "${task}"

Give ONE brief tip (max 30 words) to make this task description more specific or actionable. Be encouraging. If it's already good, say so briefly.`
    } else if (step === 2) {
      prompt = `You are helping someone design an LLM Skill.

Task: "${task}"
Skill name: "${name}"
Description: "${description}"

Give ONE brief tip (max 30 words) about the name or description. Focus on clarity and whether it would help Claude understand when to use this skill.`
    } else {
      return new Response(
        JSON.stringify({ tip: 'Looking good!' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          }
        })
      }
    )

    if (!response.ok) {
      return new Response(
        JSON.stringify({ tip: 'Could not get feedback right now.' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const tip = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Looking good!'

    return new Response(
      JSON.stringify({ tip }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ tip: 'Could not get feedback.' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
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
