import { userLogin } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypographyH3 } from "@/components/ui/typographyH3";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const data = await userLogin({ emailOrUsername, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.username);
      navigate("/admin");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.message || "Login failed");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--main-color)] px-4">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <div className="flex justify-center mb-4">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-16 w-16 rounded-full"
            />
          </div>
          <TypographyH3 className="mb-6 text-center text-blue-900">
            Login
          </TypographyH3>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="emailOrUsername">Email or Username</Label>
              <Input
                id="emailOrUsername"
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Icons.eye size={20} />
                  ) : (
                    <Icons.eyeOff size={20} />
                  )}
                </button>
              </div>
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
            <Button type="submit" className="w-full mt-4">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
