import { useState, useMemo, useCallback } from "react";

interface UseSearchOptions<T> {
  data: T[];
  searchKeys: (keyof T)[];
}

export function useSearch<T>({ data, searchKeys }: UseSearchOptions<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === "string") {
          return value.toLowerCase().includes(query);
        }
        if (Array.isArray(value)) {
          return value.some((v) => 
            typeof v === "string" && v.toLowerCase().includes(query)
          );
        }
        return false;
      })
    );
  }, [data, searchQuery, searchKeys]);

  const clearSearch = useCallback(() => setSearchQuery(""), []);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    clearSearch,
    hasResults: filteredData.length > 0,
    resultCount: filteredData.length,
  };
}
