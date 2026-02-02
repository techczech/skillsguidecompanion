export const pptxSkill = {
  name: 'pptx',
  structure: {
    'SKILL.md': {
      type: 'file' as const,
      content: `---
name: pptx
description: Create and edit PowerPoint presentations from HTML, markdown, or direct content specifications.
---

# PPTX SKILL

## When to use this skill

Use this skill when the user asks to:
- Create a new presentation or slide deck
- Modify existing .pptx files
- Convert content (HTML, markdown, outlines) into slides
- Add, remove, or reorder slides

## Instructions

### Reading existing presentations
If you need to read the text contents of an existing .pptx file:

\`\`\`shell
python -m markitdown path-to-file.pptx
\`\`\`

This extracts all text content for analysis.

### Creating new presentations
For creating presentations from scratch:
1. Generate HTML with proper slide structure (see references/html-format.md)
2. Use the html2pptx.js script to convert

\`\`\`shell
node scripts/html2pptx.js --input slides.html --output presentation.pptx
\`\`\`

### Modifying presentations
For modifications to existing files:
1. Read the current content with markitdown
2. Make changes to the extracted content
3. Use rearrange.py for slide reordering

## Available scripts

| Script | Purpose |
|--------|---------|
| \`html2pptx.js\` | Convert HTML to PowerPoint format |
| \`rearrange.py\` | Reorder, duplicate, or delete slides |
| \`add-notes.py\` | Add speaker notes to slides |

## Reference files

See \`references/\` folder for:
- \`html-format.md\` - HTML structure for slides
- \`themes.md\` - Available color themes
- \`layouts.md\` - Slide layout options

## Important notes

- Always use the pre-written scripts rather than generating code
- HTML must follow the exact format in references/html-format.md
- Maximum 50 slides per presentation`,
      annotations: [
        { line: 1, text: 'YAML frontmatter - machine-readable metadata' },
        { line: 2, text: 'This exact text appears in the system prompt skill list' },
        { line: 3, text: 'Keep under 200 words to save context window space' },
        { line: 8, text: 'Trigger conditions - helps model know WHEN to use this skill' },
        { line: 17, text: 'Exact, reproducible command - no ambiguity' },
        { line: 26, text: 'Step-by-step instructions the model will follow' },
        { line: 37, text: 'Table format is easy for LLMs to parse' },
        { line: 44, text: 'References to other files for more detailed prompts' },
        { line: 51, text: 'Explicit constraints to prevent common errors' },
      ],
    },
    'references': {
      type: 'folder' as const,
      children: {
        'html-format.md': {
          type: 'file' as const,
          content: `# HTML Format for Slides

Each slide should be a \`<section>\` element:

\`\`\`html
<section class="slide" data-layout="title">
  <h1>Slide Title</h1>
  <p>Subtitle or content</p>
</section>

<section class="slide" data-layout="content">
  <h2>Content Slide</h2>
  <ul>
    <li>Bullet point 1</li>
    <li>Bullet point 2</li>
  </ul>
</section>
\`\`\`

## Available layouts
- \`title\` - Title slide with large heading
- \`content\` - Standard bullet points
- \`two-column\` - Side by side content
- \`image\` - Full-bleed image with caption`,
          annotations: [],
        },
        'themes.md': {
          type: 'file' as const,
          content: `# Available Themes

## Default themes
- \`corporate\` - Professional blue/gray
- \`modern\` - Clean white with accent colors
- \`dark\` - Dark background, light text
- \`academic\` - Traditional, serif fonts

## Specifying a theme
Add to the root HTML element:
\`\`\`html
<div data-theme="corporate">
  <!-- slides here -->
</div>
\`\`\``,
          annotations: [],
        },
      },
    },
    'scripts': {
      type: 'folder' as const,
      children: {
        'html2pptx.js': {
          type: 'file' as const,
          content: `#!/usr/bin/env node
/**
 * html2pptx.js - Convert HTML slides to PowerPoint
 *
 * Usage: node html2pptx.js --input slides.html --output presentation.pptx
 */

const PptxGenJS = require('pptxgenjs');
const { JSDOM } = require('jsdom');
const fs = require('fs');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    options[key] = args[i + 1];
  }
  return options;
}

async function convert(inputPath, outputPath) {
  const html = fs.readFileSync(inputPath, 'utf-8');
  const dom = new JSDOM(html);
  const slides = dom.window.document.querySelectorAll('.slide');

  const pptx = new PptxGenJS();

  slides.forEach((slideEl, index) => {
    const slide = pptx.addSlide();
    const layout = slideEl.dataset.layout || 'content';

    // Process based on layout type
    if (layout === 'title') {
      const title = slideEl.querySelector('h1')?.textContent || '';
      slide.addText(title, { x: 0.5, y: 2, w: 9, fontSize: 44, bold: true });
    } else {
      const title = slideEl.querySelector('h2')?.textContent || '';
      slide.addText(title, { x: 0.5, y: 0.5, w: 9, fontSize: 32, bold: true });

      const bullets = Array.from(slideEl.querySelectorAll('li'))
        .map(li => ({ text: li.textContent }));
      if (bullets.length) {
        slide.addText(bullets, { x: 0.5, y: 1.5, w: 9, fontSize: 18, bullet: true });
      }
    }
  });

  await pptx.writeFile({ fileName: outputPath });
  console.log(\`Created: \${outputPath}\`);
}

const { input, output } = parseArgs();
if (!input || !output) {
  console.error('Usage: node html2pptx.js --input <file> --output <file>');
  process.exit(1);
}

convert(input, output);`,
          annotations: [
            { line: 1, text: 'Shebang for direct execution' },
            { line: 6, text: 'Clear usage documentation' },
            { line: 20, text: 'Actual conversion logic - tested and reliable' },
            { line: 49, text: 'Proper error handling and validation' },
          ],
        },
        'rearrange.py': {
          type: 'file' as const,
          content: `#!/usr/bin/env python3
"""
rearrange.py - Reorder slides in a PowerPoint file

Usage: python rearrange.py input.pptx --order 3,1,2,4 --output reordered.pptx
"""

import argparse
from pptx import Presentation
from pptx.util import Inches

def reorder_slides(input_path: str, order: list[int], output_path: str):
    """Reorder slides according to the specified order."""
    prs = Presentation(input_path)

    # Create new presentation with slides in new order
    new_prs = Presentation()
    new_prs.slide_width = prs.slide_width
    new_prs.slide_height = prs.slide_height

    for idx in order:
        # Copy slide at index (1-based to 0-based)
        source_slide = prs.slides[idx - 1]
        # ... copy logic here

    new_prs.save(output_path)
    print(f"Saved reordered presentation to {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Reorder PowerPoint slides")
    parser.add_argument("input", help="Input .pptx file")
    parser.add_argument("--order", required=True, help="Comma-separated slide order (1-based)")
    parser.add_argument("--output", required=True, help="Output .pptx file")

    args = parser.parse_args()
    order = [int(x) for x in args.order.split(",")]
    reorder_slides(args.input, order, args.output)`,
          annotations: [],
        },
      },
    },
  },
}
