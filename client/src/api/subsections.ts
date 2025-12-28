import { apiClient } from './client';
import { Subsection, CreateSubsectionDTO, UpdateSubsectionDTO } from '../types';

export const subsectionsApi = {
  getBySectionId: async (sectionId: number): Promise<Subsection[]> => {
    const { data } = await apiClient.get(`/api/subsections/section/${sectionId}`);
    return data;
  },

  create: async (subsection: CreateSubsectionDTO): Promise<Subsection> => {
    const { data } = await apiClient.post('/api/subsections', subsection);
    return data;
  },

  update: async (id: number, subsection: UpdateSubsectionDTO): Promise<Subsection> => {
    const { data } = await apiClient.put(`/api/subsections/${id}`, subsection);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/subsections/${id}`);
  },
};
