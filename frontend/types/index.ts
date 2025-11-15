export interface User {
  id: string;
  githubId: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  private: boolean;
  defaultBranch: string;
}

export interface ShareLink {
  id: string;
  userId: string;
  repoFullName: string;
  branch: string;
  path?: string;
  token: string;
  expiresAt?: string;
  maxViews?: number;
  currentViews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  children?: FileNode[];
}

export interface FileContent {
  path: string;
  content: string;
  encoding: string;
  size: number;
}

export interface CreateLinkRequest {
  repoFullName: string;
  branch: string;
  path?: string;
  expiresIn?: number; // hours
  maxViews?: number;
}

export interface ShareLinkResponse {
  success: boolean;
  link?: ShareLink;
  url?: string;
  error?: string;
}
