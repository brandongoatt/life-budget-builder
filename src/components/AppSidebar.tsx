import { LayoutDashboard, TrendingUp, History, Settings, Crown } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  isPremium: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { 
    title: "Dashboard", 
    value: "dashboard", 
    icon: LayoutDashboard,
    premium: false
  },
  { 
    title: "Financial Trends", 
    value: "trends", 
    icon: TrendingUp,
    premium: false
  },
  { 
    title: "Decision History", 
    value: "history", 
    icon: History,
    premium: true
  },
  { 
    title: "Settings", 
    value: "settings", 
    icon: Settings,
    premium: false
  },
];

export function AppSidebar({ isPremium, activeTab, onTabChange }: AppSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Financial Tools
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.value)}
                    isActive={activeTab === item.value}
                    disabled={item.premium && !isPremium}
                    className="relative"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex items-center gap-2">
                      {item.title}
                      {item.premium && !isPremium && (
                        <Crown className="h-3 w-3 text-warning" />
                      )}
                    </span>
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
