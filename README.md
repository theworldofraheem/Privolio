# Privolio Frontend

A modern Next.js frontend for Privolio - The Secure Read-Only Code Sharing Platform.

## Features

- 🔐 **GitHub OAuth Authentication** - Secure login with GitHub
- 📁 **Repository Browser** - View and select from your repositories
- 🔗 **Shareable Links** - Create temporary, secure links to your code
- 👁️ **View Controls** - Set expiration times and view limits
- 💻 **Monaco Editor** - Beautiful code viewing experience
- 🎨 **Modern UI** - Clean, responsive design with dark mode support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **Auth**: NextAuth.js
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm/yarn
- GitHub OAuth App credentials
- Privolio backend API running

## Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# GitHub OAuth (create at https://github.com/settings/developers)
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here
```

### 3. GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - **Application name**: Privolio
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and Client Secret to your `.env.local`

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in your `.env.local`

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
privolio-frontend/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   └── auth/            # NextAuth configuration
│   ├── dashboard/           # Dashboard pages
│   │   ├── create/          # Create link page
│   │   └── page.tsx         # Dashboard home
│   ├── share/               # Shared link viewer
│   │   └── [linkId]/        # Dynamic share page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # UI components
│   ├── layout/              # Layout components
│   ├── dashboard/           # Dashboard components
│   └── viewer/              # Code viewer components
│       ├── CodeViewer.tsx   # Monaco editor wrapper
│       └── FileTree.tsx     # File tree explorer
├── lib/                     # Libraries and utilities
│   └── api.ts               # API client
├── types/                   # TypeScript type definitions
│   └── index.ts             # Shared types
├── utils/                   # Utility functions
│   └── helpers.ts           # Helper functions
└── public/                  # Static assets
```

## Key Components

### Landing Page (`app/page.tsx`)
- Hero section with features
- Call-to-action for GitHub login
- Feature showcase

### Dashboard (`app/dashboard/`)
- View all created links
- Manage link status (active/inactive)
- Copy share URLs
- Delete links

### Create Link (`app/dashboard/create/`)
- Select repository and branch
- Set expiration time
- Configure view limits
- Generate shareable link

### Share Viewer (`app/share/[linkId]/`)
- File tree navigation
- Monaco code editor
- Read-only viewing
- No download capability

## API Integration

The frontend communicates with the backend API through the `lib/api.ts` client:

- **Authentication**: `/api/auth/*`
- **Repositories**: `/api/repos`
- **Links**: `/api/links`
- **Sharing**: `/api/share/:token`

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

Build the production bundle:

```bash
npm run build
```

The output will be in the `.next` directory. Follow your hosting provider's instructions for deploying Next.js applications.

## Environment Variables for Production

Make sure to set these in your production environment:

- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `GITHUB_ID` - GitHub OAuth App ID
- `GITHUB_SECRET` - GitHub OAuth App Secret
- `NEXTAUTH_URL` - Your frontend URL (e.g., https://privolio.com)
- `NEXTAUTH_SECRET` - Random secret for session encryption

## Features to Implement

- [ ] User profile page
- [ ] Link analytics (detailed view history)
- [ ] Syntax highlighting themes
- [ ] Search within code
- [ ] Mobile responsive improvements
- [ ] Keyboard shortcuts
- [ ] Link templates
- [ ] Team sharing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@privolio.com

---

Built with ❤️ using Next.js and TypeScript
