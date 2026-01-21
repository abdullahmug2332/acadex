"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoSearchOutline } from "react-icons/io5";
import { FaBell } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/userSlice";

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
      <p className="subheading">Dashboard</p>
      <div className="w-[35%] lg:w-[50%] relative flex items-center h-[30px] md:h-[40px]">
        <IoSearchOutline className="bg-white text-[20px] text-[var(--foreground)] h-[100%] w-[40px] pl-[15px] rounded-tl-[25px] rounded-bl-[25px]" />
        <input type="search" placeholder="Search" className="bg-white py-[7px] pl-[5px] pr-[20px] h-[100%] focus:outline-0  rounded-tr-[25px] rounded-br-[25px] w-full" />
      </div>
      <div className="flex justify-center gap-[10px] lg:gap-[20px] items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <span className="absolute top-0 -right-1 h-2 w-2 rounded-full bg ring-1 ring-white" />
              <FaBell className="text-[20px] md:text-[25px]" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 bg2">
            <DropdownMenuItem className="color">Notification1</DropdownMenuItem>
            <DropdownMenuItem className="color">Notification2</DropdownMenuItem>
            <DropdownMenuItem className="color">Notification3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden justify-center gap-[5px] md:gap-[10px] items-center md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 " >
                <div className="relative inline-block">
                  <Avatar className="w-[35px] md:w-[40px] h-[35px] md:h-[40px]">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>

                  {/* Badge OUTSIDE Avatar */}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg ring-2 ring-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40 bg2">
              <DropdownMenuItem >Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-col gap-[0px] items-start mt-[5px]  lg:w-[100px]">
            <p className="text-[16px] md:text-[20px] font-[500] leading-5">Abdullah</p>
            <p className="text-[10px] md:text-[13px] font-[400]">Student</p>
          </div>
        </div>
      </div>
    </div>
  )
}
