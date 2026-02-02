import { cn } from '@/utils/cn'

interface CodeBlockProps {
  code: string
  language?: 'json' | 'markdown' | 'shell' | 'javascript' | 'python'
  className?: string
  highlight?: number[]
}

export function CodeBlock({ code, language = 'json', className, highlight = [] }: CodeBlockProps) {
  const lines = code.split('\n')

  return (
    <pre className={cn('code-block overflow-x-auto', className)}>
      <code>
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              'px-2 -mx-2',
              highlight.includes(i + 1) && 'bg-yellow-500/20 border-l-2 border-yellow-500'
            )}
          >
            <span className="text-gray-500 select-none mr-4 inline-block w-6 text-right">
              {i + 1}
            </span>
            <span>{highlightSyntax(line, language)}</span>
          </div>
        ))}
      </code>
    </pre>
  )
}

function highlightSyntax(line: string, language: string): React.ReactNode {
  if (language === 'json') {
    return line
      .replace(/"([^"]+)":/g, '<span class="syntax-key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="syntax-string">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="syntax-number">$1</span>')
      .split(/(<span[^>]*>[^<]*<\/span>)/)
      .map((part, i) =>
        part.startsWith('<span') ? (
          <span key={i} dangerouslySetInnerHTML={{ __html: part }} />
        ) : (
          part
        )
      )
  }

  if (language === 'shell') {
    if (line.startsWith('#')) {
      return <span className="syntax-comment">{line}</span>
    }
    const parts = line.split(' ')
    return (
      <>
        <span className="syntax-keyword">{parts[0]}</span>
        {parts.length > 1 && ' ' + parts.slice(1).join(' ')}
      </>
    )
  }

  return line
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-400">
      {children}
    </code>
  )
}
