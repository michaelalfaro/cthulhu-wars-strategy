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
}

export interface GuideChapter {
  slug: string;
  frontmatter: GuideFrontmatter;
  content: string;
  section: string;
}

export function getGuideChapter(
  section: string,
  slug: string
): GuideChapter | null {
  const filePath = path.join(GUIDE_DIR, section, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as GuideFrontmatter,
    content,
    section,
  };
}

export function getGuideSectionChapters(section: string): GuideChapter[] {
  const dirPath = path.join(GUIDE_DIR, section);
  if (!fs.existsSync(dirPath)) return [];

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
    .sort();
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
