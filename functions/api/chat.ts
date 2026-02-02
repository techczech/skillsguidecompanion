interface Env {
  GEMINI_API_KEY: string
}

interface ChatMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
}

interface RequestBody {
  message: string
  history?: ChatMessage[]
}

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

In late 2024, Anthropic released something called Model Context Protocol (usually referred to as MCP) and people looked at it and said "oh, that's nice". Then over the holidays everybody realized that not only is MCP "nice", it's the way to give Large Language Models access to complicated external systems with complicated APIs.

What was MCP's secret? Leaning into what we've known from the start, namely that Large Language Models are really good at example following. Really good. They don't just follow the form of the example but also the meaning - they "get it". Therefore, instead of giving them a complicated documentation about the exact format they have to use to ask for content from a database, we can just show them a simple example of what the other system wants, and they will follow it reliably.

So instead of the model having to write something like this based on really complicated documentation (which may or may not up to date or easy to find):

\`\`\`
app.get('/api/books', async (req, res) => {
  const author = req.query.author;
  const books = await db.query('SELECT title, year FROM books WHERE author = ?', [author]);
  res.json(books);
});
\`\`\`

The model can simply send a message to the server asking "what can you do for me" and the server responds with:

\`\`\`
{
  "name": "get_books_by_author",
  "description": "Retrieves a list of books from the database for a specific author",
  "inputSchema": {
    "type": "object",
    "properties": {
      "author": { "type": "string" }
    },
    "required": ["author"]
  }
}
\`\`\`

And the model then writes this in response:

\`\`\`
{
  "name": "get_books_by_author",
  "arguments": { "author": "J.R.R. Tolkien" }
}
\`\`\`

If you're not a programmer (and even if you are), the second way should be a lot easier for you to follow than the first. LLMs are really good programmers but just like the really good human programmers, the second way just "makes sense" to them "intuitively".

As a result, by relying on the semantic example following powers of LLMs (and their natural affinity for the format called JSON), 2025 was the year of everybody setting up MCP servers for their services. What Anthropic did was realise that we had been using LLMs wrong by not leaning into their semantic potential and just bruteforcing them into existing systems.

When people figured out that's what it was, everyone became MCP-pilled (as the kids call it) and before we knew it MCP was supported by Anthropic's biggest competitors OpenAI and Google and now MCP is an open standard with these big companies and others working together to maintain and improve the standard.

And now it's happened again. In late 2025, Anthropic released a new feature in their Claude chatbot called Skills. And, as before, everybody said "that's nice" and moved on with their lives. But over the course of December and then over the holidays people had some time to look at Skills more closely and a giant lightbulb suddenly came on over the entire AI industry: "doh, we've been using LLMs wrong", of course, Skills are the right way to go.

And they are. If you don't understand Skills, you don't understand how LLMs work. That's the bad news. Yes, you should immediately drop everything and learn about Skills and start using them (if you're using Claude or if you're coding).

But here's the good news. If you don't quite understand how LLMs work (and you're not alone in this), understanding Skills will help you understand much more about them and especially about the capabilities and limitations of the best LLMs as of early 2026 (and probably early 2027 as well - they will get much better but the foundations will probably remain the same).

Ok, now that I've built it up, you're going to expect something spectacular, but no, Skills, just like MCP before them, are incredibly simple. Because in a way, LLMs are simple. MCP made things simpler and so do Skills. This is what a Skill is:

> Skill is a folder with text files in it!

Yes, that's it. A folder with text files in it. It is that dumb and simple. Are they some sort of magic files, you ask? No, they are text files (with optionally some things like images, if you insist). Ok, so what? This is what is in a Skill folder:

1.  A file called \`SKILL.md\` that contains a description of what the skill does and what other files are available to the Skill. (Strictly speaking the file could be called anything but that's the convention so that any tool that supports skills knows where to look)

2.  A folder called \`references\` that contains as many \`.md\` files as you need (and that are listed in the \`SKILL.md\` file)

3.  An optional folder called \`scripts\` that contains any scripts that can be executed to perform an action

4.  An optional folder called \`assets\` that contains any images or other files that the skill may want to use

5.  And pretty much any other folder you want as long as you mention it in \`SKILL.md\`.


And that's it. In other words, a Skill is just a bunch of prompts in a bunch of text files in a folder on your computer. That's it. Nothing else.

This is what Skill folder looks like:

\`\`\`
my-skill/
   ├── SKILL.md          ← Main instructions
   ├── references/       ← Additional prompts
   │   └── style-guide.md
   └── scripts/          ← Executable code
       └── convert.py
\`\`\`

This is what the \`SKILL.md\` file looks like according to the official spec:

\`\`\`
---
name: my-skill-name
description: A clear description of what this skill does and when to use it
---

# My Skill Name

[Add your instructions here that the LLM will follow when this skill is active]

## Examples
- Example usage 1
- Example usage 2

## Guidelines
- Guideline 1
- Guideline 2
\`\`\`

If that sounds kind of like a custom GPT to you, you're not wrong. Custom GPT is a prompt that can refer to some files somewhere and possibly execute some scripts.

The revolutionary thing about Skills is that they are infinitely more flexible than Custom GPTs and also significantly more reliable.

Don't just take my word for it. Everybody seems to agree. And I mean EVERYBODY!

Here's why! You can simply "tell" your LLM-powered tool that it has access to a bunch of Skills and it will either remember to use the right one automatically or you can tell it to use it in a prompt. That simple. No special place you have to go. The skills are just available with a minimum of fuss. You don't even have to remember their exact name.

Want to share a Skill with somebody else? Easy, just send them a .zip file with the folder with all the Skill files in it. (Or put it on GitHub or anywhere else).

This is the beauty of Skills. If your chatbot or another tool using LLMs supports Skills, all it has to do is add a list of the available Skills and their brief descriptions to its system prompt. The model will then always know this is an option.

System prompts are already very long - the one Anthropic use for Claude is about 3,000 words - and LLMs have a limit to how much text they can look at once before they forget everything. This limit is called a **context window** and context windows have hard limits (more about which later). So adding too much text to the system prompt would mean that the LLM would have less space for chatting with you and also be more likely to go off-piste in the chats.

Here, again is the beauty of Skills. The description of what the Skill does is very short - as little as 20-50 words but not more than 1,024 characters (or about 150-200 words). This means that you can keep a lot of Skills mentioned in your System prompt and the LLM will still be able to pay proper attention to the chat you're having - only with the idea that it can use one of the Skills when needed.

But things get even cleverer. If you wanted to instruct a custom GPT, you had to write one really long prompt in a single place and then hope the LLM can keep it all in mind while it's responding. This made custom GPTs really limited. Skills solves the limitation through the magic of folders. Yes, a Skill is not ONE GIANT PROMPT (which would be silly) but rather a COLLECTION OF PROMPTS listed in the \`SKILL.md\` file which the LLM can load as it needs them. These prompts are still very long by the standard of what people type into a chat window, but by being split up, the model can choose which one it's seeing at any given moment.

But we know, not everything can be solved by a prompt. Right? For example, counting words is not something LLMs are great at. Or doing a lot of complicated arithmetic. That's what the \`scripts\` folder is for. Yes, you put little scripts that can run code when you need to perform the more traditionally computational tasks. Including quite complicated things like running some other code on your computer or calling an external API!

Now, we know (right?) that LLMs can write snippets of code and ask the chatbot to run them? It's called "function calling" or "code execution" (or "Code Interpreter" in ChatGPT). But the problems is that the LLM will write the code slightly differently every time - not necessarily badly, but differently. Having the code premade in the \`scripts\` folder means that it will run exactly the same every time. (Of course, you will have used an LLM to write the code for you. Right?)

And that's it.

You can read all about Skills on Agent Skills (agentskills.io). The official line is that Skills enable:

> *   **Domain expertise**: Package specialized knowledge into reusable instructions, from legal review processes to data analysis pipelines.
>
> *   **New capabilities**: Give agents new capabilities (e.g. creating presentations, building MCP servers, analyzing datasets).
>
> *   **Repeatable workflows**: Turn multi-step tasks into consistent and auditable workflows.
>
> *   **Interoperability**: Reuse the same skill across different skills-compatible agent products.
>

This may or may not mean a lot to you but looking at the example Skills Anthropic shared on their GitHub should clear things up. The one that made the lightbulb go off over my head was the PowerPoint skill. I've long wanted an LLM to make slideshows for me but they were always very unreliable. The PowerPoint file format is complicated and while the LLM can write it, it's fraught with possibility for errors. This is one of the instruction in that \`SKILL.md\` file:

> If you just need to read the text contents of a presentation, you should convert the document to markdown:
>
> \`\`\`
> # Convert document to markdown
> python -m markitdown path-to-file.pptx
> \`\`\`

Yes, that's right. Give the LLM an exact code to execute and it will do this extremely complicated thing the same way every time. In the PowerPoint Skill the \`scripts\` folder is filled with useful scripts with pretty self-explanatory file names like \`html2pptx.js\` and \`rearrange.py\`.

Another useful Skill to look at is the Skill Creator skill. Claude or another LLM can use to create more skills in the right format. The \`SKILL.md\` file of the Skill Creator contains little gems like this:

> The context window is a public good. Skills share the context window with everything else Claude needs: system prompt, conversation history, other Skills' metadata, and the actual user request.
>
> **Default assumption: Claude is already very smart.** Only add context Claude doesn't already have. Challenge each piece of information: "Does Claude really need this explanation?" and "Does this paragraph justify its token cost?"

There's also this fundamental truth many people forget about LLM prompting:

> Prefer concise examples over verbose explanations.

But it also contains a script called \`init_skill.py\`. What does that script do? When it runs, the script creates all the right folders and files with the right name, structure and starting content on your computer that the LLM can then write to. The same way every time! Neat!

This is so clever that the people who got the message are now creating skills for almost everything. There have been be attempts at prompt marketplaces and selling GPTs via the store that went nowhere. A simple prompt is not that valuable and neither is a GPT which is basically a prompt +. But a Skill can be immensely valuable. Unlike GPTs, Skills can take a days or weeks to create and tweak to get right and getting a shortcut on that time can be worth a lot of money.

Now, what you can use Skills for? Anything you would like to use an LLM for in a systematic way. People have used it to help with marketing campaigns, research in a particular area, or even more crazy complicated things like I just did with this skill that creates a handout website based on a set of PowerPoint slides - like this one. That skill has scripts that unpack the .pptx file and send images in it to Gemini 3 Flash (or a local model) and analyze them. I also have a skill that converts my rough notes into slides using my preferred style including SmartArt.

I've made a set of skills I'm calling \`dominikslifeskills\` that have lots of information Claude may need about me at any time. From my CV to my writing style and writing topics.

I've also made a public skill based on my research into readability to help people create readable text.

At the moment, the only major chatbot that supports Skills is Anthropic's Claude. But all the big coding agents do. The AgentSkills website lists these coding tools from Anthropic's big competitors:

*   Gemini CLI

*   Google Antigravity

*   Cursor

*   GitHub

*   VS Code

*   Claude Code

*   OpenAI Codex


So we can expect that at least OpenAI will include them in the desktop version of ChatGPT. Gemini only works on the web and skills make a lot less sense there because of their reliance on local files and scripts (but that could certainly be overcome).

Skills are interesting in their own right but even if you don't use any of these tools, you should still pay attention because they explain a lot about how LLMs work and what they can and cannot do.

If you already understand how LLMs work, then you fully understand how Skills work just from the description above and if that is too abstract simply reading through one of the Skills should make it obvious (I admit I first read about Skills and thought "that's nice" - I'll have to look at it at some point - then I read through a skill and my life changed forever - or at least Anthropic come up with their next "that's nice" idea in the fall).

But maybe you just thought an LLM was the thing that responds to you in ChatGPT and probably does something else very technical that feels kind of like (occasionally slightly glitchy) magic. So, here are three things Skills can teach you about Large Language Models:

Yes, we often say things like "the model searched" or "the model used a tool" or "the model looked up information". None of that is accurate.

The LLM is basically a blob of numbers on a server somewhere that some software uses to calculate the next word (or more accurately token) to add to the end of any text that it is given. Some people say this means it just "fills in the blank" or is really "just a glorified autocomplete". Yes, that is sort of technically accurate but it obscures more than it reveals. The word "autocomplete" implies that this is a dumb and mechanical process - we all know how bad the next word prediction is on our phone. That is because the autocompletion on your phone is based on word frequencies.

But the numbers inside the model are NOT frequencies. They are vectors that represent meaningful relationships between concepts. There's much more to it but what it adds up to is something that is equivalent to the models having a "deep semantic understanding of text". And a model can use that understanding to choose the next word to fit into the semantic puzzle. And then it adds another one. And another one. Until the text is complete. The model may not "really understand" in exactly the same a human does but the effect is that it works as if it did.

And you will get much more out of the LLM if you treat it as if it does understand what you want in a similar way another human would. You have to learn about the way the model tends to interpret what you say but you also have to learn about the idiosyncrasies of a person you work with.

But that feeling of understanding has a downside because it is easy to start assuming that the model can do other things that a human can do - such as "go and look at a webpage". But it can't - it can only read in and send out text - nothing else. Really!

Everything you see in your chat window is not the "model" but some software that is passing the text between you and the model. And that software (be it ChatGPT or Claude Code) takes the text from the model and shows it to you.

How does something that can "only read and write text" use tools? Easy. The text the model outputs can be a computer command wrapped around a bit of code that says what to do with the command. And the software that is receiving the text from the LLM is simply watching for the right string of characters and then executes the code. So when the user asks the LLM to tell them what files are in a folder, the LLM would do something similar to what an old-timey computer user would do. Or something very similar. Before we had modern user interfaces we can click on, to see what files are in a folder, a computer user would have to type in a command in the terminal (aka the Shell). On Linux or MacOS this would be something like:

> \`$ ls -la\`

The LLM has to do something similar but it also has to make it clear to the software that is watching the text it's putting out that it is a command to be executed. So it puts out something like this.

\`\`\`
{
  "name": "execute_shell_command",
  "arguments": {
    "command": "ls -la",
    "cwd": "/Users/username/Documents"
  }
}
\`\`\`

\`ls\` stands for "list" (\`dir\` on old DOS machines) - so when the software - such as Claude Cowork or Claude Code or Cursor - runs the command for the model. The software then reads in the list of files from the command and sends it back for the LLM to read and output some more text.

The whole thing is called a "tool call" or "function call" and that's kind of what is powering the whole agent revolution.

The real power of tools use comes from the fact that the LLM can use almost any software on your computer that can be controlled by typing in commands in the Terminal. And lots more apps than you imagine can be controlled this way.

For example, the web app hosting company Vercel has an app that can be given commands and the modern LLMs generally know it (or if they don't they can search for it). So a model like Claude can generate text that looks something like this:

\`\`\`
{
  "name": "execute_shell_command",
  "arguments": {
    "command": "vercel --prod --yes --name my-custom-site",
    "cwd": "./my-web-app"
  }
}
\`\`\`

This can be used for almost an infinite number of things:

*   Searching the web (yes, that's a tool call - usually built in to the app)

*   Reading or writing a file (yes, those are also tool calls)

*   Running a script the LLM just wrote

*   etc.


Of course, the danger is that the LLM could also run a command like \`rm -rf /\` which will delete all your files. Which means that the apps usually will not execute anything without approval - but some have a 'YOLO' mode that just runs everything the LLM says it should. I and many others run Claude Code in YOLO mode!

So, now we know that models can "only" write text based on what they "read" in the text they were given. That's what most people experience as "chat". They ask ChatGPT a question and one of the the GPT-5 series models that power it will generate a nice sounding answer.

But that's only scratching the surface of what the model can "write" in response to "what they read". The model can follow quite complex instructions with things like:

> First do this, then do that but only if the user tells you it's OK.

Everybody now knows that models make mistakes but the latest generation of models makes a lot fewer mistakes in following instructions - they've been pretty good at it for a while but we've crossed a threshold in late 2025 with the release of Claude 4.5 Opus and GPT-5.2 Thinking/Codex (and also Gemini 3 Pro and other open models) that can follow quite complex instructions faithfully.

And what's more, they can also keep track of a lot more tool calls than the models of early 2025 could, which means they can run for a lot longer. They follow the instructions, run a tool call, get a result back, look at the instructions again and see what they should do with the result, and so on. It is a wonder to behold.

So when the model reads the \`SKILL.md\` file and it says something "you can find more information about it in \`references/moreinfo.md\` make sure you only use it when the user says 'boo'", the model will keep that in its context window. And then when the user includes \`boo\` somewhere in their prompt, the model will run a tool call that will load the file \`moreinfo.md\` and read the instructions in it. And if those instructions say 'Run \`ghost_in_the_machine.py\` in \`skill/scripts\` the model will run that script.

Sometimes the model can happily follow the instructions and send tool calls back and forth for 20 or more minutes and people have even had it run for hours or days. (Note: Some of that time may be spent by the model waiting for the results of the tool call - which can be even an hour if you're uploading a large website over a slow connection.)

But Skills don't just take advantage of the models' capabilities, they also help solve of their limitations.

I keep saying that models can "read" text but they don't read it like you or I do. When people read text, they can only see a little bit of it at once but (assuming their mind is not wandering) as they read, they build up a mental picture of what the text is about. That mental picture leaves a trace in their mind so that when they go do or read something else, this trace will still be there and will impact on future actions.

When people read text, they mostly cannot quote from it very well unless they go back to it and read the particular passage or memorize it very carefully. But the mental picture is there. Sometimes (no, most times) the mental picture is incomplete or even wrong in many ways but it's still usable. We can use it to decide to check back or use the incomplete trace to make a decision. For example, we may not remember why we shouldn't walk down a particular street we read about in the News but we will remember not to do it.

Not so LLMs. They can see enormous amounts of text at once (anywhere between 4,000 and 1 million words). But that text leaves no trace. Despite popular misconception, the LLM is just an inert blob of numbers that does not change as it is being used. There's no "inner life" there. No more than there is in an Excel spreadsheet. Unless the Excel software is running and we typed in some new numbers, the formulas in a spreadsheet just sit there. They are not secretly adding up numbers behind our backs. The same with LLMs.

So that may make you feel safer but it comes with a downside. The downside that is at the very heart of the Schemas and Propositions blog. How do we give compress knowledge accumulated over hours or days of interaction into a limited amount of text that fits in a context window?

Most LLMs that run agentic applications have context windows that can fit about 200 thousand tokens (or about 150,000 English words). That may sound like a lot but it as you could see the tool calls take up a lot of space. And they add up quickly. You can easily fill up the context window in an hour of working (or less).

Or imagine you do a search on Google and the search finds 200 results. If each of those results if 800 words, that fills up the context window very quickly. (Plus, remember that's the overhead of the system prompt and anything the LLM itself wrote as part of that chat is also a part of it.)

So how do LLMs handle this? They don't. They just happily keep generating text based on what they "see" unaware of anything outside the context window. Remember, they have no memory of anything outside of what they see in their context window at the moment of generation.

Instead, the system running the LLM keeps track of the context window and when it's close to filling up, it starts a process that will ask the LLM to summarize the context so far, throw everything else away (or move it to a file) and continue the process just based on that summary.

I know. That's a recipe for forgetting important information, you're thinking. And you're right. That's one of the big unsolved problems of Large Language Models today. That's why it's always a good idea when working on a large project to ask the LLM to keep a close log of everything it's done.

Skills don't exactly solve the context window problem but they offer a very elegant and effective workaround. Using the tool calling and instruction following capabilities of the LLM, they simply rely on the LLM to be able to read the short notice that the skill is available in the system prompt, write a tool call to open the skill file, read the contents of the \`SKILL.md\` file and follow instructions. The \`SKILL.md\` may in turn instruct the model to make a series of tool calls and run scripts as needed.

This is both simple and effective.

Did I mention that the models only write based on what they have in their context window right now? Yes. Well, let me mention it again. This is a fundamental limitation that chatbots and other apps have tried to solve for a long time.

The first solution was simply ignoring the problem. Most of the time the user will not notice. This was soon replaced by "hidden summarisation" which is still the dominant solution. But most chatbots now also use "memories" which are basically notes that the model makes (using a tool call) when it sees something the user says that looks like it may be useful.

But memories are just short notes that don't have any depth behind them. Often they are enough - like "Dominik is vegetarian" but even more frequently they are not - like "Dominik gave a lecture entitled 'What are LLMs good for'". The first note contains everything you need to know about Dominik's dietary preferences in almost any context, the second one may indicate he thinks LLMs are useless or that he has a long list of good uses for LLMs but not what that list is.

Skills fix that. They are sort of a directory of knowledge that the LLM can follow. There's a limit to how extensive this can be - a whole company's knowledge base may be too much for it - but a department's style guide or a small set of policy documents would not be.

There are other ways of dealing with very large knowledge bases (that come with their own issues) but skills are a very elegant solution for smaller ones.

You don't need to be a programmer to understand Skills. Go to Anthropic's Skills repository and open any Skill folder. Read the SKILL.md file. Look at what's in references. If there's a scripts folder, glance at the file names.

You'll notice something: there's no magic here. It's just text files telling the model what to do and when. The complexity comes from what those instructions say, not from any special technology.

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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    const body: RequestBody = await request.json()
    const { message, history = [] } = body

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Build conversation history for Gemini
    const contents = [
      ...history,
      {
        role: 'user' as const,
        parts: [{ text: message }]
      }
    ]

    // Check if API key is configured
    if (!env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Call Gemini API - using Gemini 3 Flash Preview
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status}`, details: errorText }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const data = await response.json() as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>
        }
      }>
    }
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  } catch (error) {
    console.error('Chat API error:', error)
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
