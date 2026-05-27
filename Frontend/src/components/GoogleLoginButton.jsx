import React from "react";
import google from "../assets/google.png";
import axios from "../utils/AxiosUser";
import { toast } from "react-hot-toast";

const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      if (!window.google) {
        toast.error("Google SDK chưa tải");
        return;
      }

      window.google.accounts.id.initialize({
        client_id:
          "YOUR_GOOGLE_CLIENT_ID",
        callback: async (response) => {
          try {
            const tokenId =
              response.credential;

            const res =
              await axios.post(
                "/api/auth/google",
                {
                  tokenId,
                }
              );

            if (res.data.success) {
              toast.success(
                "Đăng nhập Google thành công!"
              );

              localStorage.setItem(
                "accessToken",
                res.data.data
                  .accessToken
              );

              localStorage.setItem(
                "refreshToken",
                res.data.data
                  .refreshToken
              );

              setTimeout(() => {
                window.location.href =
                  "/";
              }, 1000);
            } else {
              toast.error(
                res.data.message
              );
            }
          } catch (error) {
            toast.error(
              error.response?.data
                ?.message ||
                "Đăng nhập thất bại"
            );
          }
        },
      });

      window.google.accounts.id.prompt();
    } catch (error) {
      console.error(error);

      toast.error(
        "Không thể đăng nhập Google"
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full h-12 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 font-medium text-gray-700"
    >
      <img
        src={google}
        alt="Google"
        className="w-5 h-5"
      />

      <span>Đăng nhập bằng Google</span>
    </button>
  );
};

export default GoogleLoginButton;