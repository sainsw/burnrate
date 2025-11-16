export function BuiltWithLove() {
  return (
    <p className="px-6 pb-12 text-center text-sm text-slate-600 opacity-80 sm:px-10 dark:text-slate-200">
      <a
        href="https://github.com/sainsw/burnrate"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-900 underline-offset-4 hover:underline dark:text-slate-50"
      >
        Built
      </a>{" "}
      with{" "}
      <span role="img" aria-label="love">
        ❤️
      </span>{" "}
      in Manchester, UK{" "}
      <span role="img" aria-label="bee">
        🐝
      </span>
      <span role="img" aria-label="United Kingdom flag" className="ml-1">
        🇬🇧
      </span>
    </p>
  );
}
