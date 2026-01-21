"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/userSlice";

export default function Home() {
  const user = useAppSelector((state) => state.user.user);
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



  if (!user) return <p>User not logged in</p>;
  return (
    <div className="border">
      <p>Welcome {user.name}</p>
      <p>Id: {user.id}</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
