"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {

  const [user, setUser] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      router.push("/")
    } else {
      setUser(data.user)
      fetchBookmarks()
    }
  }

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      setBookmarks(data)
    }
  }

  const addBookmark = async () => {
    if (!title || !url) return

    const { error } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: user.id
      })

    if (!error) {
      setTitle("")
      setUrl("")
      fetchBookmarks()
    }
  }

  const deleteBookmark = async (id) => {
    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)

    fetchBookmarks()
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="">
      <div className="flex justify-between mb-6 h-[10vh] items-center px-[5vh] bg-gray-200">
        <h1 className="text-2xl">My Bookmarks</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border w-[20%] rounded-4xl p-2"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="border w-[40%] rounded-4xl p-2"
        />
        <button
          onClick={addBookmark}
          className="bg-black rounded-4xl w-[10%] hover:cursor-pointer text-white px-4"
        >
          Add
        </button>
      </div>

      {bookmarks.map((b) => (
        <div className="flex justify-center items-center">

          <div
            key={b.id}
            className="flex w-[90vw] justify-between border rounded-3xl p-2 px-[20px] mb-2"
          >
            <a href={b.url} target="_blank">
              {b.title}
            </a>
            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
