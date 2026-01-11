"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Roll", icon: "&#x2B50;" },
  { href: "/collection", label: "Collection", icon: "&#x1F4DA;" },
  { href: "/community", label: "Community", icon: "&#x1F465;" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 py-2 backdrop-blur-md bg-black/40 border-t border-white/10">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-purple-400 bg-purple-500/10"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              <span
                className="text-xl"
                dangerouslySetInnerHTML={{ __html: item.icon }}
              />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
