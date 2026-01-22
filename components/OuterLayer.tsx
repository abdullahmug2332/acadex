import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
interface OuterLayerProps {
    children: ReactNode;
}

export default function OuterLayer({ children }: OuterLayerProps) {
    const toggle = useSelector((state: RootState) => state.toggle.value);
    return <div className={`${toggle
        ? "w-[89%]  md:w-[78%] xl:w-[83%] 2xl:w-[85%]"
        : "w-[90%] sm:w-[93%] md:w-[94%] lg:w-[95%] xl:w-[96%]"
        } ml-auto duration-500 `}>
        {
            toggle && <div className="bg-black opacity-45 w-full h-screen fixed z-[800] md:hidden">.</div>
        }
        {children}
    </div>;
}
