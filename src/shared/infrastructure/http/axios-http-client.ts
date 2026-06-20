import axios, { type AxiosInstance } from 'axios';
import type { HttpClient } from './http-client';

/**
 * Axios implementation of the HttpClient port.
 * Adds the bearer token (when present) to every request via an interceptor.
 * The token reader is injected so this adapter does not know about the IAM
 * store or localStorage layout — it only knows "how to get a token string".
 */
export class AxiosHttpClient implements HttpClient {
  private readonly instance: AxiosInstance;

  constructor(baseURL: string, private readonly tokenReader: () => string | null = () => null) {
    this.instance = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
    });

    this.instance.interceptors.request.use((config) => {
      const token = this.tokenReader();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const { data } = await this.instance.get<T>(url, { params });
    return data;
  }

  async post<T>(url: string, body: unknown): Promise<T> {
    const { data } = await this.instance.post<T>(url, body);
    return data;
  }

  async patch<T>(url: string, body: unknown): Promise<T> {
    const { data } = await this.instance.patch<T>(url, body);
    return data;
  }

  async delete(url: string): Promise<void> {
    await this.instance.delete(url);
  }
}
