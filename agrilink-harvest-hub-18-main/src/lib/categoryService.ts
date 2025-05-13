import { supabase } from "@/lib/supabaseClient";

export const fetchCategories = async () => {
  const { data, error } = await supabase.from("Category").select("*");
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
};
