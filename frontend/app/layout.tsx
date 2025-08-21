import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { RecipesProvider } from "@/contexts/RecipesContext";
import { FiltersProvider } from "@/contexts/FiltersContext";
import { ShoppingListProvider } from "@/contexts/ShoppingListContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Manager",
  description: "A recipe management application built with Next.js",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <RecipesProvider>
          <FiltersProvider>
            <FavoritesProvider>
              <ShoppingListProvider>
                {children}
              </ShoppingListProvider>
            </FavoritesProvider>
          </FiltersProvider>
        </RecipesProvider>
      </body>
    </html>
  );
}
