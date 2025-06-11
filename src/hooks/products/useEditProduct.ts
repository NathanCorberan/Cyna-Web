import { useState } from "react"
import { editProduits } from "@/features/products/api/editProduct"
import { getAllTokens } from "@/lib/utils"
import type { CreateProduitInput } from "@/types/Product"

export function useEditProduit() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const edit = async (id: number, data: CreateProduitInput) => {
    setLoading(true)
    setError(null)

    const { token } = getAllTokens()
    if (!token) {
      setError("Token absent, veuillez vous reconnecter.")
      setLoading(false)
      throw new Error("Token absent")
    }

    try {
      const result = await editProduits(id, data, token)
      setLoading(false)
      return result
    } catch (e: any) {
      setError(e.message || "Erreur inconnue")
      setLoading(false)
      throw e
    }
  }

  return { edit, loading, error }
}
