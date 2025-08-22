import { Grid, Typography } from "@mui/material";
import Chips from "../../atoms/Chips";
import CardSetInfo from "./CardSetInfo";
import CardStats from "./CardStats";
import type { ICard } from "../../../interfaces/card.interface";

const CardFullInfo = ({card} : {card: ICard | null}) => {
    return (  
      <Grid sx={{ display: "flex", flexDirection: "column", gap: 4, height: "100%", maxWidth: "35rem" }}>
        <Grid width={"100%"}>
          <Typography variant="h5" sx={{ textWrap: "wrap", marginBottom: 1 }}>
            {card?.name}
          </Typography>
          <Chips labels={card?.rarities || []} />
        </Grid>
        <CardSetInfo card={card} />
        <CardStats card={card} />
      </Grid>
    );
}
 
export default CardFullInfo;