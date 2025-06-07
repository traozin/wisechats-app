"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  Container,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import { NavMain } from "@/components/site/nav-main";
import { NavSecondary } from "@/components/site/nav-secondary";
import { NavUser } from "@/components/site/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserService } from "@/hooks/user-hook";
import { useEffect, useState } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const data = {
    user: {
      name: userName,
      email: userEmail,
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Pedidos",
        url: "/home",
        icon: Container,
      },
      {
        title: "Usuários",
        url: "/users",
        icon: UserIcon,
      },
      {
        title: "Produtos",
        url: "/products",
        icon: ListIcon,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/home",
        icon: SettingsIcon,
      },
      {
        title: "Search",
        url: "#",
        icon: SearchIcon,
      },
    ],
  };

  async function fetchUser() {
    try {
      const user = (await UserService.getMe()).user;
      setUserName(user.name ?? "");
      setUserEmail(user.email ?? "");
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">WiseChats.ai.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
