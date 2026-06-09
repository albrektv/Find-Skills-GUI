import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-xl font-semibold text-text-primary mt-6 mb-3 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-text-primary mt-5 mb-2.5 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-text-primary mt-4 mb-2 first:mt-0">{children}</h3>
  ),
  p: ({ children }) => <p className="text-sm text-text-secondary leading-relaxed mb-3 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="list-disc ps-5 mb-3 space-y-1.5 text-sm text-text-secondary">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ps-5 mb-3 space-y-1.5 text-sm text-text-secondary">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-accent hover:underline underline-offset-2"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded-md bg-surface-muted border border-border-subtle text-[0.85em] font-mono text-text-primary">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-xl bg-surface-muted border border-border-subtle p-3 text-xs font-mono text-text-secondary">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-s-4 border-accent/40 ps-4 text-sm text-text-secondary italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-border-subtle" />
}

interface SkillMarkdownProps {
  content: string
}

export function SkillMarkdown({ content }: SkillMarkdownProps): React.ReactNode {
  return (
    <div className="ds-markdown rounded-2xl bg-surface-muted/70 border border-border-subtle shadow-card p-5">
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  )
}
