import { useEffect, useState } from "react"

export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "manager" | "customer"
  status: "active" | "inactive" | "blocked"
  orders: number
}

export const useAllUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // simulate fetch delay
      await new Promise((res) => setTimeout(res, 500))

      // mocked data
      setUsers([
        { id: 1, name: "Jean Dupont", email: "jean.dupont@example.com", role: "admin", status: "active", orders: 12 },
        { id: 2, name: "Marie Martin", email: "marie.martin@example.com", role: "customer", status: "active", orders: 5 },
        { id: 3, name: "Pierre Durand", email: "pierre.durand@example.com", role: "customer", status: "active", orders: 8 },
        { id: 4, name: "Sophie Petit", email: "sophie.petit@example.com", role: "customer", status: "inactive", orders: 3 },
        { id: 5, name: "Lucas Bernard", email: "lucas.bernard@example.com", role: "manager", status: "active", orders: 0 },
        { id: 6, name: "Emma Leroy", email: "emma.leroy@example.com", role: "customer", status: "active", orders: 7 },
        { id: 7, name: "Thomas Moreau", email: "thomas.moreau@example.com", role: "customer", status: "inactive", orders: 2 },
      ])

      setError(null)
    } catch (e) {
      setError("Erreur lors du chargement.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return { users, loading, error, refetch: fetchUsers }
}
