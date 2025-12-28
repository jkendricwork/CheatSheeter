import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CodeBlock as CodeBlockType } from '../../types';
import { useUIStore } from '../../stores/uiStore';

interface Props {
  codeBlock: CodeBlockType;
  isClickable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CodeBlock: React.FC<Props> = ({ codeBlock, isClickable = true, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const { isEditMode } = useUIStore();

  const handleCopy = async () => {
    if (!isClickable) return;

    try {
      await navigator.clipboard.writeText(codeBlock.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="relative">
      <div
        onClick={!isEditMode ? handleCopy : undefined}
        className={`
          relative rounded-md overflow-hidden my-2
          ${!isEditMode && isClickable ? 'cursor-pointer hover:ring-1 hover:ring-gray-300' : ''}
          ${copied ? 'ring-2 ring-green-500' : ''}
          transition-all duration-200
        `}
        style={{
          backgroundColor: copied ? '#27ae6020' : undefined,
        }}
      >
        <SyntaxHighlighter
          language={codeBlock.language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '8px',
            fontSize: '10px',
            lineHeight: '1.3',
          }}
        >
          {codeBlock.content}
        </SyntaxHighlighter>
        {copied && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Copied!
          </div>
        )}
      </div>
      {isEditMode && (onEdit || onDelete) && (
        <div className="flex gap-1 mt-1">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-blue-500 hover:text-blue-700 text-xs px-1"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 text-xs px-1"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
