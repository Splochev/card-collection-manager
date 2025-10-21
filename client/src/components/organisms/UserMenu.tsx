import React from "react";
import { FaUserCircle, FaSignOutAlt, FaEdit } from "react-icons/fa";
import ThemeSwitcher from "./ThemeSwitcher";
import IconButton from "../atoms/IconButton";
import PopoverMenu, { PopoverMenuItem } from "../organisms/PopoverMenu";

const UserMenu: React.FC = () => {
  const menuItems: PopoverMenuItem[] = [
    {
      label: "Theme",
      component: <ThemeSwitcher label="Theme"/>,
    },
    {
      label: "Edit User",
      icon: <FaEdit style={{ color: "var(--color-primary-main)" }} />,
      onClick: () => alert("Edit user clicked"),
    },
    {
      label: "Logout",
      icon: <FaSignOutAlt style={{ color: "var(--color-error-main)" }} />,
      onClick: () => alert("Logout clicked"),
    },
  ];

  return (
    <PopoverMenu
      trigger={<IconButton icon={<FaUserCircle size={32} style={{ color: "var(--color-primary-main)" }} />} ariaLabel="User menu" />}
      items={menuItems}
    />
  );
};

export default UserMenu;
