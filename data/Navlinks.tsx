import React from "react"
import { RiDashboardLine } from "react-icons/ri";
import { IoBookOutline } from "react-icons/io5";
import { LuListTodo } from "react-icons/lu";
import { GiProgression } from "react-icons/gi";
import { HiMiniSquare3Stack3D } from "react-icons/hi2";
import { LuCalendarCheck2 } from "react-icons/lu";
import { BsCardChecklist } from "react-icons/bs";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";

interface SidebarLink {
  name: string
  link?: string
  icon?: React.ReactNode
  subLinks?: SidebarLink[]
}

export const StudentSidebarLinks: SidebarLink[] = [
  {
    name: "Dashboard",
    link: "/",
    icon: <RiDashboardLine />,
  },
  {
    name: "Courses",
    link: "/courses",
    icon: <IoBookOutline />,
  },
  {
    name: "Todo",
    link: "/todo",
    icon: <LuListTodo />,
  },
  {
    name: "Lectures Schedual",
    link: "/progress",
    icon: <LuCalendarCheck2 />,
  },
  {
    name: "Grades",
    link: "/grades",
    icon: <HiMiniSquare3Stack3D />,
  },
  {
    name: "Progress",
    link: "/progress",
    icon: <GiProgression />,
  },
  {
    name: "Attendance",
    link: "/attendance",
    icon: <BsCardChecklist />,
  },
  {
    name: "Notes",
    link: "/notes",
    icon: <MdOutlineLibraryBooks />,
  },

]
export const TeacherSidebarLinks: SidebarLink[] = [
  {
    name: "Dashboard",
    link: "/",
    icon: <RiDashboardLine />,
  },
  {
    name: "Courses",
    link: "/courses",
    icon: <IoBookOutline />,
  },
  {
    name: "Assignments",
    link: "/todo",
    icon: <LuListTodo />,
  },
  {
    name: "Lectures Schedual",
    link: "/progress",
    icon: <LuCalendarCheck2 />,
  },
  {
    name: "Add Grades",
    link: "/add-grades",
    icon: <HiMiniSquare3Stack3D />,
  },
  {
    name: "Mark Attendance",
    link: "/mark-attendance",
    icon: <BsCardChecklist />,
  },
  {
    name: "Add Notes",
    link: "/add-notes",
    icon: <MdOutlineLibraryBooks />,
  },

]
export const StaffSidebarLinks: SidebarLink[] = [
  {
    name: "Dashboard",
    link: "/",
    icon: <RiDashboardLine />,
  },
  {
    name: "Add User",
    link: "/add-user",
    icon: <AiOutlineUserAdd />,
  },
  {
    name: "Make Schedual",
    link: "/make-schedual",
    icon: <LuCalendarCheck2 />,
  },
  {
    name: "Add Notice",
    link: "/add-notice",
    icon: <HiMiniSquare3Stack3D />,
  },
  {
    name: "Mark Attendance",
    link: "/mark-attendance",
    icon: <BsCardChecklist />,
  },
  {
    name: "Add Notes",
    link: "/add-notes",
    icon: <MdOutlineLibraryBooks />,
  },

]
export const AdminSidebarLinks: SidebarLink[] = [
  {
    name: "Dashboard",
    link: "/",
    icon: <RiDashboardLine />,
  },
  {
    name: "Users Managment",
    icon: <AiOutlineUserAdd />,
    subLinks: [
      {
        name: "All Users",
        link: "/users",
        
      },
      {
        name: "Add Users",
        link: "/add-users",
      }
    ]
  }
]