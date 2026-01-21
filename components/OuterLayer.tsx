import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
interface OuterLayerProps {
    children: ReactNode;
}

export default function OuterLayer({ children }: OuterLayerProps) {
    const toggle = useSelector((state: RootState) => state.toggle.value);
    return <div className={`${toggle
            ? "w-[70%] sm:w-[74%] md:w-[80%] xl:w-[83%] 2xl:w-[85%]"
            : "w-[92%] md:w-[94%] lg:w-[96%]"
        } ml-auto duration-500`}>
        {children}
    </div>;
}
