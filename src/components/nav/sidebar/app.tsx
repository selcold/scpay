"use client";

import * as React from "react";
import {
  BookOpen,
  BookUser,
  ChartColumn,
  ChevronsUpDown,
  FileWarning,
  Frame,
  GlobeLock,
  Plus,
  Settings2,
  Shield,
  SquareTerminal,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarNavUserItem } from "./nav-footer";
import { SidebarNavContent } from "./nav-content";
import { useScPayUser } from "@/hooks/useScPayUser";
import { Skeleton } from "@nextui-org/react";
import { getCookie, setCookie } from "cookies-next/client";

export type DashboardTeamsType = {
  name: string;
  plan: string;
  icon: LucideIcon;
  type: "user" | "admin" | string;
};

export type DashboardNavType = {
  main: any[];
  secondary: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
  admin: any[];
};

// This is sample data.
const nav: DashboardNavType = {
  main: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  secondary: [
    {
      title: "Contributors",
      url: "/dashboard/contributors",
      icon: BookUser,
    },
    {
      title: "Privacy Policy",
      url: "/dashboard/privacy_policy",
      icon: GlobeLock,
    },
  ],
  admin: [
    {
      name: "Control",
      url: "/dashboard/admin",
      icon: Frame,
    },
    {
      name: "Analytics",
      url: "/dashboard/admin/analytics",
      icon: ChartColumn,
    },
    {
      name: "Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      name: "Error Codes",
      url: "/dashboard/admin/errorcode",
      icon: FileWarning,
    },
  ],
};

export function AppSidebar() {
  const { user, loading } = useScPayUser();
  const [teams, setTeams] = React.useState<DashboardTeamsType[]>([]);
  const [activeTeam, setActiveTeam] = React.useState<DashboardTeamsType | null>(
    null
  );

  React.useEffect(() => {
    if (user) {
      const pre_teams: DashboardTeamsType[] = [
        {
          name: user?.username,
          plan: "Free",
          icon: User,
          type: "user",
        },
      ];
      if (user.admin) {
        pre_teams.push({
          name: "Admin",
          plan: "Custom",
          icon: Shield,
          type: "admin",
        });
      }
      setTeams(pre_teams);

      const selectTeamType = getCookie("sidebar-activeTeam");
      const selectedTeam = pre_teams.find(
        (team) => team.type === selectTeamType
      );
      if (selectedTeam) {
        setActiveTeam(selectedTeam);
      } else {
        setCookie("sidebar-activeTeam", pre_teams[0].type);
        setActiveTeam(pre_teams[0]);
      }
    }
  }, [user, loading]);

  function NavSelectTeams() {
    if (activeTeam) {
      return (
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <activeTeam.icon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam.name}
                  </span>
                  <span className="truncate text-xs">{activeTeam.plan}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side="bottom"
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    setActiveTeam(team);
                    setCookie("sidebar-activeTeam", team.type);
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <team.icon className="size-4 shrink-0" />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add team
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      );
    }
    return (
      <SidebarMenu>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Skeleton className="flex aspect-square size-8 items-center justify-center rounded-lg" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <Skeleton className="w-28 h-3 mb-1 rounded-md" />
            <Skeleton className="w-24 h-3 rounded-md" />
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarMenu>
    );
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <NavSelectTeams />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarNavContent activeTeam={activeTeam} nav={nav} user={user} />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarNavUserItem />
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
