import type { Metadata } from "next";
import RootLayout from "./layout";

export const metadata: Metadata = {
  title: {
    default: "GC Universe",
    template: "%s | GC Universe",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default RootLayout; 