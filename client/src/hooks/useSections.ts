import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sectionsApi } from '../api/sections';
import type { CreateSectionDTO, UpdateSectionDTO } from '../types';

export const useSections = () => {
  return useQuery({
    queryKey: ['sections'],
    queryFn: sectionsApi.getAll,
  });
};

export const useSection = (id: number) => {
  return useQuery({
    queryKey: ['sections', id],
    queryFn: () => sectionsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSectionDTO) => sectionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSectionDTO }) =>
      sectionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sectionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
};
