"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { PiStudentLight } from "react-icons/pi";
import { GraduationCap, User, Users } from "lucide-react";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"

// This is sample data.
const data = {
  
  navMain: [
    {
      title: "Students",
      url: "#",
      icon: GraduationCap,
      items: [
        {
          title: "List View",
          url: "/student/view-list",
        },
        {
          title: "Create Student",
          url: "/student/create-student",
        },
      ],
    },
    {
      title: "Teachers",
      url: "#",
      icon: User,
      items: [
        {
          title: "List View",
          url: "/teacher/view-list",
        },
        {
          title: "Create Teacher",
          url: "/teacher/create-teacher",
        },
      ],
    },
    {
      title: "Staff",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "List View",
          url: "/staff/view-list",
        },
        {
          title: "Create Staff",
          url: "/staff/create-staff",
        },
        
      ],
    },
    
    
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="">
        {open ? (
          <div className="flex justify-between">
          <Image
            src="/logo3.png"
            alt="Logo"
            width={200}
            height={200}
            className="w-[70%] object-contain"
            unoptimized
          />
          <SidebarTrigger className="text-[10px] block md:hidden" />
          </div>
        ) : (
          // Collapsed → Icon only
           <Image
            src="/logo2.png"
            alt="Logo"
            width={200}
            height={200}
            className="w-full object-contain"
            unoptimized
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects}  */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
