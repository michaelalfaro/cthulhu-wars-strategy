import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getGuideChapter,
  getAllGuideChapters,
  getAllGuideSections,
} from "@/lib/content";
import {
  FactionHeader,
  UnitStatBlock,
  SpellbookChecklist,
  MatchupTable,
  TranscriptReference,
  SetupChecklist,
  GameSetupChecklist,
  FactionSelector,
} from "@/components/guide";

const mdxComponents = {
  FactionHeader,
  UnitStatBlock,
  SpellbookChecklist,
  MatchupTable,
  TranscriptReference,
  SetupChecklist,
  GameSetupChecklist,
  FactionSelector,
};

interface GuidePageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const chapters = getAllGuideChapters();

  const chapterParams = chapters.map((chapter) => ({
    slug: [chapter.section, chapter.slug],
  }));

  // Also generate params for section index pages (e.g., /guide/faq -> index.mdx)
  const sections = getAllGuideSections();
  const sectionParams = sections
    .filter((section) => getGuideChapter(section, "index") !== null)
    .map((section) => ({ slug: [section] }));

  return [...chapterParams, ...sectionParams];
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;

  let chapter;
  if (slug.length === 1) {
    // Section index page (e.g., /guide/faq)
    chapter = getGuideChapter(slug[0], "index");
  } else if (slug.length === 2) {
    chapter = getGuideChapter(slug[0], slug[1]);
  }

  if (!chapter) return {};

  return {
    title: chapter.frontmatter.title,
    description: chapter.frontmatter.description,
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;

  let chapter;
  if (slug.length === 1) {
    // Section index page (e.g., /guide/faq -> 08-faq/index.mdx)
    chapter = getGuideChapter(slug[0], "index");
  } else if (slug.length === 2) {
    chapter = getGuideChapter(slug[0], slug[1]);
  }

  if (!chapter) {
    notFound();
  }

  return (
    <article>
      <header className="mb-8 border-b border-elder-700 pb-6">
        <h1 className="text-3xl font-bold lg:text-4xl">
          {chapter.frontmatter.title}
        </h1>
        {chapter.frontmatter.description && (
          <p className="mt-3 text-lg text-bone-muted">
            {chapter.frontmatter.description}
          </p>
        )}
        {chapter.frontmatter.faction && (
          <span
            className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-medium"
            style={{
              backgroundColor: chapter.frontmatter.color
                ? `${chapter.frontmatter.color}20`
                : undefined,
              color: chapter.frontmatter.color || undefined,
              borderColor: chapter.frontmatter.color || undefined,
              borderWidth: "1px",
            }}
          >
            {chapter.frontmatter.faction
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </span>
        )}
      </header>

      <div className="mdx-content">
        <MDXRemote source={chapter.content} components={mdxComponents} />
      </div>
    </article>
  );
}
