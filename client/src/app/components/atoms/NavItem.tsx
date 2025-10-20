"use client";
import "@/app/styles/components/atoms/navItem.scss";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  label: string;
  title?: string;
}

const NavItem = ({ href, label, title }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");
  return (
    <li className={"nav-item" + (isActive ? " active" : "") }>
      <a href={href} title={title}>
        {label}
      </a>
    </li>
  );
};

export default NavItem;