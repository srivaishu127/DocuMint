'use client'

import "../styles/globals.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>DocuMint - Document Management</title>
        <meta name="description" content="Professional document management system" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
