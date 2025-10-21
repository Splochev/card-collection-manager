"use client";
import "@/app/styles/components/organisms/ThemeSwitcher.scss";
import Toggle from "../atoms/Toggle";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeSwitcher = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="theme-switcher">
      <Toggle
        checked={dark}
        onChange={setDark}
        thumbIcon={dark ? <FaSun style={{ color: "var(--color-primary-contrast)" }} /> : <FaMoon style={{ color: "var(--color-secondary-main)" }} />}
      />
    </div>
  );
};

export default ThemeSwitcher;
