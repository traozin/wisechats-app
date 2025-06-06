import { AppSidebar } from "@/components/site/app-sidebar"
import { SiteHeader } from "@/components/site/site-header"
import { ProductList } from "@/components/product/product-list"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function ProductsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <ProductList />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
