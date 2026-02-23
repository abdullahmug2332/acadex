'use client'

import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AdminSidebarLinks, StaffSidebarLinks, StudentSidebarLinks, TeacherSidebarLinks } from "@/data/Navlinks"
import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"

interface SidebarLink {
  name: string
  link?: string
  icon: React.ReactNode
  subLinks?: SidebarLink[]
}

export default function SidebarLinks() {
  const [links, setLinks] = useState(StudentSidebarLinks)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const toggle = useSelector((state: RootState) => state.toggle.value)

  const userRole: string = "admin" // Replace with dynamic role

  useEffect(() => {
    if (userRole === "student") setLinks(StudentSidebarLinks)
    else if (userRole === "teacher") setLinks(TeacherSidebarLinks)
    else if (userRole === "staff") setLinks(StaffSidebarLinks)
    else setLinks(AdminSidebarLinks)
  }, [userRole])

  // reactive pathname
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {links.map((item) => {
        // Parent is active if its link OR any sublink matches pathname
        const isActive =
          pathname === item.link ||
          item.subLinks?.some((sub) => sub.link === pathname)

        const isDropdownOpen = openDropdown === item.name || isActive // auto-open if sublink active

        // Regular link (no dropdown)
        if (!item.subLinks?.length) {
          return (
            <Link
              key={item.name}
              href={item.link || "#"}
              className={`flex items-center gap-1 sm:gap-2 py-2 group hover:bcolor hover:bg-[var(--accent)] duration-300 ${
                isActive ? "border-r-5 bcolor hcolor" : "hcolor"
              } ${toggle ? "pl-[20px]" : ""}`}
            >
              <span
                className={`group-hover:text-[var(--primary)] duration-500 ${
                  isActive ? "text-[var(--primary)]" : ""
                } ${toggle ? "text-[15px] md:text-[18px]" : "mx-auto text-[20px] sm:text-[25px]"}`}
              >
                {item.icon}
              </span>

              {toggle && (
                <span
                  className={`text-[13px] sm:text-[16px] group-hover:text-[var(--primary)] ${
                    isActive ? "text-[var(--primary)]" : ""
                  }`}
                >
                  {item.name}
                </span>
              )}
            </Link>
          )
        }

        // Dropdown parent
        return (
          <div key={item.name}>
            <button
              onClick={() => setOpenDropdown(isDropdownOpen ? null : item.name)}
              className={`flex items-center gap-1 sm:gap-2 py-2 w-full group hover:bcolor hover:bg-[var(--accent)] duration-300 ${
                toggle ? "pl-[20px]" : ""
              } ${isActive ? "border-r-5 bcolor hcolor" : ""}`}
            >
              <span
                className={`group-hover:text-[var(--primary)] duration-500 ${
                  toggle ? "text-[15px] md:text-[18px]" : "mx-auto text-[20px] sm:text-[25px]"
                } ${isActive ? "text-[var(--primary)]" : ""}`}
              >
                {item.icon}
              </span>
              {toggle && (
                <span className={`text-[13px] sm:text-[16px] ${isActive ? "text-[var(--primary)]" : ""}`}>
                  {item.name}
                </span>
              )}

              {toggle && item.subLinks && (
                <ChevronRight
                  className={`ml-auto transform transition-transform duration-300 text-[10px] ${
                    isDropdownOpen ? "rotate-90" : ""
                  }`}
                />
              )}
            </button>

            {/* Animated dropdown */}
            {toggle && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isDropdownOpen ? "max-h-40" : "max-h-0"
                } ml-6 mt-1 flex flex-col gap-1`}
              >
                {item.subLinks.map((sub) => (
                  <Link
                    key={sub.name}
                    href={sub.link!}
                    className={`flex items-center gap-2 py-1 pl-2 rounded group hover:bg-[var(--accent)] ${
                      pathname === sub.link ? "text-[var(--primary)] font-medium" : ""
                    }`}
                  >
                    <span className="text-[14px]">{sub.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
