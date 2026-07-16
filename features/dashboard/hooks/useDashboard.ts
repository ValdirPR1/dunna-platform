"use client";

import { useEffect, useState } from "react";

import { carregarDashboard } from "../services/dashboard.service";

export function useDashboard() {

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<any>();

  useEffect(() => {

    carregarDashboard()

      .then(setData)

      .finally(() => setLoading(false));

  }, []);

  return {

    loading,

    data,

  };

}