import { useState, useEffect } from "react";
import axios from "axios";

export default function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${baseUrl}${endpoint}`, { withCredentials: true });
        setData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          window.location.href = err.response.data.redirect;
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}