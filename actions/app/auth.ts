"use server"

import { createClient } from '@/lib/supabase/server'
import { redirect } from "next/navigation"

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.error("User not found, redirecting to login");
    redirect("/login");
  }

  return user;
}
