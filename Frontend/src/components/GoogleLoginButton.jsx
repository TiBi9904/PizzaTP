import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "../utils/AxiosUser";
import { toast } from "react-hot-toast";

const GoogleLoginButton = () => {
  const handleSuccess = async (
    credentialResponse
  ) => {
    const tokenId =
      credentialResponse?.credential;

    if (!tokenId) {
      toast.error(
        "Không nhận được id_token từ Google"
      );
      return;
    }

    try {
      const res = await axios.post(
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
          res.data.data.accessToken
        );

        localStorage.setItem(
          "refreshToken",
          res.data.data.refreshToken
        );

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        toast.error(
          res.data.message ||
            "Đăng nhập thất bại"
        );
      }
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi đăng nhập!"
      );
    }
  };

  const handleError = () => {
    toast.error(
      "Đăng nhập Google thất bại"
    );
  };

  return (
    <div className="w-full">
      <div className="w-full overflow-hidden rounded-xl border border-gray-300">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          width="100%"
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
        />
      </div>
    </div>
  );
};

export default GoogleLoginButton;