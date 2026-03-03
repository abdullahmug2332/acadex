"use client";
import Profile from "./Profile";
import Notification from "./Notification";
import HeaderSearchBar from "./HeaderSearchBar";
import { TfiAlignLeft } from "react-icons/tfi";
import { SidebarTrigger } from "./ui/sidebar";
export default function Header() {
  return (
    <div className="fixed md:sticky top-0 right-0 py-[10px] px-[10px] md:px-[20px] bg-white shadow-b text-center border-b flex justify-between items-center z-[9] w-full">
      <SidebarTrigger>
        <TfiAlignLeft
          className={` duration-500 text-[20px] lg:text-[25px]  hover:cursor-pointer text-[var(--foreground)]`}
        />
      </SidebarTrigger>
      <HeaderSearchBar />
      <div className="flex justify-center gap-[10px] lg:gap-[20px] items-center">
        <Notification />
        <div className=" cursor-pointer">
          <Profile />
        </div>
      </div>
    </div>
  );
}
