import type { ReactNode } from 'react';

export default function RedirectRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0B1020] text-[#F4EFE3]">{children}</body>
    </html>
  );
}
