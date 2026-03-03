"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/userSlice";
import { logoutUser } from "@/lib/auth";
import { toast } from "sonner";

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser();

      dispatch(clearUser());
      toast.success("User Logout successfully!");
      router.push("/auth");

      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className=" justify-center gap-[5px] md:gap-[10px] items-center flex z-[999] cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 "
          >
            <div className="relative inline-block">
              <Avatar className="w-[35px] md:w-[40px] h-[35px] md:h-[40px] cursor-pointer">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-30 md:w-60 bg2 z-[999]">
          <DropdownMenuItem className="">
            <div className="relative inline-block">
              <Avatar className="w-[35px] md:w-[40px] h-[35px] md:h-[40px]">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-[0px] items-start mt-[5px]  lg:w-[100px]">
              <p className="text-[16px] md:text-[20px] font-[500] leading-5">
                Abdullah
              </p>
              <p className="text-[10px] md:text-[13px] font-[400]">Student</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
