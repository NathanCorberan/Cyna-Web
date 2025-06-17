export async function createCarousel(
  data: {
    title: string;
    description: string;
    code: string;
    panel_order: number;
    imageFile?: File | null;
  },
  token: string
) {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('code', data.code);
  formData.append('panel_order', data.panel_order.toString());

  if (data.imageFile) {
    formData.append('imageFile', data.imageFile);
  }

  const response = await fetch('http://srv839278.hstgr.cloud:8000/api/carousels', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur lors de la création du carousel : ${errorText}`);
  }

  return response.json();
}
