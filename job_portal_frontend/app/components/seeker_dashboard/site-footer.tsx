export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/70">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div>
          <p
            className="text-xl text-neutral-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Jopsphere
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Nepal&apos;s first verified job portal.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500">
          <a href="/how-it-works" className="transition-colors hover:text-neutral-900">
            How it works
          </a>
          <a href="/faq" className="transition-colors hover:text-neutral-900">
            FAQ
          </a>
          <a href="/privacy" className="transition-colors hover:text-neutral-900">
            Privacy
          </a>
          <a href="/contact" className="transition-colors hover:text-neutral-900">
            Contact
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-6 pb-8 text-xs text-neutral-400">
        &copy; 2026 Jopsphere. Made in Nepal.
      </div>
    </footer>
  );
}