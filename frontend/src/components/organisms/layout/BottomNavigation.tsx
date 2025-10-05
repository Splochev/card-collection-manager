import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import { PAGES } from "../../../constants";
import { getTabProps } from "../../../utils";
import * as React from "react";

const BottomNavigation = ({
  value,
  handleChange,
}: {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
}) => {
  return (
    <Paper
      sx={{
        borderRadius: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingX: 1,
      }}
      elevation={3}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="navigation"
        sx={{
          width: "100%",
          "& .MuiTabs-list": {
            justifyContent: "space-around",
          },
        }}
      >
        {PAGES.map((page) => (
          <Tab
            key={page.index}
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {page.icon && <page.icon size="small" />}
                {page.label}
              </div>
            }
            component="a"
            href={page.route}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
              }
            }}
            {...getTabProps(page.index)}
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default BottomNavigation;
