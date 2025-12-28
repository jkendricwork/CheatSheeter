export interface Section {
  id: number;
  title: string;
  description?: string;
  category?: string;
  display_order: number;
  grid_column_span: number;
  style_variant: 'default' | 'warning' | 'best-practices';
  border_color?: string;
  background_color?: string;
  created_at: string;
  updated_at: string;
  subsections?: Subsection[];
}

export interface Subsection {
  id: number;
  section_id: number;
  title: string;
  description?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  code_blocks?: CodeBlock[];
}

export interface CodeBlock {
  id: number;
  subsection_id: number;
  content: string;
  display_order: number;
  language: string;
  is_clickable: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSectionDTO {
  title: string;
  description?: string;
  category?: string;
  display_order?: number;
  grid_column_span?: number;
  style_variant?: 'default' | 'warning' | 'best-practices';
  border_color?: string;
  background_color?: string;
}

export interface UpdateSectionDTO {
  title?: string;
  description?: string;
  category?: string;
  display_order?: number;
  grid_column_span?: number;
  style_variant?: 'default' | 'warning' | 'best-practices';
  border_color?: string;
  background_color?: string;
}

export interface CreateSubsectionDTO {
  section_id: number;
  title: string;
  description?: string;
  display_order?: number;
}

export interface UpdateSubsectionDTO {
  title?: string;
  description?: string;
  display_order?: number;
}

export interface CreateCodeBlockDTO {
  content: string;
  language?: string;
  display_order?: number;
  is_clickable?: boolean;
}

export interface UpdateCodeBlockDTO {
  content?: string;
  language?: string;
  display_order?: number;
  is_clickable?: boolean;
}

export interface SearchResult {
  sections: Section[];
  codeBlocks: Array<CodeBlock & { section: Section }>;
}
