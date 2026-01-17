import { BarChart3, FileText, FolderTree, Lightbulb, Settings, Users, TrendingUp, Package } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { titleKey: "dashboard" as const, url: "/admin", icon: BarChart3 },
  { titleKey: "analytics" as const, url: "/admin/analytics", icon: TrendingUp },
  { titleKey: "replies" as const, url: "/admin/replies", icon: FileText },
  { titleKey: "categories" as const, url: "/admin/categories", icon: FolderTree },
  { titleKey: "suggestions" as const, url: "/admin/suggestions", icon: Lightbulb },
  { titleKey: "users" as const, url: "/admin/users", icon: Users },
  { titleKey: "products" as const, url: "/admin/products", icon: Package },
  { titleKey: "settings" as const, url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const { t } = useLanguage();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('adminPanel')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
