export async function editProduits(
  id: number,
  data: {
    name: string
    description: string
    lang: string
    status: string
    available_stock: number
    category_id: number
    imageFile?: File[] | null
    subscriptionTypes?: { type: string; price: string }[]
  },
  token: string
) {
  const formData = new FormData()

  formData.append('name', data.name)
  formData.append('description', data.description)
  formData.append('lang', data.lang)
  formData.append('status', data.status)
  formData.append('available_stock', data.available_stock.toString())
  formData.append('category_id', data.category_id.toString())

  if (data.imageFile && data.imageFile.length > 0) {
    data.imageFile.forEach(file => {
      formData.append('imageFile[]', file)
    })
  }

  if (data.subscriptionTypes) {
    formData.append('subscriptionTypes', JSON.stringify(data.subscriptionTypes))
  }

  const response = await fetch(`http://srv839278.hstgr.cloud:8000/api/products/${id}/update`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Ne pas mettre 'Content-Type' car fetch le gère avec FormData
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erreur lors de la mise à jour du produit : ${errorText}`)
  }

  return response.json()
}
