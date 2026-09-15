import React from "react";
import { Box, Typography } from "@mui/material";
import { COLORS, FONT_SANS } from "../../theme/natGeoTheme";

// Renders the real image once `src` is supplied; otherwise shows the
// required dimensions so a real photo can be dropped in later.
const PlaceholderImage = ({ src, alt = "", label, width, height, sx }) => {
  if (src) {
    return (
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...sx }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
        border: `1px dashed ${COLORS.hairline}`,
        backgroundColor: COLORS.canvasSoft,
        ...sx,
      }}
    >
      <Typography sx={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: COLORS.inkMuted, textAlign: "center", px: 2 }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: FONT_SANS, fontSize: 12, color: COLORS.inkFaint }}>
        {width} × {height}px
      </Typography>
    </Box>
  );
};

export default PlaceholderImage;
