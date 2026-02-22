import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getGuideChapter,
  getAllGuideChapters,
} from "@/lib/content";
import {
  FactionHeader,
  UnitStatBlock,
  SpellbookChecklist,
  MatchupTable,
  TranscriptReference,
  SetupChecklist,
  GameSetupChecklist,
} from "@/components/guide";

const mdxComponents = {
  FactionHeader,
  UnitStatBlock,
  SpellbookChecklist,
  MatchupTable,
  TranscriptReference,
  SetupChecklist,
  GameSetupChecklist,
};

interface GuidePageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const chapters = getAllGuideChapters();

  return chapters.map((chapter) => ({
    slug: [chapter.section, chapter.slug],
  }));
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;

  if (slug.length !== 2) return {};

  const [section, chapterSlug] = slug;
  const chapter = getGuideChapter(section, chapterSlug);

  if (!chapter) return {};

  return {
    title: chapter.frontmatter.title,
    description: chapter.frontmatter.description,
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;

  // We expect exactly two segments: section and chapter slug
  if (slug.length !== 2) {
    notFound();
  }

  const [section, chapterSlug] = slug;
  const chapter = getGuideChapter(section, chapterSlug);

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
