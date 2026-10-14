const BASE_URL =
  "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest";

const getExternalOptions = async (source_id) => {
  const endpoint = {
    1: "province.json",
    2: "district.json",
  }[source_id];

  if (!endpoint) return [];

  const response = await fetch(`${BASE_URL}/${endpoint}`);

  if (!response.ok) {
    throw new Error("Failed to fetch external options");
  }

  const data = await response.json();

  return data
    .map((item) => {
      const name_th =
        typeof item.name === "object"
          ? `${item.prefix?.th || ""}${item.name?.th || ""}`
          : item.name_th;

      const name_en =
        typeof item.name === "object"
          ? [item.prefix?.en, item.name?.en].filter(Boolean).join(" ")
          : item.name_en;

      return {
        id: item.id,
        name_th,
        name_en,
        province_id: item.province_id ?? null,
        option: name_th,
      };
    })
    .sort((a, b) => a.name_th.localeCompare(b.name_th, "th"));
};

const externalService = {
  getExternalOptions,
};

export default externalService;
