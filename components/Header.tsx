"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/userSlice";
import Profile from "./Profile";
import Notification from "./Notification";
import HeaderSearchBar from "./HeaderSearchBar";
import { toggleValue } from "@/store/toggleSlice";
import { TfiAlignLeft } from "react-icons/tfi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toggle = useSelector((state: RootState) => state.toggle.value);

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    dispatch(clearUser());
    router.push("/auth");
    router.refresh();
  };

  return (
    <div className='sticky top-0 right-0 w-full  py-[10px] px-[20px]  shadow-b text-center bg-[#ebeefd] flex justify-between items-center '>

      <TfiAlignLeft
        className={`${!toggle ? "" : "transform -scale-x-100"}  duration-500 text-[20px] lg:text-[25px]  hover:cursor-pointer text-[var(--foreground)]`}
        onClick={() => dispatch(toggleValue())}
      />

      <HeaderSearchBar />
      <div className="flex justify-center gap-[10px] lg:gap-[20px] items-center">
        <Notification />
        <div className="hidden md:block">
          <Profile />
        </div>
      </div>
    </div>
  )
}
