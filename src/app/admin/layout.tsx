import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Uređivanje stranice",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="cms-root">{children}</div>;
}
