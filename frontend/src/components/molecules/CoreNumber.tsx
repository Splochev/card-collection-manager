import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CoreInput from "./CoreInput";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useRef, useEffect, useState } from "react";

interface CoreNumberProps {
  min: number;
  max: number;
  value: number | "";
  label: string;
  setValue: (value: number | "") => void;
}

const buttonStyle = {
  minWidth: 0,
  padding: 0,
  width: "fit-content",
  height: "fit-content",
  borderRadius: 2.5,
};

const CoreNumber = ({ min, max, value, label, setValue }: CoreNumberProps) => {
  const [quantity, setQuantity] = useState<number | "">(value);
  const [lastValid, setLastValid] = useState<number | "">(value);
  const holdInterval = useRef<number | null>(null);
  const holdAction = useRef<(() => void) | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input === "") {
      setQuantity("");
      return;
    }

    const newValue = Number(input);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setQuantity(newValue);
      setLastValid(newValue);
    } else {
      setQuantity(lastValid);
    }
  };

  // Hold logic
  const handleDecrement = () => {
    setQuantity((prev) => {
      if (prev !== "" && prev > min) {
        const newValue = prev - 1;
        setLastValid(newValue);
        return newValue;
      }
      return prev;
    });
  };

  const handleIncrement = () => {
    setQuantity((prev) => {
      if (prev !== "" && prev < max) {
        const newValue = prev + 1;
        setLastValid(newValue);
        return newValue;
      }
      return prev;
    });
  };

  const startHold = (action: () => void) => {
    holdAction.current = action;
    action();
    let speed = 120;
    let elapsed = 0;
    holdInterval.current = window.setInterval(() => {
      elapsed += speed;
      if (holdAction.current) holdAction.current();
      if (elapsed >= 1500 && speed === 120) {
        speed = 40;
        clearInterval(holdInterval.current!);
        holdInterval.current = window.setInterval(() => {
          if (holdAction.current) holdAction.current();
        }, speed);
      }
    }, speed);
  };

  const stopHold = () => {
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
      holdAction.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (holdInterval.current) {
        clearInterval(holdInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    setValue(quantity);
  }, [quantity, setValue]);

  function onClickPaperFocusInput() {
    const input = document.getElementById("core-number-input");
    input?.focus();
  }

  return (
    <Paper
      elevation={6}
      sx={{ padding: 2, borderRadius: 3 }}
      onClick={onClickPaperFocusInput}
    >
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 2,
        }}
      >
        <Typography variant="body1" component="h2">
          {label}
        </Typography>
        <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            disabled={quantity === "" || quantity <= min}
            sx={buttonStyle}
            onMouseDown={() => startHold(handleDecrement)}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={() => startHold(handleDecrement)}
            onTouchEnd={stopHold}
          >
            <Paper elevation={10} sx={{ padding: 0.9, borderRadius: 2.5 }}>
              <RemoveIcon />
            </Paper>
          </Button>
          <Grid sx={{ width: "80px", marginRight: 2 }}>
            <CoreInput
              id="core-number-input"
              type="number"
              value={quantity}
              onChange={handleInputChange}
              responsive
            />
          </Grid>
          <Button
            disabled={quantity === "" || quantity >= max}
            sx={buttonStyle}
            onMouseDown={() => startHold(handleIncrement)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={() => startHold(handleIncrement)}
            onTouchEnd={stopHold}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Paper elevation={10} sx={{ padding: 0.9, borderRadius: 2.5 }}>
              <AddIcon />
            </Paper>
          </Button>
        </Grid>
      </Grid>
      <Button variant="contained" sx={{ marginTop: 2, width: "100%" }}>
        Add to Collection
      </Button>
    </Paper>
  );
};

export default CoreNumber;
