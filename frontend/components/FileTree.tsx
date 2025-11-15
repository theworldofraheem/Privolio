'use client';

import { useState } from 'react';
import { FileNode } from '@/types';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';

interface FileTreeProps {
  nodes: FileNode[];
  onFileSelect: (path: string) => void;
  selectedPath?: string;
}

export default function FileTree({ nodes, onFileSelect, selectedPath }: FileTreeProps) {
  return (
    <div className="text-sm">
      {nodes.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          onFileSelect={onFileSelect}
          selectedPath={selectedPath}
          level={0}
        />
      ))}
    </div>
  );
}

interface TreeNodeProps {
  node: FileNode;
  onFileSelect: (path: string) => void;
  selectedPath?: string;
  level: number;
}

function TreeNode({ node, onFileSelect, selectedPath, level }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const isSelected = selectedPath === node.path;
  const isDirectory = node.type === 'dir';

  const handleClick = () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node.path);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
          isSelected ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {isDirectory && (
          <span className="w-4 h-4 flex-shrink-0">
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        {!isDirectory && <span className="w-4 h-4 flex-shrink-0" />}
        
        <span className="w-4 h-4 flex-shrink-0">
          {isDirectory ? (
            isOpen ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )
          ) : (
            <File className="w-4 h-4 text-gray-400" />
          )}
        </span>
        
        <span className="truncate text-gray-700 dark:text-gray-300">
          {node.name}
        </span>
      </div>

      {isDirectory && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              onFileSelect={onFileSelect}
              selectedPath={selectedPath}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
