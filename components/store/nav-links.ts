export type NavLink = { href: string; label: string };

export const NAV_SECTIONS: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Dresses" },
      { href: "/categories", label: "Collections" },
      { href: "/promotions", label: "Deals & Offers" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/hire-process", label: "Hire Process" },
      { href: "/fittings", label: "Book a Fitting" },
      { href: "/custom-orders", label: "Custom Orders" },
      { href: "/events", label: "Event Planning" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export const DESKTOP_NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/hire-process", label: "Hire Process" },
  { href: "/fittings", label: "Fittings" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/events", label: "Events" },
];

export const DESKTOP_MORE_LINKS: NavLink[] = [
  { href: "/promotions", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function isNavLinkActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
