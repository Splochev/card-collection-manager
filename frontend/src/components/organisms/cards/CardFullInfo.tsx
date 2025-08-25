import { Grid, Typography } from "@mui/material";
import Chips from "../../molecules/Chips";
import CardSetInfo from "./CardSetInfo";
import CardStats from "./CardStats";
import type { ICard } from "../../../interfaces/card.interface";

const CardFullInfo = ({card} : {card: ICard | null}) => {
    return (  
      <Grid sx={{ display: "flex", flexDirection: "column", gap: 4, width: '100%', overflowY: "auto", maxWidth: "35rem",
        flex: { xs: "1 1 100%", md: "1 1 35rem" },
        minWidth: { xs: 0, md: 300 }
      }}>
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