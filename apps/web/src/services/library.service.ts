import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Book {
  id: string;
  bookNumber: string;
  isbn?: string;
  title: string;
  author: string;
  publisher?: string;
  publicationYear?: number;
  category: string;
  language?: string;
  totalCopies: number;
  availableCopies: number;
  rackNumber?: string;
  price?: number;
  status: 'available' | 'unavailable' | 'lost' | 'damaged';
  description?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { issues: number; reservations: number };
}

export interface BookIssue {
  id: string;
  issueNumber: string;
  bookId: string;
  studentId: string;
  issuedDate: string;
  dueDate: string;
  returnedDate?: string;
  renewedCount: number;
  maxRenewals: number;
  status: 'issued' | 'returned' | 'overdue' | 'lost';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  book?: { id: string; bookNumber: string; title: string; author: string };
  student?: { id: string; firstName: string; lastName: string; rollNumber: string; program?: { id: string; name: string } };
  _count?: { fines: number };
}

export interface Fine {
  id: string;
  fineNumber: string;
  issueId: string;
  studentId: string;
  fineType: 'overdue' | 'lost' | 'damaged' | 'other';
  amount: number;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'cash' | 'online' | 'bank_transfer';
  transactionId?: string;
  status: 'pending' | 'paid' | 'waived';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  issue?: { id: string; issueNumber: string; book?: { id: string; title: string } };
  student?: { id: string; firstName: string; lastName: string; rollNumber: string };
}

export interface BookReservation {
  id: string;
  reservationNumber: string;
  bookId: string;
  studentId: string;
  reservedDate: string;
  expiryDate: string;
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  book?: { id: string; bookNumber: string; title: string; author: string };
  student?: { id: string; firstName: string; lastName: string; rollNumber: string };
}

export interface CreateBookDto {
  isbn?: string;
  title: string;
  author: string;
  publisher?: string;
  publicationYear?: number;
  category: string;
  language?: string;
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
  dueDate: string;
  maxRenewals?: number;
  remarks?: string;
}

export interface ReturnBookDto {
  returnedDate: string;
  remarks?: string;
}

export interface CreateFineDto {
  issueId: string;
  studentId: string;
  fineType: 'overdue' | 'lost' | 'damaged' | 'other';
  amount: number;
  dueDate: string;
  remarks?: string;
}

export interface UpdateFineDto extends Partial<CreateFineDto> {
  paidDate?: string;
  paymentMethod?: 'cash' | 'online' | 'bank_transfer';
  transactionId?: string;
  status?: 'pending' | 'paid' | 'waived';
}

export interface CreateReservationDto {
  bookId: string;
  studentId: string;
  expiryDate: string;
  remarks?: string;
}

export interface UpdateReservationDto extends Partial<CreateReservationDto> {
  status?: 'active' | 'fulfilled' | 'expired' | 'cancelled';
}

export const libraryKeys = {
  all: ['library'] as const,
  books: () => [...libraryKeys.all, 'books'] as const,
  book: (filters: any) => [...libraryKeys.books(), filters] as const,
  issues: () => [...libraryKeys.all, 'issues'] as const,
  issue: (filters: any) => [...libraryKeys.issues(), filters] as const,
  fines: () => [...libraryKeys.all, 'fines'] as const,
  fine: (filters: any) => [...libraryKeys.fines(), filters] as const,
  reservations: () => [...libraryKeys.all, 'reservations'] as const,
  reservation: (filters: any) => [...libraryKeys.reservations(), filters] as const,
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

export function useFines(filters?: any) {
  return useQuery({
    queryKey: libraryKeys.fine(filters),
    queryFn: async () => {
      const response = await apiClient.get('/library/fines', { params: filters });
      return response.data.data as Fine[];
    },
  });
}

export function useBookReservations(filters?: any) {
  return useQuery({
    queryKey: libraryKeys.reservation(filters),
    queryFn: async () => {
      const response = await apiClient.get('/library/reservations', { params: filters });
      return response.data.data as BookReservation[];
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
      queryClient.invalidateQueries({ queryKey: libraryKeys.issues() });
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() });
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
    mutationFn: async ({ id, data }: { id: string; data: ReturnBookDto }) => {
      const response = await apiClient.patch(`/library/issues/${id}/return`, data);
      return response.data.data as BookIssue;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.issues() });
      queryClient.invalidateQueries({ queryKey: [...libraryKeys.issues(), data.id] });
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() });
      queryClient.invalidateQueries({ queryKey: libraryKeys.fines() });
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
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/library/issues/${id}/renew`);
      return response.data.data as BookIssue;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.issues() });
      queryClient.invalidateQueries({ queryKey: [...libraryKeys.issues(), data.id] });
      toast.success('Book renewed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to renew book');
    },
  });
}

export function useCreateFine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFineDto) => {
      const response = await apiClient.post('/library/fines', data);
      return response.data.data as Fine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.fines() });
      toast.success('Fine created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create fine');
    },
  });
}

export function useUpdateFine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFineDto }) => {
      const response = await apiClient.patch(`/library/fines/${id}`, data);
      return response.data.data as Fine;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.fines() });
      queryClient.invalidateQueries({ queryKey: [...libraryKeys.fines(), data.id] });
      toast.success('Fine updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update fine');
    },
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReservationDto) => {
      const response = await apiClient.post('/library/reservations', data);
      return response.data.data as BookReservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.reservations() });
      toast.success('Reservation created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create reservation');
    },
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateReservationDto }) => {
      const response = await apiClient.patch(`/library/reservations/${id}`, data);
      return response.data.data as BookReservation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.reservations() });
      queryClient.invalidateQueries({ queryKey: [...libraryKeys.reservations(), data.id] });
      toast.success('Reservation updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update reservation');
    },
  });
}
