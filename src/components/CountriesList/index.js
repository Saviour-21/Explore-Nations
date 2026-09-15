import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Select, MenuItem, InputBase, IconButton, Chip } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  COLORS, FONT_SANS, eyebrowSx,
  circularIconButtonSx, textInputEditorialSx, pillTagSx,
} from "../../theme/natGeoTheme";

const SearchIcon = ({ color = COLORS.inkMuted }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CountriesList = ({ region = "all", onRegionChange = () => {} }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 15,
  });
  
  // Advanced Filter States
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("all");
  const [membership, setMembership] = useState("all");

  useEffect(() => {
    setPaginationModel((current) => ({ ...current, page: 0 }));
  }, [region]);

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["countries", paginationModel.page, paginationModel.pageSize, region, currency, membership],
    queryFn: async () => {
      // Base URL with Pagination and Payload Optimization (omitting heavy translations)
      let url = `https://api.restcountries.com/countries/v5?limit=${paginationModel.pageSize}&offset=${paginationModel.page * paginationModel.pageSize}&response_fields_omit=names.translations,borders`;
      
      // Dynamic Query Builders
      if (search) url += `&q=${encodeURIComponent(search)}`;
      if (region !== "all") url += `&region=${encodeURIComponent(region)}`;
      if (currency !== "all") url += `&currencies=${encodeURIComponent(currency)}`;
      
      if (membership === "eu") url += `&memberships.eu=1`;
      if (membership === "g7") url += `&memberships.g7=1`;
      if (membership === "un") url += `&memberships.un=1`;

      const response = await fetch(url, {
        headers: { Authorization: "Bearer rc_live_a8c20b36f410468aa46ac21db355d9a3" },
      });
      
      if (!response.ok) throw new Error("Network response was not ok");
      return (await response.json()).data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset to page 1 on new search
    refetch();
  };

  const columns = [
    {
      field: "flag",
      headerName: "Flag",
      width: 80,
      sortable: false,
      renderCell: (params) => {
        const countryCode = params.row.codes?.alpha_2?.toLowerCase();
        if (!countryCode) return <Typography variant="body2" sx={{ color: COLORS.inkFaint }}>N/A</Typography>;
        return (
          <Box display="flex" alignItems="center" height="100%">
            <img
              src={`https://flagcdn.com/16x12/${countryCode}.png`}
              srcSet={`https://flagcdn.com/32x24/${countryCode}.png 2x, https://flagcdn.com/48x36/${countryCode}.png 3x`}
              alt="Flag"
              style={{ width: "24px", height: "auto", borderRadius: "2px" }}
            />
          </Box>
        );
      },
    },
    {
      field: "countryName",
      headerName: "Country Name",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row.names?.common || "N/A",
    },
    {
      field: "capital",
      headerName: "Capital",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row.capitals?.[0]?.name || "N/A",
    },
    { field: "region", headerName: "Region", width: 130 },
    {
      field: "population",
      headerName: "Population",
      width: 140,
      type: "number",
      valueFormatter: (value) => new Intl.NumberFormat().format(value || 0),
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 160,
      valueGetter: (value, row) => {
        if (!row.currencies || row.currencies.length === 0) return "N/A";
        return `${row.currencies[0].name} (${row.currencies[0].symbol})`;
      },
    },
    {
      field: "memberships",
      headerName: "Memberships",
      width: 220,
      sortable: false,
      renderCell: (params) => {
        const m = params.row.memberships || {};
        return (
          <Box display="flex" gap={1} alignItems="center" height="100%">
            {m.eu && <Chip label="EU" size="small" sx={pillTagSx} />}
            {m.g7 && <Chip label="G7" size="small" sx={pillTagSx} />}
            {m.un && <Chip label="UN" size="small" sx={pillTagSx} />}
          </Box>
        );
      }
    }
  ];

  if (isError) return <Typography sx={{ color: COLORS.error, fontFamily: FONT_SANS }}>Error loading data.</Typography>;

  return (
    <Box sx={{ backgroundColor: COLORS.canvas, minHeight: "100vh", color: COLORS.ink, fontFamily: FONT_SANS }}>

      {/* Section Header */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 4, md: 5 }, borderBottom: `1px solid ${COLORS.hairline}` }}>
        <Typography sx={eyebrowSx}>Browse / Paged</Typography>
        <Typography sx={{ mt: 1.5, fontFamily: FONT_SANS, fontSize: { xs: 28, md: 40 }, fontWeight: 700, letterSpacing: "-0.5px" }}>
          Search the full database
        </Typography>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Typography sx={{ color: COLORS.inkMuted, fontSize: 15 }}>
            Server-paginated country records with dynamic filters.
          </Typography>
          <Chip label={`${data?.meta?.total ?? 0} records`} sx={pillTagSx} />
        </Box>
      </Box>

      {/* Advanced Filter Toolbar */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <form onSubmit={handleSearchSubmit}>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", border: `1px solid ${COLORS.hairline}` }}>
            <Box sx={{ flex: "1 1 260px", display: "flex", alignItems: "center", gap: 1, px: 2, py: 1, borderRight: { md: `1px solid ${COLORS.hairline}` } }}>
              <SearchIcon />
              <InputBase
                placeholder="Fuzzy search (Name, Capital, Code)..."
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
                onChange={(e) => { onRegionChange(e.target.value); setPaginationModel({ ...paginationModel, page: 0 }); }}
                sx={{ minWidth: 140, color: COLORS.ink, fontFamily: FONT_SANS, fontSize: 15, "& .MuiSvgIcon-root": { color: COLORS.inkMuted } }}
              >
                <MenuItem value="all">All Regions</MenuItem>
                <MenuItem value="Europe">Europe</MenuItem>
                <MenuItem value="Asia">Asia</MenuItem>
                <MenuItem value="Americas">Americas</MenuItem>
                <MenuItem value="Africa">Africa</MenuItem>
                <MenuItem value="Oceania">Oceania</MenuItem>
              </Select>
            </Box>

            <Box sx={{ px: 2, py: 1, borderRight: { md: `1px solid ${COLORS.hairline}` } }}>
              <Select
                variant="standard"
                disableUnderline
                value={currency}
                onChange={(e) => { setCurrency(e.target.value); setPaginationModel({ ...paginationModel, page: 0 }); }}
                sx={{ minWidth: 160, color: COLORS.ink, fontFamily: FONT_SANS, fontSize: 15, "& .MuiSvgIcon-root": { color: COLORS.inkMuted } }}
              >
                <MenuItem value="all">All Currencies</MenuItem>
                <MenuItem value="EUR">Euro (EUR)</MenuItem>
                <MenuItem value="USD">US Dollar (USD)</MenuItem>
                <MenuItem value="GBP">British Pound (GBP)</MenuItem>
              </Select>
            </Box>

            <Box sx={{ px: 2, py: 1, borderRight: { md: `1px solid ${COLORS.hairline}` } }}>
              <Select
                variant="standard"
                disableUnderline
                value={membership}
                onChange={(e) => { setMembership(e.target.value); setPaginationModel({ ...paginationModel, page: 0 }); }}
                sx={{ minWidth: 170, color: COLORS.ink, fontFamily: FONT_SANS, fontSize: 15, "& .MuiSvgIcon-root": { color: COLORS.inkMuted } }}
              >
                <MenuItem value="all">All Memberships</MenuItem>
                <MenuItem value="eu">EU Members</MenuItem>
                <MenuItem value="g7">G7 Members</MenuItem>
                <MenuItem value="un">UN Members</MenuItem>
              </Select>
            </Box>

            <Box sx={{ px: 2, py: 1, display: "flex", justifyContent: "center" }}>
              <IconButton type="submit" aria-label="Search" sx={circularIconButtonSx}>
                <SearchIcon color={COLORS.onPrimary} />
              </IconButton>
            </Box>
          </Box>
        </form>
      </Box>

      {/* DataGrid */}
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 8 }}>
        <Box sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={data?.objects ?? []}
            columns={columns}
            rowCount={data?.meta?.total ?? 0}
            loading={isFetching}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[15, 25, 50]}
            getRowId={(row) => row.uuid}
            disableRowSelectionOnClick
            sx={{
              border: `1px solid ${COLORS.hairline}`,
              borderRadius: 0,
              backgroundColor: "transparent",
              color: COLORS.ink,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: COLORS.canvas,
                color: COLORS.inkMuted,
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                borderBottom: `1px solid ${COLORS.hairline}`,
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: COLORS.canvas,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${COLORS.hairline}`,
                fontSize: "14px",
                fontWeight: 300,
                color: COLORS.ink,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: COLORS.canvasSoft,
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: `1px solid ${COLORS.hairline}`,
                backgroundColor: "transparent",
                color: COLORS.ink,
              },
              "& .MuiTablePagination-root, & .MuiTablePagination-selectIcon": {
                color: COLORS.ink,
              },
              "& .MuiCircularProgress-root": {
                color: COLORS.primary,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CountriesList;