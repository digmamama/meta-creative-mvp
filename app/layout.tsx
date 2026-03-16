import "./globals.css";

export const metadata = {
  title: "Meta Creative MVP",
  description: "Meta Creative Generator",
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