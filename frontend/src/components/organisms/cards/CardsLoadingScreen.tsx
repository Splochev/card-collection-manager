import { Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

const CardsLoadingScreen = () => {
    return ( 
      <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%", gap: 4}}>
        <Grid sx={{ display: "flex", flexDirection: "column", gap: 6, height: "100%", width: '100%', maxWidth: '25rem' }}>
          <Skeleton animation="wave" variant="rounded" sx={{ height: 580, width: '100%'}} />
          <Skeleton animation="wave" variant="rounded" sx={{ height: 140, width: '100%'}} />
        </Grid>
        <Grid sx={{ display: "flex", flexDirection: "column", gap: 6, height: "100%", width: '100%', maxWidth: '35rem' }}>
          <Skeleton variant="rounded" sx={{ height: 80, width: '100%'}} />
          <Skeleton variant="rounded" sx={{ height: 160, width: '100%'}} />
          <Skeleton variant="rounded" sx={{ height: 400, width: '100%'}} />
        </Grid>
        <Grid sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: '35rem', width: '100%', }}>
          <Typography variant="h6">Other Cards from set</Typography>
          <Grid sx={{ display: "flex", flexDirection: "column", gap: 4, width: '100%', overflowY: 'auto', paddingRight: 2 }}>
            {Array.from({ length: 4 }).map((_, index) => {
              return <Skeleton key={index} variant="rounded" sx={{maxWidth: '35rem', height: 175, width: '100%', maxHeight: 175}} />
            })}
          </Grid>
        </Grid>
      </Grid>
    );
}
 
export default CardsLoadingScreen;