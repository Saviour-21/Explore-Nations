import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchCountryByName } from "../api/countries";
import { globalIllustrations } from "./GLOBAL_ILLUSTRATIONS";

// Standard world map TopoJSON
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Pastel, watercolor-inspired palette
const mapColors = ["#fca5a5", "#fef08a", "#a7f3d0", "#bae6fd", "#e9d5ff", "#fed7aa", "#fbcfe8"];
const inkColor = "#1c1917";
const borderColor = "#78716c";

const ignoreWheelZoom = (event) => event.type !== "wheel";


const CloudSVG = ({ color }) => (
  <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={color} d="M172.9,76.5c-1.9-22.5-20.7-39.9-43.8-39.9c-16,0-30.1,8.5-38.2,21.6c-5.4-11.2-17.1-18.9-30.6-18.9c-18.6,0-33.7,15.1-33.7,33.7c0,1.9,0.2,3.7,0.4,5.5C12.3,84.3,0,104.4,0,129.1c0,28,22.8,50.8,50.8,50.8h142.6c24.7,0,44.8-20.1,44.8-44.8C238.2,105.7,216,82.4,188.9,79.9C184.8,77.7,179,76.5,172.9,76.5z"/>
  </svg>
);

const DiscoveryMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [clickOrigin, setClickOrigin] = useState(null);
  const [isCloudExpanded, setIsCloudExpanded] = useState(false);

  const handleCountryClick = (geo, event) => {
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    
    setClickOrigin({ 
      x: event.clientX - viewportCenterX, 
      y: event.clientY - viewportCenterY 
    });
    
    setSelectedCountry(geo.properties.name);
    // Reset the cloud expansion state so the entrance animation can run
    setIsCloudExpanded(false); 
  };

  const handleClose = () => {
    // Only nullify the selected country. 
    // Do NOT set isCloudExpanded to false here, otherwise the card instantly vanishes.
    // Framer Motion handles the smooth exit of all components automatically.
    setSelectedCountry(null);
  };

  const { data: countryDetails, isFetching, isError } = useQuery({
    queryKey: ["countryDetails", selectedCountry],
    queryFn: () => fetchCountryByName(selectedCountry),
    enabled: !!selectedCountry,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100vh", backgroundColor: "#cdeafd", overflow: "hidden" }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Baloo+2:wght@700;800&display=swap');`}
      </style>

      {/* Header */}
      <Box sx={{ position: "absolute", top: 32, left: 0, right: 0, textAlign: "center", zIndex: 10, pointerEvents: "none" }}>
        <Typography sx={{ fontFamily: "'Caveat', cursive", fontSize: "2rem", fontWeight: 700, color: inkColor, lineHeight: 1 }}>A MAP OF</Typography>
        <Typography sx={{ fontFamily: "'Baloo 2', cursive", fontSize: { xs: "3rem", md: "4.5rem" }, fontWeight: 800, color: inkColor, letterSpacing: "1px", lineHeight: 1 }}>
          THE WORLD
        </Typography>
      </Box>

      <Typography sx={{ fontFamily: "'Caveat', cursive", fontSize: "1.35rem", fontWeight: 600, color: "black", width: "100%", bottom: 200, position: "absolute", textAlign: "center", pointerEvents: "none", zIndex: 10 }}>
        {hoveredCountry ? `You're looking at ${hoveredCountry}` : "Drag to pan and click to explore"}
      </Typography>

      {/* The Interactive Map */}
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }} style={{ width: "100%", height: "100%", outline: "none" }}>
        <ZoomableGroup maxZoom={5} filterZoomEvent={ignoreWheelZoom}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo, index) => {
                const isHovered = hoveredCountry === geo.properties.name;
                const isSelected = selectedCountry === geo.properties.name;
                const baseFill = mapColors[index % mapColors.length];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                    onMouseLeave={() => setHoveredCountry("")}
                    onClick={(event) => handleCountryClick(geo, event)}
                    fill={isSelected ? "#d6d3d1" : isHovered ? "#ffffff" : baseFill}
                    stroke={isHovered ? inkColor : borderColor}
                    strokeWidth={isHovered ? 1.5 : 0.6}
                    style={{ outline: "none", cursor: "pointer", transition: "fill 0.2s ease" }}
                  />
                );
              })
            }
          </Geographies>

          {/* Markers */}
          {globalIllustrations.map(({ name, coordinates, icon, label }) => (
            <Marker key={name} coordinates={coordinates}>
              <text textAnchor="middle" y={-10} style={{ fontSize: "13px", pointerEvents: "none" }}>{icon}</text>
              <text textAnchor="middle" y={6} style={{ fontFamily: "'Caveat', cursive", fontSize: "9px", fontWeight: 700, fill: inkColor, stroke: "#fef9f5", strokeWidth: 2.5, paintOrder: "stroke", pointerEvents: "none" }}>
                {label}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Layered Cloud Transition & Data Card */}
      <AnimatePresence>
        {selectedCountry && clickOrigin && (
          // FIX 1: Wrapper MUST be a motion.div for AnimatePresence to coordinate exits properly.
          // This keeps the DOM alive long enough for all clouds and cards to gracefully exit.
          <motion.div 
            key="overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 3.8, duration: 0.5 } }}
            style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: isCloudExpanded ? "auto" : "none" }}
          >
            
            {/* Cloud Layer 1: Sunset Yellow */}
            <motion.div
              initial={{ x: clickOrigin.x, y: clickOrigin.y, scale: 0, rotate: -45 }}
              animate={{ x: 0, y: 0, scale: 30, rotate: 0 }}
              exit={{ x: clickOrigin.x, y: clickOrigin.y, scale: 0, rotate: -45, opacity: 0 }}
              transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute" }}
            >
              <CloudSVG color="#fef08a" />
            </motion.div>

            {/* Cloud Layer 2: Sunset Pink */}
            <motion.div
              initial={{ x: clickOrigin.x, y: clickOrigin.y, scale: 0, rotate: 25 }}
              animate={{ x: 0, y: 0, scale: 30, rotate: 0 }}
              exit={{ x: clickOrigin.x, y: clickOrigin.y, scale: 0, rotate: 25, opacity: 0 }}
              transition={{ duration: 4.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute" }}
            >
              <CloudSVG color="#fbcfe8" />
            </motion.div>

            {/* Cloud Layer 3: Sky Blue */}
            <motion.div
              initial={{ x: clickOrigin.x, y: clickOrigin.y, scale: 0, rotate: -15 }}
              animate={{ x: 0, y: 0, scale: 30, rotate: 0 }}
              exit={{ x: clickOrigin.x, y: clickOrigin.y, scale: 0, rotate: -15, opacity: 0 }}
              transition={{ duration: 4.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute" }}
            >
              <CloudSVG color="#bae6fd" />
            </motion.div>

            {/* Cloud Layer 4: White (Top Layer) */}
            <motion.div
              initial={{ x: clickOrigin.x, y: clickOrigin.y, scale: 0, rotate: 10 }}
              animate={{ x: 0, y: 0, scale: 30, rotate: 0 }}
              exit={{ x: clickOrigin.x, y: clickOrigin.y, scale: 0, rotate: 10, opacity: 0 }}
              transition={{ duration: 4.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => setIsCloudExpanded(true)}
              style={{ position: "absolute" }}
            >
              <CloudSVG color="#ffffff" />
            </motion.div>

            {/* Fills the gap while the clouds are still expanding, before isCloudExpanded flips */}
            {!isCloudExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                style={{ position: "absolute", zIndex: 52, textAlign: "center", pointerEvents: "none" }}
              >
                <CircularProgress sx={{ color: "#7aa2f7", mb: 2 }} />
                <Typography sx={{ fontFamily: "'Caveat', cursive", fontSize: "2rem", color: inkColor }}>
                  Flying to {selectedCountry}... ✈️
                </Typography>
              </motion.div>
            )}

            {/* Foreground Card */}
            {isCloudExpanded && (
              <Box sx={{ position: "relative", zIndex: 51, pointerEvents: "auto" }}>
                
                {isFetching ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9 }} // FIX 2: Fast exit for loading state
                    style={{ textAlign: "center" }}
                  >
                    <CircularProgress sx={{ color: "#7aa2f7", mb: 2 }} />
                    <Typography sx={{ fontFamily: "'Caveat', cursive", fontSize: "2rem", color: inkColor }}>
                      Flying to {selectedCountry}... ✈️
                    </Typography>
                  </motion.div>
                ) : isError || !countryDetails ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }} // FIX 2: Fast exit for error state
                    style={{ textAlign: "center" }}
                  >
                    <Typography sx={{ fontFamily: "'Baloo 2', cursive", fontSize: "2rem", color: "#ef4444" }}>Oops!</Typography>
                    <Typography sx={{ fontFamily: "'Caveat', cursive", fontSize: "1.5rem", color: inkColor, mb: 2 }}>We got lost looking for {selectedCountry}.</Typography>
                    <IconButton onClick={handleClose} sx={{ backgroundColor: "#f5f5f4" }}>✕</IconButton>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 15, transition: { duration: 0.2 } }} // FIX 2: The Card immediately shrinks/fades away on close
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <Box sx={{ width: 340, borderRadius: "28px", backgroundColor: "#fff", padding: 3, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", border: "2px solid #e7e5e4" }}>
                      
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography sx={{ fontFamily: "'Caveat', cursive", fontSize: "1.2rem", fontWeight: 700, color: borderColor }}>
                          Passport Stamp
                        </Typography>
                        <IconButton size="small" onClick={handleClose} sx={{ backgroundColor: "#f5f5f4", "&:hover": { backgroundColor: "#e7e5e4" } }}>
                          ✕
                        </IconButton>
                      </Box>

                      {/* Flag Image */}
                      <Box sx={{ height: 180, borderRadius: 2, overflow: "hidden", backgroundColor: "#f5f5f4", mb: 2, border: "1px solid #e7e5e4" }}>
                        {countryDetails.codes?.alpha_2 && (
                          <img
                            src={`https://flagcdn.com/w320/${countryDetails.codes.alpha_2.toLowerCase()}.png`}
                            alt={`Flag of ${selectedCountry}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        )}
                      </Box>

                      <Typography sx={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: "1.8rem", color: inkColor, textAlign: "center", lineHeight: 1.1 }}>
                        {selectedCountry}
                      </Typography>

                      <Box sx={{ mt: 2, pt: 2, borderTop: "2px dashed #e7e5e4", fontFamily: "'Caveat', cursive", fontSize: "1.2rem", color: "#44403c" }}>
                        <Typography sx={{ fontFamily: "inherit", fontSize: "inherit", mb: 0.5 }}>🏛️ Capital: {countryDetails.capitals?.[0]?.name ?? "N/A"}</Typography>
                        <Typography sx={{ fontFamily: "inherit", fontSize: "inherit", mb: 0.5 }}>🌍 Region: {countryDetails.region ?? "N/A"}</Typography>
                        <Typography sx={{ fontFamily: "inherit", fontSize: "inherit", mb: 0.5 }}>👥 Population: {new Intl.NumberFormat().format(countryDetails.population ?? 0)}</Typography>
                        <Typography sx={{ fontFamily: "inherit", fontSize: "inherit" }}>💰 Currency: {countryDetails.currencies?.[0]?.name ?? "N/A"}</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                )}
              </Box>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default DiscoveryMap;