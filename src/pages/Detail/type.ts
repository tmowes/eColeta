export interface RouteParams {
  point_id: number
}
export interface Details {
  point: {
    image: string
    image_url: string
    name: string
    whatsapp: string
    email: string
    city: string
    uf: string
  }
  items: {
    title: string
  }[]
}
