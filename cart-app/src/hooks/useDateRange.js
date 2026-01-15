import { useMemo } from "react";

export const useDateRange = (orders, days) => {
  return useMemo(() => {
    const now = new Date();
    return orders.filter((o) => {
      const date = new Date(o.createdAt);
      const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= days;
    });
  }, [orders, days]);
};
