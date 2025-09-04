export const SITE_TITLE = "Peggie Zhong";
export const SITE_DESCRIPTION = "Developer Advocate Portfolio";
export const SITE_AUTHOR = "Peggie Zhong";

export const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/#projects" },
  { name: "Blog", href: "/#blog" },
  { name: "Videos", href: "#videos" },
];

export const PERSONAL_INFO = {
  name: SITE_AUTHOR,
  email: "peggiezx@gmail.com",
  portfolio: "https://peggiezx.github.io",
  github: "https://github.com/peggiezx",
  phone: "(917) 376-9366",
};

export const SEO_DEFAULTS = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  image: "/og-image.png", // replace with your default social share image
  imageAlt: "Peggie Zhong Portfolio",
  type: "website" as const,
};