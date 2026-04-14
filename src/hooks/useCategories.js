import { useEffect, useState, useCallback } from "react";

import { getAllCategories } from "@/lib/data/category";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      if (res?.success) {
        setCategories(res.categories || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, refreshCategories: fetchCategories };
};

export default useCategories;
