import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "@/api/auth";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setErrorMessage("请勾选《我同意》");
      return;
    }

    setErrorMessage(null);

    try {
      const data = await userLogin({ emailOrUsername, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.username);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.message || "Login failed");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative text-white"
      style={{
        backgroundImage: "url('/images/casino_bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-lg text-center">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-40 w-40 mx-auto mb-4 rounded-full"
        />

        <h1 className="text-6xl font-bold text-yellow-400 mb-8">新金宝</h1>

        <form onSubmit={handleLogin} className="space-y-4 text-left px-6">
          <div>
            <div className="relative">
              <Input
                id="emailOrUsername"
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                className="pl-10 bg-white/10 border border-yellow-500 text-white placeholder:text-gray-300"
              />
              <Icons.user className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
            </div>
          </div>

          <div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 bg-white/10 border border-yellow-500 text-white placeholder:text-gray-300"
              />
              <Icons.lock className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400"
                tabIndex={-1}
              >
                {showPassword ? (
                  <Icons.eye size={18} />
                ) : (
                  <Icons.eyeOff size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 text-2xl">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="w-6 h-6"
              />
              <span>我同意</span>
            </label>

            <span className="text-center">
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-red-600 hover:underline text-2xl"
              >
                《服务与条款》
              </button>
            </span>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-6 h-6"
              />
              <span>记住帐号</span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-gradient-to-b from-yellow-400 to-yellow-700 hover:from-yellow-500 hover:to-yellow-800 text-black font-bold py-2 text-lg rounded-md shadow-lg"
          >
            登录
          </Button>
        </form>

        <div className="text-center mt-10 text-2xl">
          <span>在线客服</span>
          <br />
          <span className="block mt-1 text-2xl">Copyright © 2023–2035</span>
        </div>
      </div>

      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
          <div className="bg-white text-black rounded-xl shadow-2xl p-6 w-80 text-center animate-fadeIn">
            <div className="flex justify-center mb-3">
              <Icons.circleAlert size={40} className="text-red-500" />
            </div>
            <p className="mb-4 text-red-500 text-lg font-semibold">
              {errorMessage}
            </p>
            <Button
              onClick={() => setErrorMessage(null)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              确定
            </Button>
          </div>
        </div>
      )}

      {showTerms && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-40">
          <div className="bg-[url('/images/red_pattern.png')] bg-cover text-white rounded-xl shadow-2xl p-6 w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto border-2 border-yellow-600 animate-fadeIn">
            <h2 className="text-3xl font-bold text-center text-yellow-400 mb-4">
              协议条款
            </h2>
            <div className="text-lg leading-relaxed space-y-3 px-2">
              <p>
                为避免客户对本站下注时之争议，请会员务必于进入网站前，详细阅读本网站所订定的各项规则。
              </p>
              <p>1. 本公司为缅甸柬埔寨联合互联网交易机构...</p>
              <p>2. 客户有责任确保自己的账户资料安全...</p>
              <p>3. 为避免争议，会员在下注之后...</p>
              <p>4. 若发现任何异常状况，本公司有权取消注单...</p>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => setShowTerms(false)}
                className="px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              >
                我已阅读
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
