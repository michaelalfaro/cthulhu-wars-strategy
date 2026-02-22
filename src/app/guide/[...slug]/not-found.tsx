import Link from "next/link";

export default function GuideNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-elder-500">404</h1>
      <h2 className="mt-4 text-2xl font-heading text-bone">
        Lost in the Void
      </h2>
      <p className="mt-3 max-w-md text-bone-muted">
        The forbidden knowledge you seek does not exist in this dimension.
        Perhaps it was consumed by the Great Old Ones, or it never was.
      </p>
      <Link
        href="/guide"
        className="mt-8 inline-block rounded-lg bg-elder-700 px-6 py-3 text-sm font-medium text-bone transition-colors hover:bg-elder-600"
      >
        Return to the Guide
      </Link>
    </div>
  );
}
