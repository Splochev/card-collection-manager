import type { ICard } from "../../../interfaces/card.interface";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chips from "../../molecules/Chips";
import Paper from "@mui/material/Paper";
import CardWrapper from "../../atoms/CardWrapper";
import { IconButton } from "@mui/material";
import LaunchIcon from '@mui/icons-material/Launch';

const CardListFromSet = ({cardsList, excludedCards} : {cardsList: ICard[], excludedCards: (ICard | null)[]}) => {

    return ( 
  <Grid sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: '35rem', minWidth: '21rem',
        // responsive sizing: full width on xs, fixed on md+
        flex: { xs: "1 1 100%", md: "0 0 35rem" },
        width: { xs: "100%", md: "35rem" },
      }}>
        <Typography variant="h6">Other Cards from set</Typography>
        <Grid sx={{ display: "flex", flexDirection: "column", gap: 4, width: '100%', overflowY: 'auto', paddingRight: 2 }}>
          {cardsList.map((card) => {
            if((excludedCards || []).some(excludedCard => excludedCard?.cardNumber === card.cardNumber)) return null;

            return (
              <Paper 
                key={card.cardNumber} 
                elevation={6} 
                sx={{width: '100%', padding: 2, borderRadius: 3, gap: 2, display: "flex", flexDirection: "row", justifyContent: "space-between" }}
              >
                <CardWrapper url={card?.cards?.imageUrl || undefined} name={card?.name || undefined} width={'6rem'}/>
                <Grid sx={{width: '100%', height: '100%'}}>
                  <Grid sx={{width: '100%', justifyContent: 'flex-end', display: 'flex'}}>
                    <IconButton href={`/cards/${card.cardNumber}`} sx={{marginTop: '-10px', marginRight: '-10px'}}>
                      <LaunchIcon />
                    </IconButton>
                  </Grid>
                  <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "baseline", gap: 2 }}>
                    <Typography variant="body2" component="p">Name:</Typography>
                    <Typography variant="body1" component="p" fontWeight="bold" marginBottom={2} sx={{textWrap:'wrap', maxWidth: '12rem', textAlign: 'right'}}>{card?.name}</Typography>
                  </Grid>
                  <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    <Typography variant="body2" component="p">Set Code:</Typography>
                    <Typography variant="body1" component="p" fontWeight="bold"  marginBottom={2}>{card?.cardNumber}</Typography>
                  </Grid>
                  <Chips labels={card?.rarities || []} width={'100%'} />
                </Grid>
              </Paper>
            );
          })}
        </Grid>
      </Grid>
     );
}
 
export default CardListFromSet;