import React, { useState } from 'react';
import type { Section } from '../../types';
import { CodeBlock } from '../codeBlocks/CodeBlock';
import { useUIStore } from '../../stores/uiStore';
import { Modal } from '../common/Modal';
import { SectionForm } from './SectionForm';
import { SubsectionForm } from './SubsectionForm';
import { CodeBlockForm } from '../codeBlocks/CodeBlockForm';
import { sectionsApi } from '../../api/sections';
import { subsectionsApi } from '../../api/subsections';
import { codeBlocksApi } from '../../api/codeBlocks';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  section: Section;
}

export const SectionCard: React.FC<Props> = ({ section }) => {
  const { isEditMode, collapsedSections, toggleSectionCollapse } = useUIStore();
  const queryClient = useQueryClient();

  const isCollapsed = collapsedSections.has(section.id);

  const [editSectionModal, setEditSectionModal] = useState(false);
  const [editSubsectionId, setEditSubsectionId] = useState<number | null>(null);
  const [addSubsectionModal, setAddSubsectionModal] = useState(false);
  const [editCodeBlockId, setEditCodeBlockId] = useState<number | null>(null);
  const [addCodeBlockSubsectionId, setAddCodeBlockSubsectionId] = useState<number | null>(null);

  const getBorderColor = () => {
    return section.border_color || '#3498db';
  };

  const getBackgroundColor = () => {
    return section.background_color || '#f8f9fa';
  };

  // Section handlers
  const handleEditSection = async (data: any) => {
    await sectionsApi.update(section.id, data);
    await queryClient.invalidateQueries({ queryKey: ['sections'] });
    setEditSectionModal(false);
  };

  const handleDeleteSection = async () => {
    if (confirm(`Delete section "${section.title}"? This will also delete all subsections and code blocks.`)) {
      await sectionsApi.delete(section.id);
      await queryClient.invalidateQueries({ queryKey: ['sections'] });
    }
  };

  // Subsection handlers
  const handleAddSubsection = async (data: any) => {
    await subsectionsApi.create(data);
    await queryClient.invalidateQueries({ queryKey: ['sections'] });
    setAddSubsectionModal(false);
  };

  const handleEditSubsection = async (data: any) => {
    if (editSubsectionId) {
      await subsectionsApi.update(editSubsectionId, data);
      await queryClient.invalidateQueries({ queryKey: ['sections'] });
      setEditSubsectionId(null);
    }
  };

  const handleDeleteSubsection = async (id: number, title: string) => {
    if (confirm(`Delete subsection "${title}"? This will also delete all code blocks in it.`)) {
      await subsectionsApi.delete(id);
      await queryClient.invalidateQueries({ queryKey: ['sections'] });
    }
  };

  // Code block handlers
  const handleAddCodeBlock = async (data: any) => {
    await codeBlocksApi.create(data);
    await queryClient.invalidateQueries({ queryKey: ['sections'] });
    setAddCodeBlockSubsectionId(null);
  };

  const handleEditCodeBlock = async (data: any) => {
    if (editCodeBlockId) {
      await codeBlocksApi.update(editCodeBlockId, data);
      await queryClient.invalidateQueries({ queryKey: ['sections'] });
      setEditCodeBlockId(null);
    }
  };

  const handleDeleteCodeBlock = async (id: number) => {
    if (confirm('Delete this code block?')) {
      await codeBlocksApi.delete(id);
      await queryClient.invalidateQueries({ queryKey: ['sections'] });
    }
  };

  return (
    <div
      id={`section-${section.id}`}
      className="rounded-lg shadow-md border-2 overflow-hidden"
      style={{
        borderColor: getBorderColor(),
        gridColumn: section.grid_column_span > 1 ? '1 / -1' : 'auto',
      }}
    >
      {/* Section Header */}
      <div
        className="px-4 py-3 border-b-2 cursor-pointer hover:opacity-80 transition-opacity"
        style={{
          backgroundColor: getBorderColor() + '15', // Add transparency
          borderBottomColor: getBorderColor(),
        }}
        onClick={() => toggleSectionCollapse(section.id)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: getBorderColor() }}>
              {isCollapsed ? '▶' : '▼'}
            </span>
            <h2
              className="text-base font-bold uppercase tracking-wide"
              style={{ color: getBorderColor() }}
            >
              {section.title}
            </h2>
          </div>
          {isEditMode && (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setEditSectionModal(true)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteSection}
                className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        {section.description && (
          <p className="text-xs text-gray-600 mt-1">{section.description}</p>
        )}
      </div>

      {/* Section Content - Subsections Grid */}
      {!isCollapsed && (
        <div
          className="p-4"
          style={{ backgroundColor: getBackgroundColor() }}
        >
          {section.subsections && section.subsections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.subsections.map((subsection) => (
              <div
                key={subsection.id}
                id={`subsection-${subsection.id}`}
                className="space-y-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"
              >
                {/* Subsection Title */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    {subsection.title}
                  </h3>
                  {isEditMode && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditSubsectionId(subsection.id)}
                        className="text-blue-500 hover:text-blue-700 text-xs px-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubsection(subsection.id, subsection.title)}
                        className="text-red-500 hover:text-red-700 text-xs px-1"
                      >
                        Del
                      </button>
                    </div>
                  )}
                </div>

                {/* Subsection Description */}
                {subsection.description && (
                  <p className="text-xs text-gray-500">{subsection.description}</p>
                )}

                {/* Code Blocks in this Subsection */}
                <div className="space-y-2">
                  {subsection.code_blocks && subsection.code_blocks.length > 0 ? (
                    subsection.code_blocks.map((block) => (
                      <CodeBlock
                        key={block.id}
                        codeBlock={block}
                        onEdit={() => setEditCodeBlockId(block.id)}
                        onDelete={() => handleDeleteCodeBlock(block.id)}
                      />
                    ))
                  ) : (
                    <div className="text-center text-gray-300 text-xs py-2">
                      No code blocks
                    </div>
                  )}
                </div>

                {/* Edit Subsection Form */}
                {editSubsectionId === subsection.id && (
                  <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                    <SubsectionForm
                      subsection={subsection}
                      onSubmit={handleEditSubsection}
                      onCancel={() => setEditSubsectionId(null)}
                    />
                  </div>
                )}

                {/* Add Code Block Form */}
                {addCodeBlockSubsectionId === subsection.id && (
                  <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                    <CodeBlockForm
                      subsectionId={subsection.id}
                      onSubmit={handleAddCodeBlock}
                      onCancel={() => setAddCodeBlockSubsectionId(null)}
                    />
                  </div>
                )}

                {/* Edit Code Block Form */}
                {editCodeBlockId && subsection.code_blocks?.find(b => b.id === editCodeBlockId) && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <CodeBlockForm
                      codeBlock={subsection.code_blocks.find(b => b.id === editCodeBlockId)}
                      onSubmit={handleEditCodeBlock}
                      onCancel={() => setEditCodeBlockId(null)}
                    />
                  </div>
                )}

                {isEditMode && (
                  <button
                    onClick={() => setAddCodeBlockSubsectionId(subsection.id)}
                    className="text-blue-500 hover:text-blue-700 text-xs font-medium mt-2"
                  >
                    + Add Code Block
                  </button>
                )}
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center text-gray-400 text-sm py-4">
              No subsections in this section
            </div>
          )}
        </div>
      )}

      {/* Add New Subsection Form */}
      {!isCollapsed && isEditMode && addSubsectionModal && (
        <div className="px-4 py-3 border-t border-gray-200 bg-green-50">
          <SubsectionForm
            sectionId={section.id}
            onSubmit={handleAddSubsection}
            onCancel={() => setAddSubsectionModal(false)}
          />
        </div>
      )}

      {/* Add New Subsection Button (Edit Mode) */}
      {!isCollapsed && isEditMode && !addSubsectionModal && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setAddSubsectionModal(true)}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            + Add Subsection
          </button>
        </div>
      )}

      {/* Edit Section Modal */}
      <Modal
        isOpen={editSectionModal}
        onClose={() => setEditSectionModal(false)}
        title="Edit Section"
      >
        <SectionForm
          section={section}
          onSubmit={handleEditSection}
          onCancel={() => setEditSectionModal(false)}
        />
      </Modal>
    </div>
  );
};
