
import axios, { AxiosResponse } from 'axios';

//тут будет ссылка на файл с юрлом!
const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const photoReportsUrl = `${API_URL}/photo_reports/`;

type TPhotoReport = {
  photo: Blob | null
  route_sheet_id: number
  comment: string
  delivery_id: number
  address: number
  is_absent:boolean
}


export async function postPhotoReport(
  access: string,
  object:FormData
):Promise<TPhotoReport> {
  try {
    const response: AxiosResponse<TPhotoReport> = await axios({
      url: photoReportsUrl,
      method: 'POST',
      data: object,
      headers: {
        Authorization: `Bearer ${access}`,
         accept: 'application/json',
      },
    });
      return response.data
    
  } catch (err:any) {
    console.error('Get request postPhotoReport has failed', err);
    throw new Error('Get request postPhotoReport has failed');
  }
}

export type { TPhotoReport };