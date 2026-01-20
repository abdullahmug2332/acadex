"use client"

import "./globals.css";
import { Barlow, Inter } from 'next/font/google'
import { Provider } from "react-redux";
import { store } from "../store/store";


const barlow = Barlow({
  subsets: ['latin'],
  weight: [
    '100','200','300','400','500','600','700','800','900'
  ],
  style: ['normal', 'italic'],
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-inter',
})




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <title>Acadex | Track your academic progress</title>
      <meta name="description" content="A learning managment system" />
      </head>
      <body
        className={` ${barlow.className} ${inter.variable} antialiased`}
      >
        <Provider store={store}>{children}</Provider>;
      </body>
    </html>
  );
}
