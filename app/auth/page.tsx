"use client";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { MdErrorOutline } from "react-icons/md";
import { useAppDispatch } from "@/store/hooks";
import { setUser, clearUser } from "@/store/userSlice";
import { Button } from "@/components/ui/button";
import { checkAuth, loginUser } from "@/lib/auth";
import { toast } from "sonner";

export default function Auth() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const data = await checkAuth();

        if (data.authenticated) {
          router.replace("/");
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);
      dispatch(setUser(data.user));
      toast.success("User Login successfully!");
      router.push("/");
      
    } catch (err: any) {
      dispatch(clearUser());

      setError(err.response?.data?.error || "Something went wrong");
    }
  };
  if (loading) return <p>Loadingg...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg2">
      <div className="w-[90%] max-w-sm p-6 bg-white rounded-lg shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-[70%] object-contain" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="feild"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="feild !w-[85%] !rounded-tr-none !rounded-br-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="feild !w-[14%] border flex justify-center !px-0 !rounded-tl-none !rounded-bl-none"
              >
                {showPassword ? (
                  <FiEyeOff className="text-[20px]" />
                ) : (
                  <FiEye className="text-[20px]" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm flex items-center gap-[5px]">
              <MdErrorOutline />
              {error}
            </p>
          )}

          <Button type="submit" className="btn w-full">
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
}
