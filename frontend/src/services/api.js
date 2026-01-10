const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchTokens(
  page = 1,
  timePeriod = "24h"
) {
  const res = await fetch(
    `${BASE_URL}/api/tokens?page=${page}&timePeriod=${timePeriod}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tokens");
  }

  return res.json();
}
