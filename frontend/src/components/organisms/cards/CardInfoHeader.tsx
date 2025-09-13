import { Grid, Typography } from "@mui/material";
import Chips from "../../molecules/Chips";
import type { ICard } from "../../../interfaces/card.interface";

const CardInfoHeader = ({ card }: { card: ICard | null }) => {
  return (
    <Grid width={"100%"}>
      <Typography variant="h5" sx={{ textWrap: "wrap", marginBottom: 1 }}>
        {card?.name}
      </Typography>
      <Chips labels={card?.rarities || []} />
    </Grid>
  );
};

export default CardInfoHeader;
