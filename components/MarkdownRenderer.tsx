import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-slate max-w-none text-slate-200 text-base leading-relaxed
      prose-headings:font-semibold prose-headings:text-cyan-50
      prose-p:text-slate-300 prose-p:my-3
      prose-pre:bg-[#0f172a] prose-pre:rounded-lg prose-pre:border prose-pre:border-cyan-900/50
      prose-code:text-cyan-300 prose-code:bg-cyan-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
      prose-table:border prose-table:border-slate-800 prose-table:rounded-lg overflow-hidden
      prose-th:bg-slate-800/50 prose-th:p-3 prose-th:text-cyan-100
      prose-td:p-3 prose-td:border-t prose-td:border-slate-800
      prose-strong:text-cyan-200
      prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};