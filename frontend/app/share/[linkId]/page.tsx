'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { shareAPI } from '@/lib/api';
import { FileNode, FileContent } from '@/types';
import FileTree from '@/components/viewer/FileTree';
import { Lock, AlertCircle, Eye, File } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import CodeViewer to avoid SSR issues with Monaco
const DynamicCodeViewer = dynamic(
  () => import('@/components/viewer/CodeViewer'),
  { ssr: false }
);

export default function SharePage() {
  const params = useParams();
  const linkId = params.linkId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState<any>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileContent | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);

  useEffect(() => {
    loadShareLink();
  }, [linkId]);

  const loadShareLink = async () => {
    try {
      const data = await shareAPI.accessLink(linkId);
      setLinkData(data);
      
      // Load file tree
      const tree = await shareAPI.getSharedTree(linkId);
      setFileTree(tree);

      // Auto-select first file if available
      const firstFile = findFirstFile(tree);
      if (firstFile) {
        handleFileSelect(firstFile.path);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load shared link');
    } finally {
      setLoading(false);
    }
  };

  const findFirstFile = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') return node;
      if (node.children) {
        const found = findFirstFile(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleFileSelect = async (path: string) => {
    setLoadingFile(true);
    try {
      const content = await shareAPI.getSharedFile(linkId, path);
      setSelectedFile(content);
    } catch (err) {
      console.error('Failed to load file:', err);
      alert('Failed to load file');
    } finally {
      setLoadingFile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading shared code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            This link may have expired, reached its view limit, or been deactivated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {linkData?.repoFullName}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Read-only view • Branch: {linkData?.branch}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Eye className="w-4 h-4" />
            <span>
              Views: {linkData?.currentViews}
              {linkData?.maxViews && ` / ${linkData.maxViews}`}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Files
            </h2>
            <FileTree
              nodes={fileTree}
              onFileSelect={handleFileSelect}
              selectedPath={selectedFile?.path}
            />
          </div>
        </aside>

        {/* Code Viewer */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden">
          {loadingFile ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : selectedFile ? (
            <div className="h-full flex flex-col">
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedFile.path}
                </h3>
              </div>
              <div className="flex-1">
                <DynamicCodeViewer
                  content={selectedFile.content}
                  filename={selectedFile.path}
                  readOnly
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <File className="w-12 h-12 mx-auto mb-2" />
                <p>Select a file to view</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Powered by Privolio</span>
          </div>
          <div>
            This is a read-only view. Files cannot be downloaded or modified.
          </div>
        </div>
      </footer>
    </div>
  );
}