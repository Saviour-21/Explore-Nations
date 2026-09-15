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

const HomeSections = ({ onSelectRegion = () => {} }) => (
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
            <Box key={feature.title}>
              <Typography sx={{ fontSize: 15, color: COLORS.inkMuted, lineHeight: 1.6 }}>{feature.body}</Typography>
              <Typography sx={{ ...eyebrowSx, mt: 1.5, color: COLORS.primary }}>{feature.title} →</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>

    {/* Popular Regions */}
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 5, md: 7 }, borderBottom: `1px solid ${COLORS.hairline}` }}>
      <Typography sx={eyebrowSx}>By Region</Typography>
      <Typography sx={{ mt: 1.5, fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: { xs: 28, md: 40 }, lineHeight: 1.2 }}>
        Four corners of the dataset
      </Typography>

      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        {REGIONS.map((region) => (
          <Box
            key={region.label}
            onClick={() => onSelectRegion(region.label)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === "Enter") onSelectRegion(region.label); }}
            sx={{ cursor: "pointer", "&:hover .region-card-image": { opacity: 0.75 }, "&:hover .region-card-label": { color: COLORS.primary } }}
          >
            <Box className="region-card-image" sx={{ aspectRatio: "4 / 5", transition: "opacity 0.2s ease" }}>
              <PlaceholderImage src={region.src} alt={`Illustrated map of ${region.label}`} label={region.label} width={region.width} height={region.height} sx={{ objectPosition: "top" }} />
            </Box>
            <Typography className="region-card-label" sx={{ mt: 1.5, fontSize: 15, fontWeight: 500, transition: "color 0.2s ease" }}>{region.label}</Typography>
          </Box>
        ))}
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
          gap: { xs: 1.5, md: 2 },
        }}
      >
        <Box>
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
          <Typography sx={{ mt: 1.5, fontSize: 15, fontWeight: 500 }}>Regional Overview</Typography>
          <Typography sx={{ mt: 0.5, color: COLORS.inkMuted, fontSize: 13, lineHeight: 1.5 }}>
            A quick tour of how countries are grouped by region, population, and land area.
          </Typography>
        </Box>
        <Box>
          <Box sx={{ aspectRatio: "3 / 2" }}>
            <PlaceholderImage src={currencyMap} alt="World currencies" label="Currency Map" width={640} height={420} />
          </Box>
          <Typography sx={{ mt: 1.5, fontSize: 15, fontWeight: 500 }}>Currencies</Typography>
          <Typography sx={{ mt: 0.5, color: COLORS.inkMuted, fontSize: 13, lineHeight: 1.5 }}>
            Every nation's official currency, cross-referenced and filterable in the dataset below.
          </Typography>
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
