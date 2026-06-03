export interface ReportDto {
  id: number;
  title: string;
  severity: string;
  status: string;
  userId: number; 
  description: string;
}

export interface CreateReportDto {
  title: string;
  severity: string;
  status: string;
  userId: number; 
  description: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: string;
}
