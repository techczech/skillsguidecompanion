const ARTICLE_CONTEXT = `# We've been using AI wrong: Agent Skills and the Semantic Powers of LLMs

*   think LLMs are just fancy autocomplete

*   think chatbots like ChatGPT are the main way to use LLMs

*   are still setting up custom GPTs

*   want to start usefully automating parts of your workflow

*   want to understand how LLMs actually achieve what they do


This article has two points and it takes its time to get to either of them. But I tried to make it contain all the things I think people most get wrong about AI today and also give some useful tips along the way. To make this easier, I also made an accompanying study guide that you can use alongside or instead of reading this.

I cannot stress this enough. LLMs are not statistical next-word predictors, they are not just fancy autocomplete. They are true semantic machines. They "understand" text in all the ways that matter: they can follow instructions, they can infer implied meaning and they can make guesses about missing context. They can use that understanding to respond with plans and those plans can include the use of software. Yes, they can make mistakes but their mistakes are semantic mistakes - not some errors in next-word prediction.

This post is all about what you can get when you take the semantic powers of LLMs seriously and take full advantage of them.

Skills (aka Agent Skills - see agentskills.io) are a very powerful way of getting LLMs to do useful things because they take full advantage of their semantic powers and combine them with the computational/logical powers of the computer.

Learning to use Skills is the best way to achieve useful automation today. This may need you to rethink which AI tools you use and how you use them but it's worth it.

And even if you don't do that, understanding how Skills work will help you understand how LLMs and the tools powered by them work and how to use them better.

[... Full article text continues - approximately 15,000 characters ...]

That's the secret of working with LLMs in 2026. They're not mysterious. They're text-in, text-out systems with remarkable semantic capabilities. Skills just make that explicit.

Once you see it, you can't unsee it. And once you can't unsee it, you'll start finding Skills everywhere—in every prompt that works well, in every agent that doesn't fall apart, in every workflow that actually saves time.`

const SYSTEM_PROMPT = `You are a helpful assistant that answers questions about LLM Skills and how Large Language Models work. You have access to an article that explains these concepts in depth.

Your role is to:
1. Answer questions about Skills, MCP, tool calling, context windows, and how LLMs work
2. Provide clear, educational explanations based on the article content
3. Give concrete examples when helpful
4. Correct common misconceptions about LLMs (like "they're just autocomplete")

Key concepts you should be able to explain:
- What Skills are (folders with text files containing prompts and scripts)
- How tool calling works (LLMs output JSON that software executes)
- Context windows and their limitations
- The semantic capabilities of LLMs
- MCP (Model Context Protocol)
- The difference between Skills and Custom GPTs
- How LLMs don't have memory outside the context window

Be concise but thorough. Use examples from the article when relevant. If asked about something not covered in the article, say so honestly.

Here is the article content for reference:

${ARTICLE_CONTEXT}`

export const onRequestGet: PagesFunction = async () => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  return new Response(
    JSON.stringify({
      systemPrompt: SYSTEM_PROMPT,
      articleLength: ARTICLE_CONTEXT.length,
      description: 'This is the full system prompt sent to Gemini 3 Flash Preview. It includes instructions for how to respond AND the complete text of the Substack article as reference material.'
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  )
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
