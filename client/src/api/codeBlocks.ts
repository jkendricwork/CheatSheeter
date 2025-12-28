import { apiClient } from './client';
import { CodeBlock, CreateCodeBlockDTO, UpdateCodeBlockDTO } from '../types';

export const codeBlocksApi = {
  getBySubsectionId: async (subsectionId: number): Promise<CodeBlock[]> => {
    const { data } = await apiClient.get(`/api/code-blocks/subsection/${subsectionId}`);
    return data;
  },

  create: async (codeBlock: CreateCodeBlockDTO & { subsection_id: number }): Promise<CodeBlock> => {
    const { data } = await apiClient.post('/api/code-blocks', codeBlock);
    return data;
  },

  update: async (id: number, codeBlock: UpdateCodeBlockDTO): Promise<CodeBlock> => {
    const { data} = await apiClient.put(`/api/code-blocks/${id}`, codeBlock);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/code-blocks/${id}`);
  },
};
