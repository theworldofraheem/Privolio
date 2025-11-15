'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { repoAPI, linkAPI } from '@/lib/api';
import { Repository } from '@/types';
import { getShareUrl } from '@/utils/helpers';
import { ArrowLeft, GitBranch, FolderTree, Clock, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CreateLinkPage() {
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    repoFullName: '',
    branch: '',
    path: '',
    expiresIn: '24',
    maxViews: '',
  });

  const [createdLink, setCreatedLink] = useState<string | null>(null);

  useEffect(() => {
    loadRepositories();
  }, []);

  useEffect(() => {
    if (formData.repoFullName) {
      loadBranches(formData.repoFullName);
    }
  }, [formData.repoFullName]);

  const loadRepositories = async () => {
    try {
      const data = await repoAPI.getRepositories();
      setRepositories(data);
    } catch (error) {
      console.error('Failed to load repositories:', error);
      alert('Failed to load repositories. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async (repoFullName: string) => {
    try {
      const data = await repoAPI.getBranches(repoFullName);
      setBranches(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, branch: data[0] }));
      }
    } catch (error) {
      console.error('Failed to load branches:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.repoFullName || !formData.branch) {
      alert('Please select a repository and branch');
      return;
    }

    setCreating(true);
    try {
      const payload = {
        repoFullName: formData.repoFullName,
        branch: formData.branch,
        path: formData.path || undefined,
        expiresIn: formData.expiresIn ? parseInt(formData.expiresIn) : undefined,
        maxViews: formData.maxViews ? parseInt(formData.maxViews) : undefined,
      };

      const link = await linkAPI.createLink(payload);
      setCreatedLink(getShareUrl(link.token));
    } catch (error) {
      console.error('Failed to create link:', error);
      alert('Failed to create link. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleReset = () => {
    setCreatedLink(null);
    setFormData({
      repoFullName: '',
      branch: '',
      path: '',
      expiresIn: '24',
      maxViews: '',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (createdLink) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Link Created Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your shareable link is ready to use
          </p>
          
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
              {createdLink}
            </code>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdLink);
                alert('Link copied to clipboard!');
              }}
              className="btn-primary"
            >
              Copy Link
            </button>
            <button onClick={handleReset} className="btn-secondary">
              Create Another
            </button>
            <Link href="/dashboard" className="btn-secondary">
              View All Links
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Share Link
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate a secure, temporary link to share your code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Repository Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              Repository
            </div>
          </label>
          <select
            value={formData.repoFullName}
            onChange={(e) => setFormData({ ...formData, repoFullName: e.target.value })}
            className="input"
            required
          >
            <option value="">Select a repository</option>
            {repositories.map((repo) => (
              <option key={repo.id} value={repo.fullName}>
                {repo.fullName} {repo.private && '(Private)'}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Selection */}
        {branches.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Branch
              </div>
            </label>
            <select
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="input"
              required
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Path (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Path (Optional)
          </label>
          <input
            type="text"
            value={formData.path}
            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
            placeholder="e.g., src/ or leave empty for entire repo"
            className="input"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Leave empty to share the entire repository
          </p>
        </div>

        {/* Expiration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Link Expiration
            </div>
          </label>
          <select
            value={formData.expiresIn}
            onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
            className="input"
          >
            <option value="">Never expires</option>
            <option value="1">1 hour</option>
            <option value="6">6 hours</option>
            <option value="24">24 hours</option>
            <option value="72">3 days</option>
            <option value="168">1 week</option>
          </select>
        </div>

        {/* Max Views */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Maximum Views (Optional)
            </div>
          </label>
          <input
            type="number"
            value={formData.maxViews}
            onChange={(e) => setFormData({ ...formData, maxViews: e.target.value })}
            placeholder="e.g., 50"
            min="1"
            className="input"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Leave empty for unlimited views
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={creating}
            className="btn-primary flex-1"
          >
            {creating ? 'Creating...' : 'Create Link'}
          </button>
          <Link href="/dashboard" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
