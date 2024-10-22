export interface IUser {
  id: number;
  tg_id: number;
  tg_username?: string | null;
  email?: string | null;
  last_name?: string | null;
  name?: string | null;
  surname?: string | null;
  phone?: string | null;
  photo?: string | null;
  avatar?: string;
  birthday?: number | null;
  is_adult: boolean;
  volunteer_hour: number;
  point: number | null;
  rating: number | { id: number; level: string; hours_needed: number };
  city?: { id: number; city: string } | null;
  is_superuser?: boolean;
  is_staff?: boolean;
  metier?: string | null;
  interests?: string | null;
  consent_to_personal_data?: boolean;
}
