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
  weight: ["100","200","300","400","500","600","700","800","900"],
  style: ["normal","italic"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
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
              // Render full layout for other routes
              <div className="flex max-w-[100vw]! ">
                <SidebarProvider>
                  <AppSidebar />

                  <main className="flex-1 bg-secondary">
                    <TooltipProvider>
                      <div className="flex flex-col min-h-screen max-w-[100vw]">
                        <Header />
                        <div className="md:rounded-t-[20px]  p-6 bg-white grow">
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