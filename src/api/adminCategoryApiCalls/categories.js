import { useQuery } from "@tanstack/react-query";

export const useAllCategoryAdmin = ({
  key,
  endpoint,
  select,
  enabled = true,
  staleTime = 5 * 60 * 1000,
  cacheTime = 10 * 60 * 1000,
}) => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/${endpoint}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch data");
      return json.data.data;
    },
    select,
    staleTime,
    cacheTime,
    enabled,
  });
};
export const useSingleCategoryAdmin = ({
  id,
  key = "single-category",
  select,
  enabled = true,
  staleTime = 5 * 60 * 1000,
  cacheTime = 10 * 60 * 1000,
}) => {
  return useQuery({
    queryKey: [key, id],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:8000/api/category/single/${id}`
      );
      const json = await res.json();
      console.log(json.data.data, "single category"); // match your working useEffect
      if (!res.ok) throw new Error(json.message || "Failed to fetch data");
      return json.data.data;
    },
    select,
    staleTime,
    cacheTime,
    enabled: !!id && enabled, // ensures id exists
  });
};

 
