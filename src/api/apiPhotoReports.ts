
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

type TServerResponsePhotoReport = {
  address: number
  comment: string
  date: string
  delivery_id: number
  id: number
  photo_download: string
  photo_view: string
  route_sheet_id: number
  user: {
    id: number
    last_name: string
    name: string
    phone: string
    photo: string
    photo_view: string
    surname: string
    tg_id: number
    tg_username: string
  }
}


export async function getPhotoReports(
  access: string
): Promise<TServerResponsePhotoReport[]> {
  try {
    const response: AxiosResponse<TServerResponsePhotoReport[]> = await axios({
      url: photoReportsUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`,
         accept: 'application/json',
      },
    });
      return response.data
    
  } catch (err:any) {
    console.error('Get request getPhotoReports has failed', err);
    throw new Error('Get request getPhotoReports has failed');
  }
};


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
    console.error('Post request postPhotoReport has failed', err);
    throw new Error('Post request postPhotoReport has failed');
  }
}




export type { TPhotoReport, TServerResponsePhotoReport };