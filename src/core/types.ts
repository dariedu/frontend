export interface IUser {
  id: number
  tg_id: number
  tg_username: string
  email: string
  last_name: string
  name: string
  surname: string
  phone: string
  photo?: string | null
  photo_view?:string | null
  birthday: number
  is_adult: boolean
  volunteer_hour: number
  point: number
  rating: number | { id: number; level: string; hours_needed: number }
  city: { id: number; city: string } | null
  is_superuser: boolean
  is_staff: boolean
  is_confirmed:boolean
  metier?: string
  interests?: string
  university?: string|null
  consent_to_personal_data: boolean
}
