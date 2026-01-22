
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
              flex items-center gap-3 px-3 py-2 group  hover:bcolor
              ${isActive ? "border-r-3 bcolor hcolor" : "hcolor"}
            `}
          >
            <span
              className={`
                text-[15px] md:text-[18px]
                group-hover:text-[var(--primary)]
                ${isActive ? "text-[var(--primary)] " : ""}
                ${toggle ? " md:pl-[20px]" : "mx-auto"}
              `}
            >
              {item.icon}
            </span>

            {toggle && (
              <span
                className={`
                  text-[16px]
                  group-hover:text-[var(--primary)]
                  ${isActive ? "text-[var(--primary)] font-[600]" : ""}
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
