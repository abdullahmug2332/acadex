"use client";

import * as React from "react";
import {
  Frame,
  PieChart,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { ImBooks } from "react-icons/im";
import { GraduationCap, User, Users } from "lucide-react";
import { Building2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import { FaUserTie } from "react-icons/fa";
import { Calendar } from "lucide-react";
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
          url: "/student/list-view",
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
      icon: FaUserTie,
      items: [
        {
          title: "List View",
          url: "/teacher/list-view",
        },
        {
          title: "Create Teacher",
          url: "/teacher/create-teacher",
        },
        {
          title: "Trash",
          url: "/teacher/trash",
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
          url: "/staff/list-view",
        },
        {
          title: "Create Staff",
          url: "/staff/create-staff",
        },
        {
          title: "Trash",
          url: "/staff/trash",
        },
      ],
    },
    {
      title: "Departments",
      url: "#",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "List View",
          url: "/departments/list-view",
        },
        {
          title: "Create Department",
          url: "/departments/create-department",
        },
        {
          title: "Trash",
          url: "/departments/trash",
        },
      ],
    },
    {
      title: "Subjects",
      url: "#",
      icon: ImBooks,
      isActive: true,
      items: [
        {
          title: "List View",
          url: "/subjects/list-view",
        },
        {
          title: "Create Subject",
          url: "/subjects/create-subject",
        },
        {
          title: "Trash",
          url: "/subjects/trash",
        },
      ],
    },
    {
      title: "Academic Years",
      url: "#",
      icon: Calendar,
      isActive: true,
      items: [
        {
          title: "List View",
          url: "/academic-years/list-view",
        },
        {
          title: "Create Academic Year",
          url: "/academic-years/create-academic-year",
        },
        {
          title: "Trash",
          url: "/academic-years/trash",
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
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, openMobile } = useSidebar();
const isSidebarOpen = open || openMobile;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <Link href={"/"}>
        {isSidebarOpen ? (
          <div className="flex justify-between items-center">
            <Image
              src="/logo3.png"
              alt="Logo"
              width={200}
              height={200}
              className="w-[70%] object-contain"
              loading="eager"
              unoptimized
            />
            <SidebarTrigger className="text-[10px] block md:hidden" />
          </div>
        ) : (
          <Image
            src="/logo2.png"
            loading="eager"
            alt="Logo"
            width={200}
            height={200}
            className="w-full object-contain"
            unoptimized
          />
        )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects}  */}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
