import React, { useState } from 'react';
import { useSections } from '../hooks/useSections';
import { SectionCard } from '../components/sections/SectionCard';
import { useUIStore } from '../stores/uiStore';
import { Modal } from '../components/common/Modal';
import { SectionForm } from '../components/sections/SectionForm';
import { sectionsApi } from '../api/sections';
import { useQueryClient } from '@tanstack/react-query';

export const HomePage: React.FC = () => {
  const { data: sections = [], isLoading, error } = useSections();
  const { isEditMode } = useUIStore();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddSection = async (data: any) => {
    await sectionsApi.create(data);
    await queryClient.invalidateQueries({ queryKey: ['sections'] });
    setShowAddModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-lg">Loading sections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <div className="text-lg font-semibold mb-2">Error loading sections</div>
          <div className="text-sm">Make sure the backend is running on port 3001.</div>
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-gray-400 text-lg mb-4">No sections yet</div>
        <div className="text-sm text-gray-500 mb-6">
          {isEditMode
            ? 'Click "+ New Section" to create your first section'
            : 'Enable Edit Mode to create sections'}
        </div>
        {isEditMode && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + New Section
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Cheat Sheets
            </h1>
            <p className="text-sm text-gray-500">
              Click any code block to copy to clipboard
            </p>
          </div>
          {isEditMode && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm"
            >
              + New Section
            </button>
          )}
        </div>
      </div>

      {/* Sections - Full Width Stack */}
      <div className="space-y-6">
        {sections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>

      {/* Section Count */}
      <div className="mt-8 text-center text-sm text-gray-400">
        {sections.length} {sections.length === 1 ? 'section' : 'sections'}
      </div>

      {/* Add Section Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Section"
      >
        <SectionForm
          onSubmit={handleAddSection}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
};
