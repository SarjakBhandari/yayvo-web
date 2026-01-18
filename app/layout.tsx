// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Yayvo",
  description: "Lifestyle discovery through emotional design",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
