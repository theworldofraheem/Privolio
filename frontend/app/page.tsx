'use client';

import Link from 'next/link';
import { Code, Lock, Clock, Eye, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Privolio
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Share Your Private Code
            <br />
            <span className="text-primary-600">Securely & Temporarily</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Perfect for portfolios, recruiter access, and client demos. Create read-only, 
            time-limited links to your private GitHub repositories.
          </p>
          <Link href="http://localhost:3000/auth/github" className="btn-primary text-lg px-8 py-3">
            Sign in with GitHub
          </Link>
        </div>

        {/* Demo Preview */}
        <div className="mt-16 bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="p-8 font-mono text-sm text-green-400">
            <div className="mb-2">
              <span className="text-purple-400">const</span> shareLink{' '}
              <span className="text-white">=</span>{' '}
              <span className="text-blue-400">createPrivolioLink</span>
              <span className="text-white">()</span>
            </div>
            <div className="mb-2 pl-4">
              <span className="text-white">.</span>
              <span className="text-blue-400">repo</span>
              <span className="text-white">(</span>
              <span className="text-orange-400">"my-awesome-project"</span>
              <span className="text-white">)</span>
            </div>
            <div className="mb-2 pl-4">
              <span className="text-white">.</span>
              <span className="text-blue-400">expiresIn</span>
              <span className="text-white">(</span>
              <span className="text-orange-400">"24h"</span>
              <span className="text-white">)</span>
            </div>
            <div className="pl-4">
              <span className="text-white">.</span>
              <span className="text-blue-400">maxViews</span>
              <span className="text-white">(</span>
              <span className="text-orange-400">50</span>
              <span className="text-white">)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful features for secure code sharing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Share Your Code Securely?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join developers who trust Privolio for secure code sharing
          </p>
          <Link href="/api/auth/signin" className="btn-primary text-lg px-8 py-3">
            Sign in with GitHub
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-600" />
              <span className="font-bold text-gray-900 dark:text-white">Privolio</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2024 Privolio. Secure code sharing made simple.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Shield,
    title: 'GitHub OAuth',
    description: 'Secure authentication with your GitHub account. No passwords to remember.',
  },
  {
    icon: Eye,
    title: 'Read-Only Access',
    description: 'Share code with confidence. Recipients can view but never modify or download.',
  },
  {
    icon: Clock,
    title: 'Time-Limited Links',
    description: 'Set expiration dates for your shares. Links automatically expire when needed.',
  },
  {
    icon: Zap,
    title: 'View Limits',
    description: 'Control access with view count limits. Perfect for managing who sees your code.',
  },
  {
    icon: Code,
    title: 'Beautiful Code Viewer',
    description: 'Monaco Editor provides syntax highlighting and a VSCode-like experience.',
  },
  {
    icon: Lock,
    title: 'Private by Default',
    description: 'Your code stays private. Only share exactly what you want, when you want.',
  },
];