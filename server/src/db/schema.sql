-- CheatSheeter Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS code_blocks CASCADE;
DROP TABLE IF EXISTS subsections CASCADE;
DROP TABLE IF EXISTS sections CASCADE;

-- Sections table (top-level: e.g., "Git & GitHub Quick Reference")
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100),
  display_order INTEGER NOT NULL DEFAULT 0,
  grid_column_span INTEGER DEFAULT 1,
  style_variant VARCHAR(50) DEFAULT 'default',
  border_color VARCHAR(20),
  background_color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subsections table (e.g., "Initial Setup", "Create Repo", etc.)
CREATE TABLE subsections (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_section
    FOREIGN KEY(section_id)
    REFERENCES sections(id)
    ON DELETE CASCADE
);

-- Code blocks table (belongs to subsections)
CREATE TABLE code_blocks (
  id SERIAL PRIMARY KEY,
  subsection_id INTEGER NOT NULL REFERENCES subsections(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  language VARCHAR(50) DEFAULT 'bash',
  is_clickable BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_subsection
    FOREIGN KEY(subsection_id)
    REFERENCES subsections(id)
    ON DELETE CASCADE
);

-- Indexes for full-text search
CREATE INDEX idx_sections_title ON sections USING GIN(to_tsvector('english', title));
CREATE INDEX idx_sections_description ON sections USING GIN(to_tsvector('english', COALESCE(description, '')));
CREATE INDEX idx_subsections_title ON subsections USING GIN(to_tsvector('english', title));
CREATE INDEX idx_code_blocks_content ON code_blocks USING GIN(to_tsvector('english', content));

-- Indexes for efficient sorting
CREATE INDEX idx_sections_order ON sections(display_order);
CREATE INDEX idx_subsections_order ON subsections(section_id, display_order);
CREATE INDEX idx_code_blocks_order ON code_blocks(subsection_id, display_order);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subsections_updated_at BEFORE UPDATE ON subsections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_blocks_updated_at BEFORE UPDATE ON code_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
