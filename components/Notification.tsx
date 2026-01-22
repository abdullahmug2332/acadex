import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaBell } from "react-icons/fa6";
export default function Notification() {
  return (
    <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <span className="absolute top-0 -right-1 h-2 w-2 rounded-full bg ring-1 ring-white" />
              <FaBell className="text-[20px] md:text-[25px]" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 bg2">
            <DropdownMenuItem className="">Notification1</DropdownMenuItem>
            <DropdownMenuItem className="">Notification2</DropdownMenuItem>
            <DropdownMenuItem className="">Notification3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  )
}
