import axios, { type AxiosResponse } from 'axios';
import type { Note, NewNote } from '../types/note';

export interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  signal?: AbortSignal;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export const hasToken = Boolean(import.meta.env.VITE_NOTEHUB_TOKEN?.trim());
const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: { Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}` },
});
export async function fetchNotes({
  page,
  perPage = 12,
  search = '',
  signal,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await api.get('/notes', {
    params: { page, perPage, search },
    signal,
  });
  return response.data;
}
export async function createNote(note: NewNote): Promise<Note> {
  const response: AxiosResponse<Note> = await api.post('/notes', note);
  return response.data;
}
export async function deleteNote(id: Note['id']): Promise<Note> {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return response.data;
}
