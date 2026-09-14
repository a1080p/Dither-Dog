import localFont from "next/font/local";

// Doto — variable dot-matrix display font used for the wordmark and hero headlines.
export const doto = localFont({
  src: "../Fonts/Doto-VariableFont_ROND,wght.ttf",
  variable: "--font-doto",
  weight: "100 900",
  display: "swap",
});

// Alliance No.2 — body copy font used everywhere else on the site.
export const alliance = localFont({
  src: "../Fonts/Alliance No.2 Regular.otf",
  variable: "--font-alliance",
  weight: "400",
  display: "swap",
});
