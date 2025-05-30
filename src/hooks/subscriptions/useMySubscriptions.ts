import { useEffect, useState } from "react"
import { fetchMySubscriptions } from "@/features/subscription/api/fetchMySubscriptions"
import type { MySubOutputDto } from "@/types/subscription"

export function useMySubscriptions() {
  const [subscriptions, setSubscriptions] = useState<MySubOutputDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    fetchMySubscriptions()
      .then((data) => {
        if (isMounted) setSubscriptions(data)
      })
      .catch((e) => {
        if (isMounted) setError(e.message)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return { subscriptions, loading, error }
}
