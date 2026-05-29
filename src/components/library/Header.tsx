import emblem from "../../assets/chest-emblem.png";

export function Header() {
  return (
    <header className="relative px-6 pt-8 pb-6 sm:pt-10 sm:pb-8 text-center">
      <div className="relative mx-auto max-w-2xl">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[140px] w-[140px] sm:h-[170px] sm:w-[170px] -translate-x-1/2 -translate-y-1/2 opacity-30 select-none"
          style={{
            backgroundImage: `url(${emblem})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, #000 30%, rgba(0,0,0,0.45) 60%, transparent 82%)",
            maskImage:
              "radial-gradient(circle at 50% 50%, #000 30%, rgba(0,0,0,0.45) 60%, transparent 82%)",
            filter: "saturate(0.85)",
          }}
        />
        <div className="relative pt-2 pb-2">
          <h1 className="font-serif-display text-[2.4rem] sm:text-[3rem] leading-[1.05] text-foreground">
            whimsypirate library
          </h1>
          <p className="mt-3 text-base sm:text-lg text-foreground-soft italic">
            a small, curated collection of ebooks and audiobooks.
          </p>
        </div>
      </div>
    </header>
  );
}
