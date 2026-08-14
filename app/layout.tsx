import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Aaryavart Integrated Services | Connecting Talent with Opportunities',
  description: 'Aaryavart Integrated Services is a premier executive recruitment agency connecting top talent with corporate opportunities across IT, BFSI, Healthcare, Manufacturing, Engineering, and more.',
  keywords: ['Recruitment Agency', 'Executive Search', 'Jobs in India', 'IT Hiring', 'Aaryavart Integrated Services', 'Career Opportunities'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col selection:bg-brand-500 selection:text-white">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ThemeSwitcher />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
