import Grid from "@mui/material/Grid";
import CardWrapper from "../../atoms/CardWrapper";
import CoreNumber from "../../atoms/CoreNumber";
import type { ICard } from "../../../interfaces/card.interface";

interface Props {
  card: ICard | null;
  quantity: number | "";
  setQuantity: (val: number | "") => void;
}

const CardImageAndQuantity = ({ card, quantity, setQuantity }: Props) => (
  <Grid
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 6,
      height: "100%",
    }}
  >
    <CardWrapper url={card?.cards?.imageUrl || undefined} name={card?.name || undefined} />
    <CoreNumber min={1} max={100} value={quantity} setValue={setQuantity} label="Quantity to Add" />
  </Grid>
);

export default CardImageAndQuantity;
