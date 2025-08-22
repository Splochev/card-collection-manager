import { useNavigate } from "react-router-dom";
import type { ICard } from "../../../interfaces/card.interface";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chips from "../../atoms/Chips";
import Paper from "@mui/material/Paper";
import CardWrapper from "../../atoms/CardWrapper";

const CardListFromSet = ({cardsList, excludedCards} : {cardsList: ICard[], excludedCards: (ICard | null)[]}) => {
  const navigate = useNavigate();

    function handleCardClick(card: ICard) {
      navigate(`/cards/${card.cardNumber}`);
    }

    return ( 
      <Grid sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: '35rem', width: '100%', }}>
        <Typography variant="h6">Other Cards from set</Typography>
        <Grid sx={{ display: "flex", flexDirection: "column", gap: 4, width: '100%', overflowY: 'auto', paddingRight: 2 }}>
          {cardsList.map((card) => {
            if((excludedCards || []).some(excludedCard => excludedCard?.cardNumber === card.cardNumber)) return null;

            return (
              <Paper 
                key={card.cardNumber} 
                elevation={6} 
                onClick={(e) => {
                  const classList = ( e.target as HTMLButtonElement).classList;
                  if(!classList.length || classList.contains('MuiButtonBase-root') || classList.contains('MuiSvgIcon-root') || classList.contains('MuiTouchRipple-root')) {
                    return;
                  }

                  handleCardClick(card);
                }}
                sx={{width: '100%', padding: 2, borderRadius: 3, gap: 2, display: "flex", flexDirection: "row", justifyContent: "space-between", cursor: 'pointer' }}
              >
                <CardWrapper url={card?.cards?.imageUrl || undefined} name={card?.name || undefined} width={'6rem'}/>
                <Grid sx={{width: '100%', height: '100%'}}>
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