import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Box, Typography, Select, MenuItem, InputBase, IconButton, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  COLORS, FONT_SANS, eyebrowSx,
  circularIconButtonSx, textInputEditorialSx, pillTagSx, tableHeaderCellSx, tableRowSx,
} from "../../theme/natGeoTheme";
import { fetchCountriesPage } from "../../api/countries";

const PAGE_SIZE = 15;

const SearchIcon = ({ color = COLORS.inkMuted }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const DownArrowIcon = ({ color = COLORS.onPrimary }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);

const headerCellStyle = { ...tableHeaderCellSx, backgroundColor: COLORS.canvas, zIndex: 10 };

const formatNumber = (value) => new Intl.NumberFormat().format(value || 0);

const CountriesListInfinite = ({ region = "all", onRegionChange = () => {} }) => {
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    // Adding search and region to the queryKey forces React Query to reset and refetch when they change
    queryKey: ["countries-infinite", PAGE_SIZE, search, region],
    queryFn: ({ pageParam }) => fetchCountriesPage({ pageParam, pageSize: PAGE_SIZE, search, region }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.objects.length;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const rows = useMemo(() => data?.pages.flatMap((page) => page.objects) ?? [], [data]);
  const totalRecords = data?.pages[0]?.total ?? 0;

  // Infinite Scroll Observer setup
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const observer = useRef(null);
  const hasNextPageRef = useRef(hasNextPage);
  const fetchNextPageRef = useRef(fetchNextPage);
  // Synchronous lock: prevents a second fetch from starting before the first
  // one settles, regardless of when React re-renders isFetchingNextPage.
  const isFetchingRef = useRef(false);

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    fetchNextPageRef.current = fetchNextPage;
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    isFetchingRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);

  // Set up the observer in an effect (not a ref callback) so scrollRef.current
  // is guaranteed to already be attached before it's used as the intersection root.
  useEffect(() => {
    const sentinelNode = sentinelRef.current;
    if (!sentinelNode) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        if (isFetchingRef.current || !hasNextPageRef.current) return;

        isFetchingRef.current = true;
        Promise.resolve(fetchNextPageRef.current()).finally(() => {
          isFetchingRef.current = false;
        });
      },
      { root: scrollRef.current, rootMargin: "100px" }
    );

    observer.current.observe(sentinelNode);

    return () => observer.current?.disconnect();
  }, []);

  if (isError) return <Typography sx={{ color: COLORS.error, fontFamily: FONT_SANS }}>Error loading data.</Typography>;

  return (
    <Box sx={{ backgroundColor: COLORS.canvas, minHeight: "100vh", color: COLORS.ink, fontFamily: FONT_SANS }}>

      {/* Masthead */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 4, md: 5 }, borderBottom: `1px solid ${COLORS.hairline}` }}>
        <Typography sx={eyebrowSx}>Browse / Infinite Scroll</Typography>
        <Typography sx={{ mt: 1.5, fontFamily: FONT_SANS, fontSize: { xs: 28, md: 40 }, fontWeight: 700, letterSpacing: "-0.5px" }}>
          Scroll the full database
        </Typography>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Typography sx={{ color: COLORS.inkMuted, fontSize: 15 }}>
            Infinite scrolling country database optimized for large payloads.
          </Typography>
          <Chip label={`${totalRecords} records`} sx={pillTagSx} />
        </Box>
      </Box>

      {/* Filter Toolbar */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", border: `1px solid ${COLORS.hairline}` }}>
          <Box sx={{ flex: "1 1 260px", display: "flex", alignItems: "center", gap: 1, px: 2, py: 1, borderRight: { md: `1px solid ${COLORS.hairline}` } }}>
            <SearchIcon />
            <InputBase
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={textInputEditorialSx}
            />
          </Box>

          <Box sx={{ px: 2, py: 1, borderRight: { md: `1px solid ${COLORS.hairline}` } }}>
            <Select
              variant="standard"
              disableUnderline
              value={region}
              onChange={(e) => onRegionChange(e.target.value)}
              sx={{ minWidth: 160, color: COLORS.ink, fontFamily: FONT_SANS, fontSize: 15, "& .MuiSvgIcon-root": { color: COLORS.inkMuted } }}
            >
              <MenuItem value="all">All Regions</MenuItem>
              <MenuItem value="Europe">Europe</MenuItem>
              <MenuItem value="Asia">Asia</MenuItem>
              <MenuItem value="Americas">Americas</MenuItem>
              <MenuItem value="Africa">Africa</MenuItem>
              <MenuItem value="Oceania">Oceania</MenuItem>
            </Select>
          </Box>

          <Box sx={{ px: 2, py: 1, display: "flex", justifyContent: "center" }}>
            <IconButton aria-label="Search" sx={circularIconButtonSx}>
              <SearchIcon color={COLORS.onPrimary} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Data Table */}
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 8 }}>
        <Box ref={scrollRef} sx={{ height: 650, overflowY: "auto", border: `1px solid ${COLORS.hairline}` }}>
          <TableContainer sx={{ border: "none" }}>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellStyle}>Flag</TableCell>
                  <TableCell sx={headerCellStyle}>Country Name</TableCell>
                  <TableCell sx={headerCellStyle}>Capital</TableCell>
                  <TableCell sx={headerCellStyle}>Region</TableCell>
                  <TableCell sx={headerCellStyle} align="right">Population</TableCell>
                  <TableCell sx={headerCellStyle} align="right">Area (km²)</TableCell>
                  <TableCell sx={headerCellStyle}>Currency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={row.uuid ?? row.codes?.alpha_3 ?? index}
                    hover
                    sx={tableRowSx}
                  >
                    <TableCell sx={{ width: 80 }}>
                      {(() => {
                        const countryCode = row.codes?.alpha_2?.toLowerCase();
                        if (!countryCode) return "N/A";
                        return (
                          <img
                            src={`https://flagcdn.com/16x12/${countryCode}.png`}
                            srcSet={`https://flagcdn.com/32x24/${countryCode}.png 2x, https://flagcdn.com/48x36/${countryCode}.png 3x`}
                            alt="Flag"
                            style={{ width: "24px", height: "auto" }}
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell>{row.names?.common || "N/A"}</TableCell>
                    <TableCell>{row.capitals?.[0]?.name || "N/A"}</TableCell>
                    <TableCell>{row.region}</TableCell>
                    <TableCell align="right">{formatNumber(row.population)}</TableCell>
                    <TableCell align="right">{formatNumber(row.area?.kilometers)}</TableCell>
                    <TableCell>
                      {row.currencies?.length ? `${row.currencies[0].name} (${row.currencies[0].symbol})` : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Infinite Scroll Sentinel / Loading Indicator */}
          <Box ref={sentinelRef} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 4 }}>
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: COLORS.primary }} />
            ) : isFetchingNextPage ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} sx={{ color: COLORS.primary }} />
                <Typography sx={{ color: COLORS.inkMuted, fontSize: 13 }}>Loading more...</Typography>
              </Box>
            ) : hasNextPage ? (
              <IconButton aria-label="Load more countries" onClick={() => fetchNextPage()} sx={circularIconButtonSx}>
                <DownArrowIcon />
              </IconButton>
            ) : rows.length > 0 ? (
              <Typography sx={{ ...eyebrowSx, color: COLORS.success }}>All countries loaded</Typography>
            ) : (
              <Typography sx={{ color: COLORS.inkFaint, fontSize: 13 }}>No results found.</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CountriesListInfinite;
