"use client";
import "../../styles/components/organisms/navigation.scss";
import NavItem from "../atoms/NavItem";
import CoreInput from "../atoms/CoreInput";
import UserMenu from "./UserMenu";
import { useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import useMediaQuery from "@/hooks/useMediaQuery";
import { PAGES } from "@/constants";

const Navigation = ({ position = "top" }: { position?: "top" | "bottom" }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const debouncedRedirect = useMemo(
    () =>
      debounce((value: string) => {
        const paredValue = value.trim().toUpperCase();
        if (paredValue) {
          router.push(`/cards/${paredValue}`);
        }
      }, 500),
    [router]
  );

  useEffect(() => {
    return () => {
      debouncedRedirect.cancel();
    };
  }, [debouncedRedirect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedRedirect(e.target.value);
  };

  const isWide = useMediaQuery("(min-width: 800px)");
  const showNavLinks = position === "bottom" || isWide;
  const hideBottomNav = position === "bottom" && isWide;
  const showSearchAndUserMenu = position === "top";

  if (hideBottomNav) return null;
  return (
    <nav className="navigation">
      {showNavLinks && (
        <ul
          className={`nav-links ${position === "bottom" ? "full-width" : ""}`}
        >
          {PAGES.map((page) => (
            <NavItem
              key={page.index}
              href={page.route}
              label={page.label}
              title={page.searchLabel}
            />
          ))}
        </ul>
      )}
      {showSearchAndUserMenu && (
        <>
          <div
            className={`search ${isWide ? "search-max-width" : "full-width"}`}
          >
            <CoreInput
              label="Search..."
              value={search}
              onChange={handleInputChange}
            />
          </div>
          <UserMenu />
        </>
      )}
    </nav>
  );
};

export default Navigation;
