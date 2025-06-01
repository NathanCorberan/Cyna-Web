import { useState } from "react"
import { Button } from "../../components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import AdminSidebarContent from "./admin-sidebar-content"

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`bg-[#302082] text-white h-screen sticky top-0 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <div className="p-2 absolute right-0 top-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <AdminSidebarContent isCollapsed={isCollapsed} />
    </aside>
  )
}
