import React, { useState } from 'react';
import { Subsection, CreateSubsectionDTO, UpdateSubsectionDTO } from '../../types';

interface SubsectionFormProps {
  sectionId?: number;
  subsection?: Subsection;
  onSubmit: (data: CreateSubsectionDTO | UpdateSubsectionDTO) => Promise<void>;
  onCancel: () => void;
}

export const SubsectionForm: React.FC<SubsectionFormProps> = ({ sectionId, subsection, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: subsection?.title || '',
    description: subsection?.description || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (subsection) {
        await onSubmit(formData);
      } else {
        await onSubmit({ ...formData, section_id: sectionId! });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter subsection title"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Enter description (optional)"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Saving...' : (subsection ? 'Update' : 'Create')}
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
