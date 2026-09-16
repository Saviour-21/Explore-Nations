import React from "react";
import { Box, Typography } from "@mui/material";
import heroImage from "../../assests/HeroImg.png";
import europeMap from "../../assests/Europe.png";
import americasMap from "../../assests/America.png";
import africaMap from "../../assests/Africa.png";
import asiaMap from "../../assests/Asia.png";
import overviewVideo from "../../assests/Overview.mp4";
import currencyMap from "../../assests/Currencies.png";
import PlaceholderImage from "../PlaceholderImage";
import { COLORS, FONT_SANS, FONT_SERIF, eyebrowSx } from "../../theme/natGeoTheme";

const FEATURES = [
  { title: "Live Country Data", body: "Every record is synced from the REST Countries API, covering 250+ countries across 90+ fields." },
  { title: "Fuzzy Search", body: "Find any nation by name, capital, or code in a single query — typos included." },
  { title: "Political Blocs", body: "Filter by region, currency, or membership in the EU, G7, and UN." },
];

const REGIONS = [
  { label: "Africa", src: africaMap, width: 640, height: 800 },
  { label: "Americas", src: americasMap, width: 640, height: 800 },
  { label: "Asia", src: asiaMap, width: 640, height: 800 },
  { label: "Europe", src: europeMap, width: 640, height: 800 },
];

const STATS = [
  { value: "250+", label: "Countries Indexed" },
  { value: "90+", label: "Data Fields" },
  { value: "4h", label: "Sync Cadence" },
];

const HomeSections = ({ onSelectRegion = () => {}, activeRegion = "all" }) => (
  <Box sx={{ backgroundColor: COLORS.canvas, color: COLORS.ink, fontFamily: FONT_SANS }}>

    {/* Hero */}
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 720, md: 920 },
        display: "flex",
        alignItems: "flex-end",
        px: { xs: 2, md: 4 },
        pb: { xs: 4, md: 6 },
        borderBottom: `1px solid ${COLORS.hairline}`,
        backgroundImage: `linear-gradient(180deg, rgba(5,5,5,0.25) 0%, rgba(5,5,5,0.9) 85%, ${COLORS.canvas} 100%), url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography sx={eyebrowSx}>Atlas / World Data</Typography>
        <Typography sx={{ mt: 2, fontFamily: FONT_SANS, fontSize: { xs: 48, md: 96 }, fontWeight: 700, lineHeight: 0.95, letterSpacing: "-1.5px" }}>
          Explore
        </Typography>
        <Typography sx={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: { xs: 36, md: 72 }, fontWeight: 400, lineHeight: 1.1 }}>
          Every Nation
        </Typography>

        <Box
          sx={{
            mt: { xs: 4, md: 6 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            borderTop: `1px solid ${COLORS.hairline}`,
            pt: 3,
          }}
        >
          {FEATURES.map((feature) => (
            <Box
              key={feature.title}
              sx={{
                p: 2.5,
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "transform 0.25s ease, border-color 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <Typography sx={{ fontSize: 15, color: COLORS.inkMuted, lineHeight: 1.6 }}>{feature.body}</Typography>
              <Typography sx={{ ...eyebrowSx, mt: 1.5, color: COLORS.primary }}>{feature.title} →</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>

    {/* Popular Regions */}
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 5, md: 7 }, borderBottom: `1px solid ${COLORS.hairline}` }}>
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5 }}>
        <Box>
          <Typography sx={eyebrowSx}>By Region</Typography>
          <Typography sx={{ mt: 1.5, fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: { xs: 28, md: 40 }, lineHeight: 1.2 }}>
            Four corners of the dataset
          </Typography>
        </Box>
        {activeRegion !== "all" && (
          <Typography
            component="button"
            onClick={() => onSelectRegion("all")}
            sx={{
              ...eyebrowSx,
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
              color: COLORS.primary,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Clear filter (Viewing {activeRegion}) ×
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 3,
        }}
      >
        {REGIONS.map((region) => {
          const isActive = activeRegion === region.label;
          return (
            <Box
              key={region.label}
              onClick={() => onSelectRegion(isActive ? "all" : region.label)}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              onKeyDown={(event) => { if (event.key === "Enter") onSelectRegion(isActive ? "all" : region.label); }}
              sx={{
                position: "relative",
                aspectRatio: "4 / 5",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                border: isActive ? `2px solid ${COLORS.primary}` : "2px solid transparent",
                opacity: !isActive && activeRegion !== "all" ? 0.5 : 1,
                transition: "opacity 0.2s ease, border-color 0.2s ease",
                "&:hover .region-card-image": { transform: "scale(1.05)" },
              }}
            >
              <Box
                className="region-card-image"
                sx={{ width: "100%", height: "100%", transition: "transform 0.5s ease" }}
              >
                <PlaceholderImage src={region.src} alt={`Illustrated map of ${region.label}`} label={region.label} width={region.width} height={region.height} sx={{ objectPosition: "top" }} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  p: 2,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 55%)",
                  pointerEvents: "none",
                }}
              >
                <Typography sx={{ fontSize: 15, fontWeight: isActive ? 700 : 600, color: "#fff" }}>
                  {region.label}{isActive ? " ✓" : ""}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>

    {/* Data Story / Stats */}
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 5, md: 7 } }}>
      <Typography sx={eyebrowSx}>Why It Matters</Typography>
      <Typography sx={{ mt: 1.5, fontFamily: FONT_SANS, fontSize: { xs: 32, md: 56 }, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-1px" }}>
        Data that
      </Typography>
      <Typography sx={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: { xs: 28, md: 48 }, lineHeight: 1.15 }}>
        tells a story
      </Typography>
      <Typography sx={{ mt: 2, maxWidth: 560, color: COLORS.inkMuted, fontSize: 15, lineHeight: 1.6 }}>
        Behind every border is a record of population, currency, and government. Search the full dataset below.
      </Typography>

      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: `1px solid ${COLORS.hairline}` }}>
          <Box sx={{ aspectRatio: "3 / 2" }}>
            <Box
              component="video"
              src={overviewVideo}
              autoPlay
              muted
              loop
              playsInline
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 2.5,
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 55%)",
              pointerEvents: "none",
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Regional Overview</Typography>
            <Typography sx={{ mt: 0.5, color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.5 }}>
              A quick tour of how countries are grouped by region, population, and land area.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: `1px solid ${COLORS.hairline}` }}>
          <Box sx={{ aspectRatio: "3 / 2" }}>
            <PlaceholderImage src={currencyMap} alt="World currencies" label="Currency Map" width={640} height={420} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 2.5,
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 55%)",
              pointerEvents: "none",
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Currencies</Typography>
            <Typography sx={{ mt: 0.5, color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.5 }}>
              Every nation's official currency, cross-referenced and filterable in the dataset below.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: { xs: "repeat(3, 1fr)" },
          borderTop: `1px solid ${COLORS.hairline}`,
        }}
      >
        {STATS.map((stat, index) => (
          <Box
            key={stat.label}
            sx={{
              py: 3,
              borderRight: index < STATS.length - 1 ? `1px solid ${COLORS.hairline}` : "none",
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 700, letterSpacing: "-1px" }}>{stat.value}</Typography>
            <Typography sx={{ ...eyebrowSx, mt: 0.5 }}>{stat.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default HomeSections;
