"use client";
import Toggle from "../atoms/Toggle";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeSwitcher = ({ label }: { label?: string }) => {

  // Immediately set theme class on first render
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("theme") === "dark";
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return isDark;
    }
    return false;
  };

  const [dark, setDark] = useState(getInitialTheme);


  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <Toggle
      label={label}
      checked={dark}
      onChange={setDark}
      thumbIcon={
        dark ? (
          <FaSun style={{ color: "var(--color-primary-contrast)" }} />
        ) : (
          <FaMoon style={{ color: "var(--color-secondary-main)" }} />
        )
      }
    />
  );
};

export default ThemeSwitcher;
