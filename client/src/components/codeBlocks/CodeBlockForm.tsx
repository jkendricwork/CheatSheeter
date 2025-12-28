import React, { useState } from 'react';
import { CodeBlock, CreateCodeBlockDTO, UpdateCodeBlockDTO } from '../../types';

interface CodeBlockFormProps {
  subsectionId?: number;
  codeBlock?: CodeBlock;
  onSubmit: (data: (CreateCodeBlockDTO & { subsection_id: number }) | UpdateCodeBlockDTO) => Promise<void>;
  onCancel: () => void;
}

export const CodeBlockForm: React.FC<CodeBlockFormProps> = ({ subsectionId, codeBlock, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    content: codeBlock?.content || '',
    language: codeBlock?.language || 'bash',
    is_clickable: codeBlock?.is_clickable !== undefined ? codeBlock.is_clickable : true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (codeBlock) {
        await onSubmit(formData);
      } else {
        await onSubmit({ ...formData, subsection_id: subsectionId! });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Code Content *
        </label>
        <textarea
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-2 py-1.5 text-sm font-mono border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter code content"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="bash">Bash</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="sql">SQL</option>
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="markdown">Markdown</option>
            <option value="text">Plain Text</option>
          </select>
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_clickable}
              onChange={(e) => setFormData({ ...formData, is_clickable: e.target.checked })}
              className="mr-2"
            />
            <span className="text-xs text-gray-700">Click to copy</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Saving...' : (codeBlock ? 'Update' : 'Create')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
