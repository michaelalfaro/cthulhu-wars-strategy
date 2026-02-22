/**
 * Build-time search index generator.
 * Scans all guide MDX files and returns a flat array of searchable entries.
 * Called from the search API route or generateStaticParams.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  section: string;
  content: string; // first 300 chars of body, for snippet display
  tags: string[];
}

const GUIDE_DIR = path.join(process.cwd(), "content", "guide");

const SECTION_MAP: Record<string, { label: string; urlPrefix: string }> = {
  "01-overview": { label: "Overview", urlPrefix: "overview" },
  "02-factions": { label: "Factions", urlPrefix: "factions" },
  "03-monsters": { label: "Monsters & Terrors", urlPrefix: "monsters" },
  "04-neutrals": { label: "Neutral Units", urlPrefix: "neutrals" },
  "05-maps": { label: "Maps", urlPrefix: "maps" },
  "06-goo-packs": { label: "GOO Packs", urlPrefix: "goo-packs" },
  "07-advanced": { label: "Advanced", urlPrefix: "advanced" },
};

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  if (!fs.existsSync(GUIDE_DIR)) return entries;

  const sections = fs.readdirSync(GUIDE_DIR).filter((d) => {
    return fs.statSync(path.join(GUIDE_DIR, d)).isDirectory();
  });

  for (const sectionDir of sections) {
    const sectionMeta = SECTION_MAP[sectionDir];
    if (!sectionMeta) continue;

    const dirPath = path.join(GUIDE_DIR, sectionDir);
    const files = fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));

    for (const file of files) {
      const slug = file.replace(".mdx", "");
      const filePath = path.join(dirPath, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      const title = data.title || slug;
      const description = data.description || "";

      // Strip markdown syntax for plain-text snippet
      const plainContent = content
        .replace(/^#+\s+/gm, "") // headings
        .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
        .replace(/\*([^*]+)\*/g, "$1") // italic
        .replace(/`[^`]+`/g, "") // inline code
        .replace(/^[-*]\s+/gm, "") // bullets
        .replace(/\n+/g, " ")
        .trim()
        .slice(0, 400);

      const href = `/guide/${sectionMeta.urlPrefix}/${slug}`;

      // Build tags from frontmatter
      const tags: string[] = [sectionMeta.label];
      if (data.faction) tags.push(data.faction);
      if (data.type) tags.push(data.type);

      entries.push({
        title,
        description,
        href,
        section: sectionMeta.label,
        content: plainContent,
        tags,
      });
    }
  }

  return entries;
}
