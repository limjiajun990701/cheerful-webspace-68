
# Professional Portfolio Website

## 🚀 Overview

This is a comprehensive portfolio website designed to showcase professional experience, projects, skills, and blog content. Built with modern web technologies, it features a responsive design, dynamic content management, and an administrative dashboard.

## ✨ Features

- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Dynamic Content Sections**:
  - Professional introduction and about page
  - Experience timeline with detailed work history
  - Project showcase with filtering options
  - Skills categorization
  - Certifications display
  - Blog with article management
  - Resume upload and display
- **Administrative Dashboard**:
  - Secure admin login
  - Content management system for all sections
  - Blog post creation and editing
  - Project management
  - Resume upload/management
  - Certification tracking

## 🛠️ Technologies

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui component library
- React Router for navigation
- Tanstack React Query for data fetching

### Backend & Storage
- Supabase for database and authentication
- Supabase Storage for file management
- Row-level security for data protection

### Development
- Vite for fast development and building
- ESLint for code quality

## 🔧 Local Development

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone <your-repo-url>
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📝 Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 🚀 Deployment

This project can be deployed to any static site hosting service:

1. Build the production version:
```bash
npm run build
```

2. Deploy the contents of the `dist` folder to your hosting provider

## 📱 Responsive Design

The site is fully responsive with carefully designed layouts for:
- Mobile devices
- Tablets
- Desktops
- Large screens

## 📋 Content Management

The admin dashboard provides an intuitive interface to:
- Create and edit blog posts
- Add and update projects
- Upload and manage your resume
- Track certifications and achievements

## 🔒 Security

- Supabase handles authentication with secure token-based access
- Row-level security ensures data privacy
- Protected admin routes

## 📄 License

[MIT License](LICENSE)

## 👤 Author

[Your Name] - [Your Contact Information]
