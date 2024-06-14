import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://grnyepdqhnkpommddadd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdybnllcGRxaG5rcG9tbWRkYWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzODI2NzIsImV4cCI6MjAzMzk1ODY3Mn0.y2_BGGQAf1lWuIZyFjkGy_o8OqyNBZfz52zvB9G7RM8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
