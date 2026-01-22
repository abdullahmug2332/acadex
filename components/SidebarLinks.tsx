
export interface SidebarLink {
    name: string
    link: string
    icon: React.ReactNode
}
interface SidebarLinksProps {
    links: SidebarLink[]
}
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function SidebarLinks({ links }: SidebarLinksProps) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : ""

  const toggle = useSelector((state: RootState) => state.toggle.value)

  return (
    <nav className="flex flex-col gap-1">
      {links.map((item) => {
        const isActive = pathname === item.link

        return (
          <a
            key={item.name}
            href={item.link}
            className={`
              flex items-center gap-1  sm:gap-3 px-3 py-2 group  hover:bcolor
              ${isActive ? "border-r-5 bcolor hcolor" : "hcolor"}
            `}
          >
            <span
              className={`
                
                group-hover:text-[var(--primary)] duration-500
                ${isActive ? "text-[var(--primary)] " : ""}
                ${toggle ? " md:pl-[20px] text-[15px] md:text-[18px]" : "mx-auto text-[20px] md:text-[25px]"}
              `}
            >
              {item.icon}
            </span>

            {toggle && (
              <span
                className={`
                  text-[13px] sm:text-[16px]
                  group-hover:text-[var(--primary)]
                  ${isActive ? "text-[var(--primary)] " : ""}
                `}
              >
                {item.name}
              </span>
            )}
          </a>
        )
      })}
    </nav>
  )
}
