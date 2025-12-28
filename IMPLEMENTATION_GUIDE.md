# CheatSheeter Implementation Guide

This guide provides step-by-step instructions for completing the React frontend implementation.

## Current Status

### ✅ Backend Complete
- Express + TypeScript server configured
- PostgreSQL database schema created
- All API endpoints implemented (sections, code blocks, search)
- Migration script ready to import data from index.html

### ✅ Frontend Foundation Complete
- Vite + React + TypeScript configured
- TailwindCSS set up
- Project structure created
- Type definitions added

### 🚧 Remaining Frontend Work

## Step 1: Create API Client Functions

Create `client/src/api/client.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Create `client/src/api/sections.ts`:

```typescript
import { apiClient } from './client';
import { Section, CreateSectionDTO, UpdateSectionDTO } from '../types';

export const sectionsApi = {
  getAll: async (): Promise<Section[]> => {
    const { data } = await apiClient.get('/api/sections');
    return data;
  },

  getById: async (id: number): Promise<Section> => {
    const { data } = await apiClient.get(`/api/sections/${id}`);
    return data;
  },

  create: async (section: CreateSectionDTO): Promise<Section> => {
    const { data } = await apiClient.post('/api/sections', section);
    return data;
  },

  update: async (id: number, section: UpdateSectionDTO): Promise<Section> => {
    const { data } = await apiClient.put(`/api/sections/${id}`, section);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/sections/${id}`);
  },

  reorder: async (updates: Array<{ id: number; display_order: number }>): Promise<void> => {
    await apiClient.patch('/api/sections/reorder', { updates });
  },
};
```

Create similar files for:
- `client/src/api/codeBlocks.ts`
- `client/src/api/search.ts`

## Step 2: Set Up State Management

Create `client/src/stores/uiStore.ts`:

```typescript
import { create } from 'zustand';

interface UIState {
  isEditMode: boolean;
  isSidebarOpen: boolean;
  activeSection: number | null;
  toggleEditMode: () => void;
  toggleSidebar: () => void;
  setActiveSection: (id: number | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isEditMode: false,
  isSidebarOpen: true,
  activeSection: null,
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setActiveSection: (id) => set({ activeSection: id }),
}));
```

## Step 3: Create React Query Hooks

Create `client/src/hooks/useSections.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sectionsApi } from '../api/sections';
import type { CreateSectionDTO, UpdateSectionDTO } from '../types';

export const useSections = () => {
  return useQuery({
    queryKey: ['sections'],
    queryFn: sectionsApi.getAll,
  });
};

export const useSection = (id: number) => {
  return useQuery({
    queryKey: ['sections', id],
    queryFn: () => sectionsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSectionDTO) => sectionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSectionDTO }) =>
      sectionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sectionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
};
```

## Step 4: Create Core Components

### CodeBlock Component
Create `client/src/components/codeBlocks/CodeBlock.tsx`:

```typescript
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CodeBlock as CodeBlockType } from '../../types';

interface Props {
  codeBlock: CodeBlockType;
  isClickable?: boolean;
}

export const CodeBlock: React.FC<Props> = ({ codeBlock, isClickable = true }) => {
  const [copied, setCopied] = useState(false);

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
    <div
      onClick={handleCopy}
      className={`
        relative rounded-md overflow-hidden my-2
        ${isClickable ? 'cursor-pointer' : ''}
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
  );
};
```

### SectionCard Component
Create `client/src/components/sections/SectionCard.tsx`:

```typescript
import React from 'react';
import type { Section } from '../../types';
import { CodeBlock } from '../codeBlocks/CodeBlock';
import { useUIStore } from '../../stores/uiStore';

interface Props {
  section: Section;
}

