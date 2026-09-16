import { useRef, useState } from 'react';
import './App.css';
import CountriesList from './components/CountriesList';
import CountriesListInfinite from './components/CountriesListInfinite';
import HomeSections from './components/HomeSections';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { COLORS, FONT_SANS } from "./theme/natGeoTheme";
import DiscoveryMap from './components/DiscoveryMap';

function App() {
  const queryClient = new QueryClient();
  const [view, setView] = useState("paged");
  const [region, setRegion] = useState("all");
  const dataSectionRef = useRef(null);

  const handleSelectRegion = (nextRegion) => {
    setRegion(nextRegion);
    // Region cards only make sense on the list views — hop off the map so the filtered results are visible.
    setView((currentView) => (currentView === "map" ? "paged" : currentView));
    dataSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <HomeSections onSelectRegion={handleSelectRegion} activeRegion={region} />
        <Box
          ref={dataSectionRef}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            display: "flex",
            justifyContent: "flex-end",
            px: { xs: 2, md: 4 },
            py: 1.5,
            backgroundColor: COLORS.canvas,
            borderBottom: `1px solid ${COLORS.hairline}`,
          }}
        >
          <ToggleButtonGroup
            size="small"
            exclusive
            value={view}
            onChange={(event, newValue) => newValue && setView(newValue)}
            sx={{
              "& .MuiToggleButton-root": {
                fontFamily: FONT_SANS,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: COLORS.inkMuted,
                border: "none",
                borderRadius: 0,
                px: 2,
                "&:not(:last-of-type)": { borderRight: `1px solid ${COLORS.hairline}` },
              },
              "& .MuiToggleButton-root.Mui-selected": {
                color: COLORS.primary,
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
              },
            }}
          >
            <ToggleButton value="paged">Paged</ToggleButton>
            <ToggleButton value="infinite">Infinite Scroll</ToggleButton>
            <ToggleButton value="map">Map</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {view === "paged" && (
          <CountriesList region={region} onRegionChange={setRegion} />
        )}
        {view === "infinite" && (
          <CountriesListInfinite region={region} onRegionChange={setRegion} />
        )}
        {view === "map" && (
          <Box sx={{ position: "relative", width: "100vw", height: "100vh" }}>
            <DiscoveryMap />
          </Box>
        )}
      </QueryClientProvider>
    </div>
  );
}

export default App;
