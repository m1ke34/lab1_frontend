export class ApiError extends Error {
  status: number;
  details?: string;
  code?: string;

  constructor(status: number, code: string, message: string, details?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
    code: err.code || "INTERNAL_ERROR",
    details: err.details || undefined
  });
};
