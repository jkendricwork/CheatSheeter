import React from 'react';
import { useSections } from '../../hooks/useSections';
import { useUIStore } from '../../stores/uiStore';

interface Props {
  isOpen: boolean;
}

export const Sidebar: React.FC<Props> = ({ isOpen }) => {
  const { data: sections = [], isLoading } = useSections();
  const { expandSection } = useUIStore();

  // Group sections by category
  const sectionsByCategory = sections.reduce((acc, section) => {
    const category = section.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(section);
    return acc;
  }, {} as Record<string, typeof sections>);

  const handleSectionClick = (sectionId: number) => {
    expandSection(sectionId);
  };

  const handleSubsectionClick = (sectionId: number, subsectionId: number) => {
    expandSection(sectionId);
    // Scroll to subsection after a brief delay to allow section to expand
    setTimeout(() => {
      const element = document.getElementById(`subsection-${subsectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

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
                <ul className="space-y-2">
                  {items.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#section-${section.id}`}
                        onClick={() => handleSectionClick(section.id)}
                        className="block text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-2 py-1 rounded"
                      >
                        {section.title}
                      </a>
                      {/* Subsections */}
                      {section.subsections && section.subsections.length > 0 && (
                        <ul className="ml-3 mt-1 space-y-0.5 border-l-2 border-gray-200 pl-2">
                          {section.subsections.map((subsection) => (
                            <li key={subsection.id}>
                              <a
                                href={`#subsection-${subsection.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleSubsectionClick(section.id, subsection.id);
                                }}
                                className="block text-xs text-gray-500 hover:text-blue-600 hover:bg-gray-50 px-2 py-0.5 rounded"
                              >
                                {subsection.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
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
