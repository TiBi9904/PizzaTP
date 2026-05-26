import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserShield, FaTruck } from "react-icons/fa";

const HeaderRoleMenu = ({ closeMenu }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    window.open(path, "_blank");
    if (closeMenu) closeMenu();
  };

  const handleNavigates = (path) => {
    navigate(path);
    if (closeMenu) closeMenu();
  };

  return (
    <ul className="space-y-2 text-sm">
      <li>
        <button
          onClick={() => handleNavigates("/dang-nhap")}
          className="w-full flex items-center gap-2 text-left px-3 py-2 rounded hover:bg-red-100 transition-colors"
        >
          <FaSignInAlt className="text-red-500" />
          Đăng nhập
        </button>
      </li>

      <li>
        <button
          onClick={() => handleNavigate("/quan-tri-vien/dang-nhap")}
          className="w-full flex items-center gap-2 text-left px-3 py-2 rounded hover:bg-red-100 transition-colors"
        >
          <FaUserShield className="text-blue-600" />
          Quản trị viên
        </button>
      </li>

      <li>
        <button
          onClick={() => handleNavigate("/nhan-vien-giao-hang/dang-nhap")}
          className="w-full flex items-center gap-2 text-left px-3 py-2 rounded hover:bg-red-100 transition-colors"
        >
          <FaTruck className="text-green-600" />
          Nhân viên
        </button>
      </li>
    </ul>
  );
};

export default HeaderRoleMenu;