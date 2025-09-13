import { Grid, useMediaQuery } from "@mui/material";
import CardWrapper from "../../atoms/CardWrapper";
import CoreNumber from "../../molecules/CoreNumber";
import type { ICard } from "../../../interfaces/card.interface";
import CardInfoHeader from "./CardInfoHeader";

interface Props {
  card: ICard | null;
  quantity: number | "";
  setQuantity: (val: number | "") => void;
}

const CardImageAndQuantity = ({ card, quantity, setQuantity }: Props) => {
  const isNotWiderThan900 = useMediaQuery('(max-width:900px)');

  return <Grid
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 6,
      flex: { xs: "1 1 100%", md: "0 0 25rem" },
      width: { xs: "100%", md: "25rem" },
      minWidth: { xs: 0, md: '18em' },
      maxWidth: { xs: "21rem", md: "25rem" }
    }}
  >
    {isNotWiderThan900 && <CardInfoHeader card={card} />}
    <CardWrapper url={card?.cards?.imageUrl || undefined} name={card?.name || undefined} />
    <CoreNumber min={1} max={100} value={quantity} setValue={setQuantity} label="Quantity to Add" />
  </Grid>
};

export default CardImageAndQuantity;
