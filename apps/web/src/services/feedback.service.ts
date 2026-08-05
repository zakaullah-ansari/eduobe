import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface FeedbackSurvey {
  id: string;
  surveyNumber: string;
  title: string;
  description?: string;
  surveyType: 'course' | 'faculty' | 'infrastructure' | 'overall' | 'event' | 'other';
  targetAudience: 'students' | 'faculty' | 'staff' | 'alumni' | 'parents' | 'all';
  startDate: string;
  endDate: string;
  questions: any[];
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  departmentId?: string;
  programId?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    responses: number;
  };
}

export interface FeedbackResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  respondentType: 'student' | 'faculty' | 'staff' | 'alumni' | 'parent';
  responses: any;
  overallRating?: number;
  comments?: string;
  submittedDate: string;
  createdAt: string;
  updatedAt: string;
  survey?: {
    id: string;
    title: string;
    surveyType: string;
  };
  respondent?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CourseFeedback {
  id: string;
  feedbackNumber: string;
  studentId: string;
  courseOfferingId: string;
  semesterId: string;
  teachingEffectiveness?: number;
  courseContent?: number;
  assessmentMethods?: number;
  learningResources?: number;
  overallRating?: number;
  strengths?: string;
  improvements?: string;
  comments?: string;
  status: 'submitted' | 'reviewed' | 'acknowledged';
  reviewedBy?: string;
  reviewedDate?: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
  };
  courseOffering?: {
    id: string;
    course?: {
      id: string;
      name: string;
      code: string;
    };
    faculty?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface FacultyFeedback {
  id: string;
  feedbackNumber: string;
  respondentId: string;
  respondentType: 'student' | 'peer' | 'hod' | 'principal';
  facultyId: string;
  courseOfferingId?: string;
  teachingQuality?: number;
  communicationSkills?: number;
  subjectKnowledge?: number;
  punctuality?: number;
  overallRating?: number;
  strengths?: string;
  improvements?: string;
  comments?: string;
  status: 'submitted' | 'reviewed' | 'acknowledged';
  reviewedBy?: string;
  reviewedDate?: string;
  createdAt: string;
  updatedAt: string;
  faculty?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  courseOffering?: {
    id: string;
    course?: {
      id: string;
      name: string;
    };
  };
}

export interface CreateSurveyDto {
  title: string;
  description?: string;
  surveyType: 'course' | 'faculty' | 'infrastructure' | 'overall' | 'event' | 'other';
  targetAudience: 'students' | 'faculty' | 'staff' | 'alumni' | 'parents' | 'all';
  startDate: string;
  endDate: string;
  questions: any[];
  departmentId?: string;
  programId?: string;
}

export interface UpdateSurveyDto extends Partial<CreateSurveyDto> {
  status?: 'draft' | 'active' | 'completed' | 'cancelled';
}

export interface CreateResponseDto {
  surveyId: string;
  respondentId: string;
  respondentType: 'student' | 'faculty' | 'staff' | 'alumni' | 'parent';
  responses: any;
  overallRating?: number;
  comments?: string;
}

export interface CreateCourseFeedbackDto {
  studentId: string;
  courseOfferingId: string;
  semesterId: string;
  teachingEffectiveness?: number;
  courseContent?: number;
  assessmentMethods?: number;
  learningResources?: number;
  overallRating?: number;
  strengths?: string;
  improvements?: string;
  comments?: string;
}

export interface UpdateCourseFeedbackDto extends Partial<CreateCourseFeedbackDto> {
  status?: 'submitted' | 'reviewed' | 'acknowledged';
  reviewedBy?: string;
  reviewedDate?: string;
}

export interface CreateFacultyFeedbackDto {
  respondentId: string;
  respondentType: 'student' | 'peer' | 'hod' | 'principal';
  facultyId: string;
  courseOfferingId?: string;
  teachingQuality?: number;
  communicationSkills?: number;
  subjectKnowledge?: number;
  punctuality?: number;
  overallRating?: number;
  strengths?: string;
  improvements?: string;
  comments?: string;
}

export interface UpdateFacultyFeedbackDto extends Partial<CreateFacultyFeedbackDto> {
  status?: 'submitted' | 'reviewed' | 'acknowledged';
  reviewedBy?: string;
  reviewedDate?: string;
}

export const feedbackKeys = {
  all: ['feedback'] as const,
  surveys: () => [...feedbackKeys.all, 'surveys'] as const,
  survey: (filters: any) => [...feedbackKeys.surveys(), filters] as const,
  responses: () => [...feedbackKeys.all, 'responses'] as const,
  response: (filters: any) => [...feedbackKeys.responses(), filters] as const,
  courseFeedback: () => [...feedbackKeys.all, 'courseFeedback'] as const,
  facultyFeedback: () => [...feedbackKeys.all, 'facultyFeedback'] as const,
};

export function useFeedbackSurveys(filters?: any) {
  return useQuery({
    queryKey: feedbackKeys.survey(filters),
    queryFn: async () => {
      const response = await apiClient.get('/feedback/surveys', { params: filters });
      return response.data.data as FeedbackSurvey[];
    },
  });
}

export function useFeedbackSurvey(id: string) {
  return useQuery({
    queryKey: [...feedbackKeys.surveys(), id],
    queryFn: async () => {
      const response = await apiClient.get(`/feedback/surveys/${id}`);
      return response.data.data as FeedbackSurvey;
    },
    enabled: !!id,
  });
}

export function useFeedbackResponses(filters?: any) {
  return useQuery({
    queryKey: feedbackKeys.response(filters),
    queryFn: async () => {
      const response = await apiClient.get('/feedback/responses', { params: filters });
      return response.data.data as FeedbackResponse[];
    },
  });
}

export function useCourseFeedbacks(filters?: any) {
  return useQuery({
    queryKey: feedbackKeys.courseFeedback(),
    queryFn: async () => {
      const response = await apiClient.get('/feedback/course', { params: filters });
      return response.data.data as CourseFeedback[];
    },
  });
}

export function useFacultyFeedbacks(filters?: any) {
  return useQuery({
    queryKey: feedbackKeys.facultyFeedback(),
    queryFn: async () => {
      const response = await apiClient.get('/feedback/faculty', { params: filters });
      return response.data.data as FacultyFeedback[];
    },
  });
}

export function useCreateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSurveyDto) => {
      const response = await apiClient.post('/feedback/surveys', data);
      return response.data.data as FeedbackSurvey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.surveys() });
      toast.success('Survey created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create survey');
    },
  });
}

