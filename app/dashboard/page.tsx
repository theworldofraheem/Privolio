'use client';

import { useEffect, useState } from 'react';
import { ShareLink } from '@/types';
import { linkAPI } from '@/lib/api';
import { formatRelativeTime, isExpired, getShareUrl, copyToClipboard } from '@/utils/helpers';
import { Copy, ExternalLink, Trash2, Eye, EyeOff, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const data = await linkAPI.getLinks();
      setLinks(data);
    } catch (error) {
      console.error('Failed to load links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (token: string, linkId: string) => {
    const url = getShareUrl(token);
    await copyToClipboard(url);
    setCopiedId(linkId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    try {
      await linkAPI.deleteLink(linkId);
      setLinks(links.filter((link) => link.id !== linkId));
    } catch (error) {
      console.error('Failed to delete link:', error);
      alert('Failed to delete link');
    }
  };

  const handleToggle = async (linkId: string) => {
    try {
      const updated = await linkAPI.toggleLink(linkId);
      setLinks(links.map((link) => (link.id === linkId ? updated : link)));
    } catch (error) {
      console.error('Failed to toggle link:', error);
      alert('Failed to toggle link');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Share Links
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your shared code repositories
          </p>
        </div>
        <Link href="/dashboard/create" className="btn-primary">
          Create New Link
        </Link>
      </div>

      {links.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No links yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first share link to get started
          </p>
          <Link href="/dashboard/create" className="btn-primary">
            Create Link
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link) => {
            const expired = isExpired(link.expiresAt);
            const viewLimitReached = link.maxViews && link.currentViews >= link.maxViews;
            const inactive = !link.isActive || expired || viewLimitReached;

            return (
              <div key={link.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {link.repoFullName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          inactive
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        }`}
                      >
                        {inactive ? 'Inactive' : 'Active'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {link.currentViews}
                          {link.maxViews ? ` / ${link.maxViews}` : ''} views
                        </span>
                      </div>
                      {link.expiresAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {expired
                              ? 'Expired'
                              : `Expires ${formatRelativeTime(link.expiresAt)}`}
                          </span>
                        </div>
                      )}
                      <div className="text-gray-500">
                        Created {formatRelativeTime(link.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                        {getShareUrl(link.token)}
                      </code>
                      <button
                        onClick={() => handleCopy(link.token, link.id)}
                        className="btn-secondary flex items-center gap-2"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                        {copiedId === link.id ? 'Copied!' : 'Copy'}
                      </button>
                      
                        href={getShareUrl(link.token)}
                        target="_blank"
                        <a rel="noopener noreferrer"
                        className="btn-secondary"
                        title="Open link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggle(link.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title={link.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {link.isActive ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}