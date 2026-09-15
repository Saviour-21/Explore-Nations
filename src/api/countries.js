const BASE_URL = "https://api.restcountries.com/countries/v5";

const buildHeaders = () => ({
  Authorization: `Bearer ${process.env.REACT_APP_RESTCOUNTRIES_TOKEN ?? ""}`,
});

/**
 * Fetches a server-paginated page of countries for the DataGrid view.
 */
export const fetchCountries = async ({ page, pageSize, search, region, currency, membership }) => {
  let url = `${BASE_URL}?limit=${pageSize}&offset=${page * pageSize}&response_fields_omit=names.translations,borders`;

  if (search) url += `&q=${encodeURIComponent(search)}`;
  if (region && region !== "all") url += `&region=${encodeURIComponent(region)}`;
  if (currency && currency !== "all") url += `&currencies=${encodeURIComponent(currency)}`;
  if (membership === "eu") url += `&memberships.eu=1`;
  if (membership === "g7") url += `&memberships.g7=1`;
  if (membership === "un") url += `&memberships.un=1`;

  const response = await fetch(url, { headers: buildHeaders() });
  if (!response.ok) throw new Error("Network response was not ok");
  return (await response.json()).data;
};

/**
 * Fetches a single offset-based page of countries for infinite scroll.
 */
export const fetchCountriesPage = async ({ pageParam, pageSize, search, region }) => {
  let url = `${BASE_URL}?limit=${pageSize}&offset=${pageParam}`;

  if (search) url += `&q=${encodeURIComponent(search)}`;
  if (region && region !== "all") url += `&region=${encodeURIComponent(region)}`;

  const response = await fetch(url, { headers: buildHeaders() });
  if (!response.ok) throw new Error("Network response was not ok");
  const json = await response.json();

  return {
    objects: json.data?.objects ?? [],
    total: json.data?.meta?.total ?? 0,
    offset: pageParam,
  };
};
