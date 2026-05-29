import { Coffee, FileDown, Link2, Send } from "lucide-react";

const links = [
  { label: "support the project & request books", icon: Coffee, href: "https://ko-fi.com/whimsypirate", tint: "var(--highlight-pink)" },
  { label: "download instructions",               icon: FileDown, href: "#instructions", tint: "var(--highlight-blue)" },
  { label: "telegram channel",                    icon: Send, href: "https://t.me/whimsypirate", tint: "var(--highlight-blue)" },
  { label: "my other links",                      icon: Link2, href: "https://linktr.ee/whimsypirate", tint: "var(--highlight-purple)" },
];

export function Nav() {
  return (
    <nav className="px-6 pb-10">
      <ul className="flex flex-wrap items-center justify-center gap-2.5">
        {links.map(({ label, icon: Icon, href, tint }) => (
          <li key={label}>
            <a
              href={href}
              className="pill pill-tinted"
              style={{ ['--pill-tint' as string]: tint }}
            >
              <Icon className="h-3.5 w-3.5 opacity-80" strokeWidth={1.75} />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
