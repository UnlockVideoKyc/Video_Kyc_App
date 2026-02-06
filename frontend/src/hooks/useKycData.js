import { useEffect, useState } from "react";
import { getLiveSchedule, getMissedCalls, searchKyc } from "../api/videoKycWaitlist.api";

export const useKycData = (activeView, searchQuery) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;

      if (searchQuery) {
        response = await searchKyc(searchQuery);
        setCustomers(response.data || []);
      } else if (activeView === "live") {
        response = await getLiveSchedule();
        setCustomers(response.data || []);
      } else {
        response = await getMissedCalls();
        setCustomers(response.data || []);
      }
    } catch (err) {
      console.error(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeView, searchQuery]);

  return { customers, loading, refresh: fetchData };
};
