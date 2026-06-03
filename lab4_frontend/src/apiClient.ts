import { API_BASE_URL } from "./config";
import type { ApiError, ReportDto, CreateReportDto } from "./dtos";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  let response: Response;

  try {
    response = await fetch(url, options);
  } catch (e: any) {
    const err: ApiError = {
      status: 0,
      message: "Помилка мережі або CORS",
      details: e?.message ?? String(e),
    };
    throw err;
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  const rawText = await response.text();

  if (response.ok) {
    if (!rawText) return null as unknown as T;
    try {
      return JSON.parse(rawText) as T;
    } catch {
      return rawText as unknown as T;
    }
  }

  let payload: any = null;
  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {}

  const err: ApiError = {
    status: response.status,
    message: payload?.message ?? "HTTP помилка",
    details: payload?.details ?? rawText ?? `HTTP ${response.status}`,
  };
  throw err;
}

export async function getReports(): Promise<ReportDto[]> {
  return await request<ReportDto[]>("");
}

export async function createReport(dto: CreateReportDto): Promise<ReportDto> {
  return await request<ReportDto>("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function updateReport(id: number, dto: CreateReportDto): Promise<ReportDto> {
  return await request<ReportDto>(`/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function deleteReport(id: number): Promise<void> {
  return await request<void>(`/${id}`, {
    method: "DELETE",
  });
}