"use client";

"use client";

import { useEffect, useState } from "react";
import { detectCurrency } from "@/lib/currency";

export function useLocaleCurrency() {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const localeCurrency = detectCurrency(navigator.language);
    if (localeCurrency === currency) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrency(localeCurrency);
  }, [currency]);

  return currency;
}
