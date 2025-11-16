import { PrideAvatar } from "@/components/pride-avatar";
import { AVATAR_VERSION } from "@/lib/version";

const year = new Date().getFullYear();
const START_YEAR = 2025;

const getCopyrightString = async () => {
  const displayYear =
    year > START_YEAR ? `${START_YEAR} - ${year}` : START_YEAR.toString();
  return `© Sam Ainsworth ${displayYear}. All Rights Reserved.`;
};

export async function Footer() {
  const copyrightString = await getCopyrightString();
  return (
    <footer className="relative">
      <div className="relative h-64">
        <div className="absolute bottom-0 left-0 container mx-auto px-4">
          <div className="flex flex-col pb-5">
            <div className="w-full">
              <a
                className="mb-10 block max-w-max md:mx-auto"
                aria-label="visit ainsworth.dev"
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
                      className="h-20 w-20 rounded-full bg-left-bottom"
                      src={`/images/home/avatar-${AVATAR_VERSION}.jpg`}
                      alt="Sam Ainsworth"
                      width={80}
                      height={80}
                      loading="lazy"
                    />
                  </picture>
                </PrideAvatar>
              </a>
            </div>
            <div className="text-lg text-white/70 sm:text-xl">
              {copyrightString}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
