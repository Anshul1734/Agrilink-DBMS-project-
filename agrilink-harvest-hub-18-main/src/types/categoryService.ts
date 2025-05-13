// src/services/categoryService.ts
import { supabase } from "@/lib/supabaseClient";

export const fetchCategories = async () => {
  const { data, error } = await supabase.from("Category").select("*");

  if (error) {
    console.error("Error fetching categories:", error.message);
    return [];
  }

  return data;
};