export function useUpdateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSurveyDto }) => {
      const response = await apiClient.patch(`/feedback/surveys/${id}`, data);
      return response.data.data as FeedbackSurvey;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.surveys() });
      queryClient.invalidateQueries({ queryKey: [...feedbackKeys.surveys(), data.id] });
      toast.success('Survey updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update survey');
    },
  });
}

export function useDeleteSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/feedback/surveys/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.surveys() });
      toast.success('Survey deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete survey');
    },
  });
}

export function useSubmitResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateResponseDto) => {
      const response = await apiClient.post('/feedback/responses', data);
      return response.data.data as FeedbackResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.responses() });
      toast.success('Feedback submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    },
  });
}

export function useSubmitCourseFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCourseFeedbackDto) => {
      const response = await apiClient.post('/feedback/course', data);
      return response.data.data as CourseFeedback;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.courseFeedback() });
      toast.success('Course feedback submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit course feedback');
    },
  });
}

export function useUpdateCourseFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCourseFeedbackDto }) => {
      const response = await apiClient.patch(`/feedback/course/${id}`, data);
      return response.data.data as CourseFeedback;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.courseFeedback() });
      queryClient.invalidateQueries({ queryKey: [...feedbackKeys.courseFeedback(), data.id] });
      toast.success('Course feedback updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update course feedback');
    },
  });
}

export function useSubmitFacultyFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFacultyFeedbackDto) => {
      const response = await apiClient.post('/feedback/faculty', data);
      return response.data.data as FacultyFeedback;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.facultyFeedback() });
      toast.success('Faculty feedback submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit faculty feedback');
    },
  });
}

export function useUpdateFacultyFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFacultyFeedbackDto }) => {
      const response = await apiClient.patch(`/feedback/faculty/${id}`, data);
      return response.data.data as FacultyFeedback;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.facultyFeedback() });
      queryClient.invalidateQueries({ queryKey: [...feedbackKeys.facultyFeedback(), data.id] });
      toast.success('Faculty feedback updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update faculty feedback');
    },
  });
}
