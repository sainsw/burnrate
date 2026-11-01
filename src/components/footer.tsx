import { PrideAvatar } from "@/components/pride-avatar";
import { AVATAR_VERSION } from "@/lib/version";

const year = new Date().getFullYear();
const START_YEAR = 2025;

const getCopyrightString = async () => {
  const displayYear =
    year > START_YEAR ? `${START_YEAR}–${year}` : START_YEAR.toString();
  return `© Sam Ainsworth ${displayYear}`;
};

export async function Footer() {
  const copyrightString = await getCopyrightString();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1152px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-6 text-[13px] text-muted sm:px-6">
        <a
          className="flex items-center gap-3 text-ink hover:underline"
          href="https://ainsworth.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PrideAvatar>
            <picture>
              <source
                srcSet={`/images/home/avatar-${AVATAR_VERSION}.webp`}
                type="image/webp"
              />
              <img
                className="h-8 w-8 rounded-full"
                src={`/images/home/avatar-${AVATAR_VERSION}.jpg`}
                alt=""
                width={32}
                height={32}
                loading="lazy"
              />
            </picture>
          </PrideAvatar>
          Made in Manchester by Sam Ainsworth
        </a>
        <a
          href="https://github.com/sainsw/burnrate"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-ink hover:underline"
        >
          Source on GitHub
        </a>
        <span className="sm:ml-auto">{copyrightString}</span>
      </div>
    </footer>
  );
}
