import axios from 'axios';
import { CreateLinkRequest, ShareLink, Repository, FileNode, FileContent } from '@/types';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
    return response.data;
  },
};

export const repoAPI = {
  // Get user's repositories
  getRepositories: async (): Promise<Repository[]> => {
    const response = await api.get('/github/repos');
    return response.data;
  },

  // Get repository branches
  getBranches: async (repoFullName: string): Promise<string[]> => {
    const response = await api.get(`/github/repos/${encodeURIComponent(repoFullName)}/branches`);
    return response.data;
  },

  // Get repository file tree
  getFileTree: async (repoFullName: string, branch: string, path?: string): Promise<FileNode[]> => {
    const params = new URLSearchParams({ branch });
    if (path) params.append('path', path);
    const response = await api.get(`/github/repos/${encodeURIComponent(repoFullName)}/tree?${params}`);
    return response.data;
  },
};

export const linkAPI = {
  // Create a new share link
  createLink: async (data: CreateLinkRequest): Promise<ShareLink> => {
    const response = await api.post('/links', data);
    return response.data;
  },

  // Get all user's links
  getLinks: async (): Promise<ShareLink[]> => {
    const response = await api.get('/links');
    return response.data;
  },

  // Get single link by ID
  getLink: async (linkId: string): Promise<ShareLink> => {
    const response = await api.get(`/links/${linkId}`);
    return response.data;
  },

  // Delete a link
  deleteLink: async (linkId: string): Promise<void> => {
    await api.delete(`/links/${linkId}`);
  },

  // Toggle link active status
  toggleLink: async (linkId: string): Promise<ShareLink> => {
    const response = await api.patch(`/links/${linkId}/toggle`);
    return response.data;
  },
};

export const shareAPI = {
  // Access shared link (public endpoint)
  accessLink: async (token: string) => {
    const response = await api.get(`/share/${token}`);
    return response.data;
  },

  // Get file tree for shared link
  getSharedTree: async (token: string, path?: string): Promise<FileNode[]> => {
    const params = path ? `?path=${encodeURIComponent(path)}` : '';
    const response = await api.get(`/share/${token}/tree${params}`);
    return response.data;
  },

  // Get file content for shared link
  getSharedFile: async (token: string, filePath: string): Promise<FileContent> => {
    const response = await api.get(`/share/${token}/file`, {
      params: { path: filePath },
    });
    return response.data;
  },
};

export default api;
