/* eslint-disable @next/next/no-head-element */
export const metadata = {
  title: 'TalentPort — práca a nábor v EÚ',
  description: 'Kandidáti zadarmo, zamestnávatelia platia len za inzerát.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body>
        {children}
      </body>
    </html>
  );
}
