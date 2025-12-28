import React from 'react';
import { useSections } from '../../hooks/useSections';

interface Props {
  isOpen: boolean;
}

export const Sidebar: React.FC<Props> = ({ isOpen }) => {
  const { data: sections = [], isLoading } = useSections();

  // Group sections by category
  const sectionsByCategory = sections.reduce((acc, section) => {
    const category = section.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(section);
    return acc;
  }, {} as Record<string, typeof sections>);

  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 w-[200px] h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Sections
        </h2>

        {isLoading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(sectionsByCategory).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-700 uppercase mb-2">
                  {category}
                </h3>
                <ul className="space-y-1">
                  {items.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#section-${section.id}`}
                        className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-2 py-1 rounded"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
};
