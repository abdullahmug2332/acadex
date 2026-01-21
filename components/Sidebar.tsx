"use client";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { RootState } from "@/store/store";
import Image from "next/image";
import { toggleValue } from "@/store/toggleSlice";
import { TfiAlignRight } from "react-icons/tfi";
import { TfiAlignJustify } from "react-icons/tfi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { clearUser } from "@/store/userSlice";
import { FaBell } from "react-icons/fa6";
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

  return (
    <div className={`${toggle == true ? "w-[30%] sm:w-[26%] md:w-[20%] xl:w-[17%] 2xl:w-[15%]" : "w-[8%] md:w-[6%] lg:w-[4%]"
      }  fixed top-0 left-0 h-screen bg-[#ebeefd] duration-500 flex flex-col pb-[20px]`}>

      <div className="flex items-center gap-[0px] w-full justify-center mt-[5px]">
        <Image src={"/logo.png"} className={`${toggle ? "w-[70%] mx-auto" : "w-[0%] "}   duration-500 `} width={500} height={400} alt="logo.png" />
        {
          toggle ? <TfiAlignRight
            className="text-[20px] lg:text-[30px] hover:cursor-pointer text-[var(--foreground)]"
            onClick={() => dispatch(toggleValue())}
          /> : <TfiAlignJustify
            className="text-[20px] lg:text-[30px] mt-[10px] hover:cursor-pointer text-[var(--foreground)]"
            onClick={() => dispatch(toggleValue())}
          />
        }



      </div>
     
      
      <div className={` duration-500  flex md:hidden justify-center justify-center gap-[5px] md:gap-[10px] items-center mt-auto  `}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 " >
              <div className="relative inline-block">
                <Avatar className="w-[35px] md:w-[40px] h-auto md:h-[40px]">
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
        <div className={`${toggle == true ? "lg:w-[70px] " : "hidden"} flex flex-col gap-[0px] items-start mt-[5px]  lg:w-[70px]`}>
          <p className="text-[14px] sm:text-[16px] md:text-[20px] font-[500] leading-5">Abdullah</p>
          <p className="text-[8px] sm:text-[10px] md:text-[13px] font-[400]">Student</p>
        </div>
      </div>
    </div>
  )
}