export const SectionCard: React.FC<Props> = ({ section }) => {
  const { isEditMode } = useUIStore();

  const getBorderColor = () => {
    return section.border_color || '#3498db';
  };

  const getBackgroundColor = () => {
    return section.background_color || '#f8f9fa';
  };

  return (
    <div
      className="rounded-lg p-4 shadow-sm"
      style={{
        backgroundColor: getBackgroundColor(),
        borderLeft: `4px solid ${getBorderColor()}`,
        gridColumn: section.grid_column_span > 1 ? '1 / -1' : 'auto',
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-sm font-semibold text-gray-800">
          {section.title}
        </h2>
        {isEditMode && (
          <div className="flex gap-2">
            <button className="text-blue-600 hover:text-blue-800 text-xs">
              Edit
            </button>
            <button className="text-red-600 hover:text-red-800 text-xs">
              Delete
            </button>
          </div>
        )}
      </div>

      {section.description && (
        <p className="text-xs text-gray-600 mb-2">{section.description}</p>
      )}

      <div className="space-y-2">
        {section.code_blocks?.map((block) => (
          <CodeBlock key={block.id} codeBlock={block} />
        ))}
      </div>
    </div>
  );
};
```

### AppLayout Component
Create `client/src/components/layout/AppLayout.tsx`:

```typescript
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../../stores/uiStore';

export const AppLayout: React.FC = () => {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <main
          className="flex-1 p-6 transition-all duration-200"
          style={{
            marginLeft: isSidebarOpen ? '200px' : '0',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

### Header Component
Create `client/src/components/layout/Header.tsx`:

```typescript
import React from 'react';
import { useUIStore } from '../../stores/uiStore';

export const Header: React.FC = () => {
  const { isEditMode, toggleEditMode, toggleSidebar } = useUIStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900"
          >
            ☰
          </button>
          <h1 className="text-xl font-bold text-gray-800">CheatSheeter</h1>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search... (Cmd+K)"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={toggleEditMode}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isEditMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isEditMode ? 'View Mode' : 'Edit Mode'}
          </button>
        </div>
      </div>
    </header>
  );
};
```

### Sidebar Component
Create `client/src/components/layout/Sidebar.tsx`:

```typescript
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
```

## Step 5: Create Pages

### HomePage
Create `client/src/pages/HomePage.tsx`:

```typescript
import React from 'react';
import { useSections } from '../hooks/useSections';
import { SectionCard } from '../components/sections/SectionCard';

export const HomePage: React.FC = () => {
  const { data: sections = [], isLoading, error } = useSections();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading sections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading sections</div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};
```

## Step 6: Create Main App Files

### App.tsx
Create `client/src/App.tsx`:

```typescript
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
```

### main.tsx
Create `client/src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Step 7: Add Environment Variable

Create `client/.env`:

```
VITE_API_URL=http://localhost:3001
```

## Testing the Application

1. **Start PostgreSQL** (make sure it's running)

2. **Create and seed database**:
   ```bash
   createdb cheatsheeter
   psql -d cheatsheeter -f server/src/db/schema.sql
   npm run migrate
   ```

3. **Install all dependencies**:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ../scripts && npm install
   cd ..
   ```

4. **Start development servers**:
   ```bash
   npm run dev
   ```

5. **Open browser**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001/health

## Next Features to Add

1. **Search functionality** - Implement SearchBar and SearchResults
2. **Edit mode** - Add forms and dialogs for editing
3. **Drag-and-drop** - Use @dnd-kit for reordering
4. **Keyboard shortcuts** - Cmd+K for search, E for edit mode
5. **Mobile responsive** - Optimize for smaller screens
6. **Error handling** - Better error messages and fallbacks
7. **Loading states** - Skeletons and spinners

## Common Issues

- **Database connection failed**: Check PostgreSQL is running and DATABASE_URL is correct
- **CORS errors**: Verify CORS_ORIGIN in server/.env matches client URL
- **Module not found**: Run `npm install` in all directories
- **Port already in use**: Change PORT in server/.env or kill the process

## Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev/guide/)
