import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { ICard } from "../../interfaces/card.interface";
import CardDescription from "./CardDescription";

const CardStats = ({ card }: { card: ICard | null }) => {
  const typeline = card?.cards?.typeline
    ? card.cards.typeline.map((t) => t.replace(/["{}]/g, " ")).join(" / ")
    : card?.cards?.type;
  const isMonster = card?.cards?.type?.includes("Monster");
  return (
    <Paper elevation={6} sx={{ padding: 2, borderRadius: 3, gap: 2, display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" component="p">Card stats</Typography>
      <Grid container spacing={2} justifyContent={"space-between"}>
        <Typography variant="body2" component="p">{typeline}</Typography>
        <Grid container spacing={2}>
          <Typography variant="body2" component="p">
            {card?.cards?.level ? (
              <span style={{ display: "flex", gap: 8 }}>
                <span>Level: {card.cards.level}</span>
                <span>Attribute: {card.cards.attribute}</span>
              </span>
            ) : (
              card?.cards?.race
            )}
          </Typography>
        </Grid>
      </Grid>
      <CardDescription desc={card?.cards?.desc || ""} />
      {isMonster && (
        <Grid container spacing={2} justifyContent={"end"}>
          <Typography variant="body2" component="p">
            <span style={{ display: "flex", gap: 8 }}>
              <span>ATK/ {card?.cards?.atk}</span>
              <span>DEF/ {card?.cards?.def}</span>
            </span>
          </Typography>
        </Grid>
      )}
    </Paper>
  );
};

export default CardStats;
