import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server directory
dotenv.config({ path: path.join(__dirname, '../server/.env') });

interface ParsedSubsection {
  title: string;
  codeBlocks: ParsedCodeBlock[];
}

interface ParsedCodeBlock {
  content: string;
  displayOrder: number;
}

async function parseHTML(): Promise<{ title: string; subsections: ParsedSubsection[] }> {
  const htmlPath = path.join(__dirname, '../index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const $ = cheerio.load(html);

  // Get the main title
  const mainTitle = $('h1').first().text().trim() || 'Git & GitHub Quick Reference';

  const subsections: ParsedSubsection[] = [];

  // Each .section div becomes a subsection
  $('.section').each((i, elem) => {
    const $section = $(elem);
    const subsectionTitle = $section.find('h2').text().trim();

    const codeBlocks: ParsedCodeBlock[] = [];

    // Check if this is a list-based subsection (best practices, safety tips)
    if ($section.find('ul').length > 0) {
      // Handle list items as individual code blocks
      $section.find('ul li').each((j, liElem) => {
        const text = $(liElem).text().trim();
        if (text) {
          codeBlocks.push({
            content: text,
            displayOrder: j,
          });
        }
      });
    } else {
      // Handle regular code blocks
      $section.find('.code-block').each((j, codeElem) => {
        const lines: string[] = [];
        $(codeElem).find('.code-line').each((k, line) => {
          const lineText = $(line).text().trim();
          if (lineText) {
            lines.push(lineText);
          }
        });

        if (lines.length > 0) {
          codeBlocks.push({
            content: lines.join('\n'),
            displayOrder: j,
          });
        }
      });
    }

    if (subsectionTitle && codeBlocks.length > 0) {
      subsections.push({
        title: subsectionTitle,
        codeBlocks,
      });
    }
  });

  return {
    title: mainTitle,
    subsections,
  };
}

async function seedDatabase(data: { title: string; subsections: ParsedSubsection[] }) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✓ Database connected\n');

    console.log('🗑️  Clearing existing data...');
    await pool.query('DELETE FROM code_blocks');
    await pool.query('DELETE FROM subsections');
    await pool.query('DELETE FROM sections');
    console.log('✓ Existing data cleared\n');

    console.log('📝 Creating section and subsections...\n');

    // Create the main section
    const sectionResult = await pool.query(
      `INSERT INTO sections (title, description, display_order, style_variant, border_color, background_color, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        data.title,
        'Quick reference for Git and GitHub commands',
        0,
        'default',
        '#3498db',
        '#f8f9fa',
        'git',
      ]
    );

    const sectionId = sectionResult.rows[0].id;
    console.log(`  ✓ Section created: "${data.title}"\n`);

    // Create subsections and their code blocks
    for (let i = 0; i < data.subsections.length; i++) {
      const subsection = data.subsections[i];

      const subsectionResult = await pool.query(
        `INSERT INTO subsections (section_id, title, display_order)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [sectionId, subsection.title, i]
      );

      const subsectionId = subsectionResult.rows[0].id;
      console.log(`  ✓ Subsection ${i + 1}/${data.subsections.length}: ${subsection.title} (${subsection.codeBlocks.length} blocks)`);

      // Insert code blocks for this subsection
      for (const codeBlock of subsection.codeBlocks) {
        await pool.query(
          `INSERT INTO code_blocks (subsection_id, content, display_order, language, is_clickable)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            subsectionId,
            codeBlock.content,
            codeBlock.displayOrder,
            'bash',
            true,
          ]
        );
      }
    }

    const totalBlocks = data.subsections.reduce((sum, s) => sum + s.codeBlocks.length, 0);
    console.log('\n✅ Migration completed successfully!');
    console.log(`   Created 1 section with ${data.subsections.length} subsections and ${totalBlocks} code blocks`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Execute migration
async function main() {
  try {
    console.log('🚀 Starting migration from index.html to PostgreSQL\n');

    const data = await parseHTML();
    console.log(`📄 Parsed section: "${data.title}" with ${data.subsections.length} subsections\n`);

    await seedDatabase(data);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
