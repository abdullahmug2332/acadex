"use client";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { RootState } from "@/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearUser } from "@/store/userSlice";
import { toggleValue } from "@/store/toggleSlice";
import { TfiAngleLeft } from "react-icons/tfi";
import SidebarLinks, { SidebarLink } from "./SidebarLinks"
import { FaHome, FaUsers, FaCog } from "react-icons/fa"
import { TfiHeadphoneAlt } from "react-icons/tfi";
import Profile from "./Profile";

export default function Sidebar() {
  const router = useRouter();
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    dispatch(clearUser());
    router.push("/auth");
    router.refresh();
  };
  const sidebarLinks: SidebarLink[] = [
    {
      name: "Dashboard",
      link: "/",
      icon: <FaHome />,
    },
    {
      name: "Users",
      link: "/users",
      icon: <FaUsers />,
    },
    {
      name: "Settings",
      link: "/settings",
      icon: <FaCog />,
    },
  ]

  return (
    <div className={`${toggle == true ? "w-[35%] sm:w-[26%] md:w-[22%] xl:w-[17%] 2xl:w-[15%]" : "w-[10%] sm:w-[7%] md:w-[6%] lg:w-[5%] xl:w-[4%]"
      }  fixed top-0 left-0 h-screen bg-[#ebeefd] duration-500 flex flex-col pb-[20px] z-[999] overflow-hidden`}>

      <div className="flex items-center justify-center gap-[5px]  w-full justify-center  mt-[10px]" onClick={() => dispatch(toggleValue())}>
        <TfiAngleLeft
          className={`${toggle ? "md:hidden" : "hidden"} duration-500 text-[10px] lg:text-[25px]  hover:cursor-pointer text-[var(--foreground)]`}

        />
        <Image src={`${toggle == true ? "/logo.png" : "/logo2.png"}`} className={` ${toggle == true ? "w-[70%] lg:w-[50%]" : "w-[70%] lg:w-[50%]"}w-[70%] lg:w-[50%] duration-500 `} width={500} height={400} alt="logo.png" />
      </div>

      <div className="mt-[20px]">
        <SidebarLinks links={sidebarLinks} />
      </div>




      <div className={`${toggle ? "flex-row" : "flex-col"} flex items-center gap-[10px] justify-center mt-auto`}>
        <div className="block md:hidden">
          <Profile />
        </div>
        <div className="flex items-center gap-[5px]">
          <TfiHeadphoneAlt className="text-[28px] md:text-[30px]" />
          <p className={`${toggle? "hidden md:block":"hidden"} text-[17px] font-bold  `}>Support</p>
        </div>
      </div>

    </div>
  )
}
