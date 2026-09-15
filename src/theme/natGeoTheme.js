// Shared design tokens for the NatGeo-inspired editorial theme.
export const COLORS = {
  primary: "#ffcc00",
  onPrimary: "#000000",
  canvas: "#050505",
  canvasSoft: "#111111",
  ink: "#ffffff",
  inkMuted: "#999999",
  inkFaint: "#555555",
  hairline: "rgba(255, 255, 255, 0.15)",
  hairlineStrong: "rgba(255, 255, 255, 0.3)",
  success: "#22c55e",
  error: "#ee1d36",
};

export const FONT_SANS = "Inter, system-ui, sans-serif";
export const FONT_SERIF = "'Playfair Display', Georgia, serif";

export const eyebrowSx = {
  fontFamily: FONT_SANS,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: COLORS.inkMuted,
};

// The signature empty-rectangle brand mark.
export const brandRectangleSx = {
  width: 16,
  height: 24,
  border: `2px solid ${COLORS.primary}`,
  backgroundColor: "transparent",
};

export const circularIconButtonSx = {
  width: 48,
  height: 48,
  minWidth: 48,
  borderRadius: "9999px",
  backgroundColor: COLORS.primary,
  color: COLORS.onPrimary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "none",
  "&:hover": { backgroundColor: COLORS.primary, opacity: 0.85, boxShadow: "none" },
  "&.Mui-disabled": { backgroundColor: COLORS.hairline, color: COLORS.inkFaint },
};

export const textInputEditorialSx = {
  backgroundColor: "transparent",
  borderRadius: 0,
  "& .MuiInputBase-input": { color: COLORS.ink, fontFamily: FONT_SANS, fontSize: 15, padding: "8px 0" },
  "& .MuiInput-underline:before": { borderBottomColor: COLORS.hairline },
  "& .MuiInput-underline:hover:before": { borderBottomColor: COLORS.hairlineStrong },
  "& .MuiInput-underline:after": { borderBottomColor: COLORS.primary },
  "& .MuiSvgIcon-root": { color: COLORS.inkMuted },
};

export const pillTagSx = {
  backgroundColor: COLORS.hairline,
  color: COLORS.ink,
  fontFamily: FONT_SANS,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 2,
  textTransform: "uppercase",
  borderRadius: "9999px",
  height: "auto",
  padding: "4px 8px",
};

export const tableHeaderCellSx = {
  backgroundColor: "transparent",
  color: COLORS.inkMuted,
  fontFamily: FONT_SANS,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 2,
  textTransform: "uppercase",
  borderBottom: `1px solid ${COLORS.hairline}`,
};

export const tableRowSx = {
  "& td": {
    borderBottom: `1px solid ${COLORS.hairline}`,
    color: COLORS.ink,
    fontFamily: FONT_SANS,
    fontSize: 14,
    fontWeight: 300,
    borderTop: "none",
  },
  "&:hover": { backgroundColor: `${COLORS.canvasSoft} !important` },
};
