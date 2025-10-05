import { Grid, Typography, Button, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Chips from "../../molecules/Chips";
import type { ICard } from "../../../interfaces/card.interface";
import { getCardmarketUrl } from "../../../utils";

const CardInfoHeader = ({ card }: { card: ICard | null }) => {
  return (
    <Grid width={"100%"}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        marginBottom: 1, 
        gap: 2,
        flexWrap: "wrap",
      }}>
        <Typography variant="h5" sx={{ textWrap: "wrap", flex: 1, minWidth: "200px" }}>
          {card?.name}
        </Typography>
        {card?.cardSetName && card?.name && (
          <Button
            component="a"
            href={getCardmarketUrl(card.cardSetName, card.name, card.cardNumber, card.rarities)}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
            startIcon={<ShoppingCartIcon />}
            sx={{ 
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            View on Cardmarket
          </Button>
        )}
      </Box>
      <Chips labels={card?.rarities || []} />
    </Grid>
  );
};

export default CardInfoHeader;
