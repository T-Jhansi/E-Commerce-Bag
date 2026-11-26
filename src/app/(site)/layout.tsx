import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteUIProvider } from "@/components/SiteUIProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteUIProvider>
      <SiteHeader />
      {children}
      <SiteFooter />
      <CartDrawer />
      <SearchModal />
    </SiteUIProvider>
  );
}
