import { apiClient } from './client';
import { Section, CreateSectionDTO, UpdateSectionDTO } from '../types';

export const sectionsApi = {
  getAll: async (): Promise<Section[]> => {
    const { data } = await apiClient.get('/api/sections');
    return data;
  },

  getById: async (id: number): Promise<Section> => {
    const { data } = await apiClient.get(`/api/sections/${id}`);
    return data;
  },

  create: async (section: CreateSectionDTO): Promise<Section> => {
    const { data } = await apiClient.post('/api/sections', section);
    return data;
  },

  update: async (id: number, section: UpdateSectionDTO): Promise<Section> => {
    const { data } = await apiClient.put(`/api/sections/${id}`, section);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/sections/${id}`);
  },

  reorder: async (updates: Array<{ id: number; display_order: number }>): Promise<void> => {
    await apiClient.patch('/api/sections/reorder', { updates });
  },
};
