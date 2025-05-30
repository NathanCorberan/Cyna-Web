import type { MySubApiResponse, MySubOutputDto } from "@/types/subscription"
import { getAllTokens } from "@/lib/utils"

const API_URL = import.meta.env.VITE_API_URL + "my-sub"

export async function fetchMySubscriptions(): Promise<MySubOutputDto[]> {
  // Adapte à ta méthode de récupération du token !
  const { token } = getAllTokens ? getAllTokens() : { token: "" }

  const res = await fetch(API_URL, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch subscriptions: ${res.status}`)
  }
  const data: MySubApiResponse = await res.json()
  return data.member
}
