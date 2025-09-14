import type { ICard } from "../../../interfaces/card.interface";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chips from "../../molecules/Chips";
import Paper from "@mui/material/Paper";
import CardWrapper from "../../atoms/CardWrapper";
import { IconButton, useMediaQuery, TextField, InputAdornment } from "@mui/material";
import LaunchIcon from '@mui/icons-material/Launch';
import React, { useState, useMemo, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';

const CardListFromSet = ({cardsList, excludedCards} : {cardsList: ICard[], excludedCards: (ICard | null)[]}) => {
    // Check if width is greater than 1630px
    const isWideScreen = useMediaQuery('(min-width:1631px)');
    const [inputValue, setInputValue] = useState<string>(""); 
    const [filterText, setFilterText] = useState<string>("");
    
    // Handle input change with debounce effect
    useEffect(() => {
      // Only update filter after a delay of typing
      const handler = setTimeout(() => {
        setFilterText(inputValue);
      }, 200);
      
      return () => {
        clearTimeout(handler);
      };
    }, [inputValue]);
    
    // Create a set of excluded card numbers for faster lookups (O(1) instead of O(n))
    const excludedCardSet = useMemo(() => {
      const set = new Set<string>();
      excludedCards?.forEach(card => {
        if (card?.cardNumber) set.add(card.cardNumber);
      });
      return set;
    }, [excludedCards]);
    
    // First filter out excluded cards (this remains constant)
    const eligibleCards = useMemo(() => {
      return cardsList.filter(card => !excludedCardSet.has(card.cardNumber || ''));
    }, [cardsList, excludedCardSet]);
    
    // Apply search filter with memoization
    const displayedCards = useMemo(() => {
      // If no search term, return all eligible cards
      const trimmedSearch = filterText.trim();
      if (!trimmedSearch) {
        return eligibleCards;
      }
      
      // Apply search filter
      const search = trimmedSearch.toLowerCase();
      return eligibleCards.filter(card => 
        (card.name?.toLowerCase() || '').includes(search) ||
        (card.cardNumber?.toLowerCase() || '').includes(search) ||
        (card.rarities || []).some(rarity => (rarity || '').toLowerCase().includes(search))
      );
    }, [eligibleCards, filterText]);
    
    return ( 
      <Grid sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: '35rem', minWidth: '21rem', paddingBottom: 2,
        flex: { xs: "1 1 100%", md: "0 0 35rem" },
        width: { xs: "100%", md: "35rem" },
      }}>
        <Typography variant="h6">Other Cards from set</Typography>
        <TextField 
          label="Find cards"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
          id="card-filter"
          fullWidth
          margin="dense"
        />
        <Grid sx={{ 
          display: "flex",
          flexDirection: "column", 
          gap: 4, 
          width: '100%',
          paddingRight: 2,
          ...(isWideScreen && {
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 220px)',
          }),
        }}>
          {displayedCards.length === 0 && filterText.trim() !== "" ? (
            <Typography variant="body1" sx={{ textAlign: 'center', padding: 2 }}>
              No cards found matching your search.
            </Typography>
          ) : (
            displayedCards.map((card) => (
              <CardItem key={card.cardNumber} card={card} />
            ))
          )}
        </Grid>
      </Grid>
     );
};

// Separate card item component to prevent re-rendering all cards when one changes
// Use React.memo to prevent unnecessary re-renders
const CardItem = React.memo(({ card }: { card: ICard }) => {
  return (
    <Paper 
      elevation={6} 
      sx={{width: '100%', padding: 2, borderRadius: 3, gap: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <Grid
        sx={{width: '100%', borderRadius: 3, gap: 2, display: "flex", flexDirection: "row", justifyContent: "space-between" }}
      >
        <CardWrapper url={card?.imageUrl || undefined} name={card?.name || undefined} width={'6rem'}/>
        <Grid sx={{width: '100%', height: '100%'}}>
          <Grid sx={{width: '100%', justifyContent: 'flex-end', display: 'flex', alignItems: 'baseline'}}>
            <IconButton href={`/cards/${card.cardNumber}`} sx={{marginTop: '-10px', marginRight: '-10px'}}>
              <LaunchIcon />
            </IconButton>
          </Grid>
          <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "baseline", gap: 2 }}>
            <Typography variant="body2" component="p">Name:</Typography>
            <Typography variant="body1" component="p" fontWeight="bold" marginBottom={2} sx={{textWrap:'wrap', maxWidth: '12rem', textAlign: 'right'}}>{card?.name}</Typography>
          </Grid>
          <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "baseline",  }}>
            <Typography variant="body2" component="p">Set Code:</Typography>
            <Typography variant="body1" component="p" fontWeight="bold"  marginBottom={2}>{card?.cardNumber}</Typography>
          </Grid>
          <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "baseline",  }}>
            <Typography variant="body2" component="p">Quantity:</Typography>
            <Typography variant="body1" component="p" fontWeight="bold"  marginBottom={2}>{card?.count}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid sx={{width: '100%', height: '100%'}}>
        <Chips labels={card?.rarities || []} width={'100%'} />
      </Grid>
    </Paper>
  );
});
 
export default CardListFromSet;