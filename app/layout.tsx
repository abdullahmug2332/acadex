"use client"

import "./globals.css";
import { Barlow, Inter } from 'next/font/google'
import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import OuterLayer from "@/components/OuterLayer";
import { PersistGate } from "redux-persist/integration/react";
const barlow = Barlow({
  subsets: ['latin'],
  weight: [
    '100', '200', '300', '400', '500', '600', '700', '800', '900'
  ],
  style: ['normal', 'italic'],
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
})




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authRoutes = ["/auth"];
  const pathname = usePathname();
  const isAuthRoute = authRoutes.includes(pathname);
  return (
    <html lang="en">
      <head>
        <title>Acadex | Track your academic progress</title>
        <meta name="description" content="A learning managment system" />
      </head>
      <body
        className={` ${barlow.className} ${inter.variable} antialiased`}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {/* Show Header & Sidebar only if NOT auth route */}
            {!isAuthRoute && (
              <>

                <Sidebar />
                <OuterLayer >
                  <Header />
                  <div className="p-1 border">
                    {children}
                  </div>
                </OuterLayer>
              </>
            )}
            {isAuthRoute && (
              <>
                {children}
              </>
            )}

          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
