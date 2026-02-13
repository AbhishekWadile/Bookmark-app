"use client"

import { supabase } from "@/lib/supabase"

export default function Home() {

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard"
      }
    })

    if (error) {
      console.log("Login error:", error.message)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={login}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Login with Google
      </button>
    </div>
  )
}
