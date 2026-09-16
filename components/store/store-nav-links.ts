export type NavLink = {
  href: string;
  label: string;
};

export const NAV_GROUPS: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { href: "/", label: "Home" },
      { href: "/shop", label: "Shop" },
      { href: "/categories", label: "Categories" },
      { href: "/promotions", label: "Deals" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/hire-process", label: "Hire Process" },
      { href: "/fittings", label: "Fittings" },
      { href: "/custom-orders", label: "Custom Orders" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export const NAV_LINKS: NavLink[] = NAV_GROUPS.flatMap((group) => group.links);

/** Top bar links on desktop (lg+) */
export const DESKTOP_NAV: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/hire-process", label: "Hire Process" },
  { href: "/fittings", label: "Fittings" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/events", label: "Events" },
];

export const MORE_NAV_LINKS: NavLink[] = [
  { href: "/promotions", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function isNavLinkActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
