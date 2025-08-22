import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef, useState, useEffect } from "react";

const Chips = ({
  labels,
  width = "35rem",
}: {
  labels: string[];
  width?: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [labels.length]);

  const scrollBy = (amount: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const showButtons = canScrollLeft || canScrollRight;
  return (
    <Grid
      sx={{
        display: "flex",
        gap: 1,
        maxWidth: width,
        alignItems: "center",
      }}
    >
      {showButtons && (
        <IconButton
          onClick={() => {
            if (!canScrollLeft) return;
            scrollBy(-120);
          }}
          aria-label="Scroll left"
        >
          <ChevronLeftIcon />
        </IconButton>
      )}
      <Grid
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {labels.map((label, index) => (
          <Chip key={index} label={label} />
        ))}
      </Grid>
      {showButtons && (
        <IconButton
          onClick={() => {
            if (!canScrollRight) return;
            scrollBy(120);
          }}
          aria-label="Scroll right"
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Grid>
  );
};

export default Chips;
