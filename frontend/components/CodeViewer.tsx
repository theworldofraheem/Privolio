'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { getFileLanguage } from '@/utils/helpers';

interface CodeViewerProps {
  content: string;
  filename: string;
  readOnly?: boolean;
}

export default function CodeViewer({ content, filename, readOnly = true }: CodeViewerProps) {
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  useEffect(() => {
    // Detect system theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('vs-dark');
    } else {
      setTheme('light');
    }

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'vs-dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const language = getFileLanguage(filename);

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={content}
        theme={theme}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          contextmenu: false,
          selectOnLineNumbers: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
          },
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        }
      />
    </div>
  );
}
