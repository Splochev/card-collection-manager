import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../../styles/components/organisms/popoverMenu.scss";

export interface PopoverMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  component?: React.ReactNode; // For custom components like ThemeSwitcher
}

interface PopoverMenuProps {
  trigger: React.ReactNode;
  items: PopoverMenuItem[];
  className?: string;
}

const PopoverMenu: React.FC<PopoverMenuProps> = ({ trigger, items, className = "" }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Only close if click is outside the menu, not inside
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // For portal positioning
  const [menuPosition, setMenuPosition] = useState<{top: number, left: number} | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.right - 160, // 160 = minWidth
      });
    }
  }, [open]);

  return (
    <div className={`popover-menu ${className}`} ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <span ref={triggerRef} onClick={() => setOpen((v) => !v)} style={{ cursor: "pointer" }}>
        {trigger}
      </span>
      {open && menuPosition && createPortal(
        <div
          className="popover-menu-list"
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPosition.top,
            left: menuPosition.left,
            minWidth: 160,
            background: "var(--color-background-paper)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            borderRadius: 8,
            zIndex: 9999,
          }}
        >
          {items.map((item, idx) => (
            item.component ? (
              <div
                key={idx}
                className="popover-menu-item"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px" }}
              >
                {item.icon && <span>{item.icon}</span>}
                <span style={{ flex: 1 }}>{item.component}</span>
              </div>
            ) : (
              <div
                key={idx}
                className="popover-menu-item"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", cursor: "pointer" }}
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            )
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default PopoverMenu;
