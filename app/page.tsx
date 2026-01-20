"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";




export default function Home() {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.push("/auth");
    router.refresh();
  };



  if (!user) return <p>User not logged in</p>; // Only shows if fetch fails
  return (
    <div>
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
