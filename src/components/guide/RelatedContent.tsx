import Link from "next/link";
import type { GuideChapter } from "@/lib/content";

interface RelatedContentProps {
  chapters: GuideChapter[];
}

export function RelatedContent({ chapters }: RelatedContentProps) {
  if (chapters.length === 0) return null;

  return (
    <div className="mt-12 border-t border-void-lighter pt-8">
      <h3 className="mb-4 font-heading text-lg font-semibold text-bone-muted">
        Related Content
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter) => (
          <Link
            key={`${chapter.section}/${chapter.slug}`}
            href={`/guide/${chapter.section}/${chapter.slug}`}
            className="group rounded-lg border border-void-lighter bg-void-light p-4 transition-all hover:border-gold/30"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-bone-muted/50">
              {chapter.section.replace(/-/g, " ")}
            </p>
            <p className="mt-1 font-heading text-sm font-semibold text-bone transition-colors group-hover:text-gold">
              {chapter.frontmatter.title}
            </p>
            {chapter.frontmatter.description && (
              <p className="mt-1 text-xs text-bone-muted line-clamp-2">
                {chapter.frontmatter.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
