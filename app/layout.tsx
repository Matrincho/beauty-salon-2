import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beauty Salon",
  description: "Professional beauty salon services",
};

export default function RootLayout({
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
