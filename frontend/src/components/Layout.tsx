import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import { ThemeProvider } from "./theme-provider";
import MouseMoveEffect from "./mouse-move-effect";

export default function Layout() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <MouseMoveEffect />
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
} 