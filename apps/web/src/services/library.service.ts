import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishYear?: number;
  category: string;
  language: string;
  totalCopies: number;
  availableCopies: number;
  rackNumber?: string;
  price?: number;
  description?: string;
  coverImage?: string;
  status: 'available' | 'unavailable' | 'lost' | 'damaged';
  createdAt: string;
  updatedAt: string;
  _count?: {
    issues: number;
  };
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  renewedCount: number;
  fineAmount: number;
  status: 'issued' | 'returned' | 'overdue' | 'lost';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  book?: {
    id: string;
    title: string;
    author: string;
    isbn: string;
  };
  student?: {
    id: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishYear?: number;
  category: string;
  language: string;
  totalCopies: number;
  rackNumber?: string;
  price?: number;
  description?: string;
  coverImage?: string;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {
  availableCopies?: number;
  status?: 'available' | 'unavailable' | 'lost' | 'damaged';
}

export interface IssueBookDto {
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  remarks?: string;
}

export interface ReturnBookDto {
  returnDate: string;
  fineAmount?: number;
  remarks?: string;
}

export const libraryKeys = {
  all: ['library'] as const,
  books: () => [...libraryKeys.all, 'books'] as const,
  book: (filters: any) => [...libraryKeys.books(), filters] as const,
  issues: () => [...libraryKeys.all, 'issues'] as const,
  issue: (filters: any) => [...libraryKeys.issues(), filters] as const,
};

export function useBooks(filters?: any) {
  return useQuery({
    queryKey: libraryKeys.book(filters),
    queryFn: async () => {
      const response = await apiClient.get('/library/books', { params: filters });
      return response.data.data as Book[];
    },
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: [...libraryKeys.books(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/library/books/${id}`);
      return response.data.data as Book;
    },
    enabled: !!id,
  });
}

export function useBookIssues(filters?: any) {
  return useQuery({
    queryKey: libraryKeys.issue(filters),
    queryFn: async () => {
      const response = await apiClient.get('/library/issues', { params: filters });
      return response.data.data as BookIssue[];
    },
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookDto) => {
      const response = await apiClient.post('/library/books', data);
      return response.data.data as Book;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() });
      toast.success('Book added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add book');
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBookDto }) => {
      const response = await apiClient.patch(`/library/books/${id}`, data);
      return response.data.data as Book;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() });
      queryClient.invalidateQueries({ queryKey: [...libraryKeys.books(), data.id] });
      toast.success('Book updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update book');
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/library/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() });
      toast.success('Book deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    },
  });
}

export function useIssueBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IssueBookDto) => {
      const response = await apiClient.post('/library/issues', data);
      return response.data.data as BookIssue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() });
      queryClient.invalidateQueries({ queryKey: libraryKeys.issues() });
      toast.success('Book issued successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to issue book');
    },
  });
}

export function useReturnBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ issueId, data }: { issueId: string; data: ReturnBookDto }) => {
      const response = await apiClient.patch(`/library/issues/${issueId}/return`, data);
      return response.data.data as BookIssue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() });
      queryClient.invalidateQueries({ queryKey: libraryKeys.issues() });
      toast.success('Book returned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to return book');
    },
  });
}

export function useRenewBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      const response = await apiClient.patch(`/library/issues/${issueId}/renew`);
      return response.data.data as BookIssue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.issues() });
      toast.success('Book renewed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to renew book');
    },
  });
}
