import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AlreadyBuilt?',
  description: 'Discover if your idea already exists and how to differentiate it.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">
              AlreadyBuilt?
            </a>
            <a
              href="/history"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Search History
            </a>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
