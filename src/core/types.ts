export interface IUser {
  id: number;
  name: string;
  last_name?: string;
  avatar?: string;
  role?: 'curator' | 'volunteer';
  rating?: {
    id: number;
    level: string;
    hours_needed: number;
  };
  point?: number;
  volunteer_hour?: number;
}
