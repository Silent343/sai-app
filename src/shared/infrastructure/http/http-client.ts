/**
 * HttpClient port.
 * The infrastructure layer depends on this abstraction rather than on axios
 * directly (Dependency Inversion). Repositories receive an HttpClient, so the
 * transport can be swapped (axios, fetch, a test double) without touching them.
 */
export interface HttpClient {
  get<T>(url: string, params?: Record<string, unknown>): Promise<T>;
  post<T>(url: string, body: unknown): Promise<T>;
  patch<T>(url: string, body: unknown): Promise<T>;
  delete(url: string): Promise<void>;
}
