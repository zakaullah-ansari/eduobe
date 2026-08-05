import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Document {
  id: string;
  title: string;
  category: 'policy' | 'procedure' | 'report' | 'manual' | 'form' | 'certificate' | 'other';
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  version: number;
  status: 'draft' | 'published' | 'archived' | 'obsolete';
  accessLevel: 'public' | 'internal' | 'restricted' | 'confidential';
  departmentId?: string;
  programId?: string;
  uploadedBy?: string;
  approvedBy?: string;
  approvedDate?: string;
  expiryDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  _count?: {
    versions: number;
    downloads: number;
  };
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  changeDescription?: string;
  uploadedBy?: string;
  uploadedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentDto {
  title: string;
  category: 'policy' | 'procedure' | 'report' | 'manual' | 'form' | 'certificate' | 'other';
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  accessLevel: 'public' | 'internal' | 'restricted' | 'confidential';
  departmentId?: string;
  programId?: string;
  uploadedBy?: string;
  expiryDate?: string;
  tags?: string[];
}

export interface UpdateDocumentDto extends Partial<CreateDocumentDto> {
  status?: 'draft' | 'published' | 'archived' | 'obsolete';
  approvedBy?: string;
  approvedDate?: string;
}

export interface CreateVersionDto {
  documentId: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  changeDescription?: string;
  uploadedBy?: string;
}

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: any) => [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
  versions: (documentId: string) => [...documentKeys.all, 'versions', documentId] as const,
};

export function useDocuments(filters?: any) {
  return useQuery({
    queryKey: documentKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/documents', { params: filters });
      return response.data.data as Document[];
    },
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/documents/${id}`);
      return response.data.data as Document;
    },
    enabled: !!id,
  });
}

export function useDocumentVersions(documentId: string) {
  return useQuery({
    queryKey: documentKeys.versions(documentId),
    queryFn: async () => {
      const response = await apiClient.get(`/documents/${documentId}/versions`);
      return response.data.data as DocumentVersion[];
    },
    enabled: !!documentId,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDocumentDto) => {
      const response = await apiClient.post('/documents', data);
      return response.data.data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      toast.success('Document uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDocumentDto }) => {
      const response = await apiClient.patch(`/documents/${id}`, data);
      return response.data.data as Document;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(data.id) });
      toast.success('Document updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update document');
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      toast.success('Document deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete document');
    },
  });
}

export function useCreateVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVersionDto) => {
      const response = await apiClient.post('/documents/versions', data);
      return response.data.data as DocumentVersion;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.versions(data.documentId) });
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(data.documentId) });
      toast.success('New version uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload version');
    },
  });
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.get(`/documents/${id}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document-${id}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('Document downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to download document');
    },
  });
}
