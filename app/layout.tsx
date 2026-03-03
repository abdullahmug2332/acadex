"use client";

import "./globals.css";
import { Barlow, Inter } from "next/font/google";
import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";

import Header from "@/components/Header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";
import { usePathname } from "next/navigation";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authRoutes = ["/auth"];
  const pathname = usePathname();
  const isAuthRoute = authRoutes.includes(pathname);

  return (
    <html lang="en">
      <head>
        <title>Acadex | Track your academic progress</title>
        <link rel="icon" href="/logo2.png" />
        <meta name="description" content="A learning management system" />
      </head>
      <body className={`${barlow.className} ${inter.variable} antialiased`}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {isAuthRoute ? (
              // Render children directly for auth routes
              <>{children}</>
            ) : (
              <div className="flex h-screen bg2 md:pr-2">
                <SidebarProvider>
                  <AppSidebar />
                  <main className="flex-1 md:pt-2 h-screen ">
                    <TooltipProvider>
                      {/* Rounded Card Wrapper */}
                      <div className="flex flex-col h-full bg-white md:rounded-t-2xl shadow-xl overflow-hidden max-w-[100vw] py-15 md:py-0">
                        <Header />
                        {/* ONLY this scrolls */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scroll">
                          {children}
                        </div>
                      </div>
                      <Toaster position="bottom-right" richColors />
                    </TooltipProvider>
                  </main>
                </SidebarProvider>
              </div>
            )}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
