"use client";
import "../../styles/components/organisms/topNavigation.scss";
import NavItem from "../atoms/NavItem";
import CoreInput from "../atoms/CoreInput";
import UserMenu from "./UserMenu";
import { useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import debounce from "lodash/debounce";

const ROUTES_MAP = {
  CARDS: "/cards",
  COLLECTION: "/collection",
};

const PAGES = [
  {
    label: "Cards",
    index: 0,
    route: ROUTES_MAP.CARDS,
    searchLabel: "Find cards by set number",
  },
  {
    label: "Collection",
    index: 1,
    route: ROUTES_MAP.COLLECTION,
    searchLabel:
      "Find cards in collection by card name, set number or set name",
  },
  {
    label: "Wishlist",
    index: 2,
    route: "/wishlist",
    searchLabel: "Find cards in wishlist by card name, set number or set name",
  },
];

const TopNavigation = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Debounced redirect function
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

  return (
    <nav className="top-navigation">
      <ul className="nav-links">
        {PAGES.map((page) => (
          <NavItem
            key={page.index}
            href={page.route}
            label={page.label}
            title={page.searchLabel}
          />
        ))}
      </ul>
      <div className="search">
        <CoreInput
          label="Search..."
          value={search}
          onChange={handleInputChange}
        />
      </div>
      <UserMenu />
    </nav>
  );
};

export default TopNavigation;
