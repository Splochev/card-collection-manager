// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CollectionSvg from "../../assets/collection.svg?react";
import { store } from "../../stores/store";
import { darkTheme, lightTheme } from "../../themes";

const SIZE_MAP = {
  small: "h-8",
  medium: "h-10",
  large: "h-12",
};

type IconProps = {
  size?: "small" | "medium" | "large";
};

const CollectionIcon = ({ size = "small" }: IconProps) => {
  return (
    <CollectionSvg
      className={SIZE_MAP[size]}
      style={{
        fill: "currentColor",
        color:
          store.getState().theme.mode === "light"
            ? lightTheme.palette.primary.main
            : darkTheme.palette.primary.main,
      }}
    />
  );
};

export default CollectionIcon;
