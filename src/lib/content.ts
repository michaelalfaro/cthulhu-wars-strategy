import fs from "fs";
import path from "path";
import matter from "gray-matter";

const GUIDE_DIR = path.join(process.cwd(), "content", "guide");
const TRANSCRIPT_DIR = path.join(process.cwd(), "content", "transcripts");

export interface GuideFrontmatter {
  title: string;
  faction?: string;
  type?: string;
  color?: string;
  episode?: number;
  description?: string;
  related?: string[];
}

export interface GuideChapter {
  slug: string;
  frontmatter: GuideFrontmatter;
  content: string;
  section: string;
}

/** Strip leading "NN-" numeric prefix from a directory name. */
function stripPrefix(dirName: string): string {
  return dirName.replace(/^\d+-/, "");
}

/**
 * Find the actual directory name for a section slug.
 * Accepts either "overview" (stripped) or "01-overview" (raw).
 */
function findSectionDir(section: string): string | null {
  if (!fs.existsSync(GUIDE_DIR)) return null;

  const dirs = fs
    .readdirSync(GUIDE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  // Exact match (raw directory name passed in)
  if (dirs.includes(section)) return section;
  // Prefix-stripped match (clean slug passed in)
  return dirs.find((d) => stripPrefix(d) === section) ?? null;
}

export function getGuideChapter(
  section: string,
  slug: string
): GuideChapter | null {
  const sectionDir = findSectionDir(section);
  if (!sectionDir) return null;

  const filePath = path.join(GUIDE_DIR, sectionDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as GuideFrontmatter,
    content,
    // Always store the stripped section name so URLs stay clean
    section: stripPrefix(sectionDir),
  };
}

export function getGuideSectionChapters(section: string): GuideChapter[] {
  const sectionDir = findSectionDir(section);
  if (!sectionDir) return [];

  const dirPath = path.join(GUIDE_DIR, sectionDir);

  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => {
      const slug = f.replace(".mdx", "");
      return getGuideChapter(section, slug);
    })
    .filter(Boolean) as GuideChapter[];
}

export function getAllGuideSections(): string[] {
  if (!fs.existsSync(GUIDE_DIR)) return [];

  return fs
    .readdirSync(GUIDE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
    .map(stripPrefix); // Return clean slugs for URL generation
}

export function getAllGuideChapters(): GuideChapter[] {
  return getAllGuideSections().flatMap((section) =>
    getGuideSectionChapters(section)
  );
}

export function getTranscript(slug: string): string | null {
  const filePath = path.join(TRANSCRIPT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function getRelatedChapters(chapter: GuideChapter): GuideChapter[] {
  const explicit = chapter.frontmatter.related ?? [];

  if (explicit.length > 0) {
    return explicit
      .map((ref) => {
        const [section, slug] = ref.split("/");
        return getGuideChapter(section, slug);
      })
      .filter(Boolean) as GuideChapter[];
  }

  // Fallback: return up to 3 other chapters from the same section
  const sectionChapters = getGuideSectionChapters(chapter.section);
  return sectionChapters
    .filter((c) => c.slug !== chapter.slug)
    .slice(0, 3);
}
