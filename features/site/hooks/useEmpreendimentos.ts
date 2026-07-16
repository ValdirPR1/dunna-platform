"use client";

import { useEffect, useState } from "react";
import { getFeaturedProperties } from "../services/imoveis.service";

export function useProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getFeaturedProperties();
      setProperties(data);
      setLoading(false);
    }

    load();
  }, []);

  return {
    properties,
    loading,
  };
}