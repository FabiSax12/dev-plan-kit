# DevPlanKit

A full-stack web application for developers to plan, manage, and track projects effectively. DevPlanKit combines project management, idea tracking, learning roadmaps, and AI-powered assistance into a comprehensive development planning platform.

## Features

### Project Management
- Full CRUD operations for projects with metadata tracking
- Project status management (planning, in development, completed, on hold)
- Tech stack and URL tracking (production, repository, custom URLs)
- Project overview dashboard with statistics

### Idea Management
- Capture and store project ideas with descriptions
- Convert ideas directly into projects
- Recent ideas widget on dashboard

### Requirements Document Editor
- Rich Markdown editor with live preview
- AI-powered assistant for analyzing and modifying requirements
- Pre-built templates for requirements documentation
- Edit history with undo/redo functionality
- Export options (copy and download)

### AI Assistant
- General chat for project brainstorming and guidance
- Specialized Requirements Engineer AI
- Conversation management (save and manage multiple chats)
- Project-specific and idea-specific AI assistance
- Expert system prompts for different tasks

### Authentication & User Management
- OAuth integration for social authentication
- User profiles with customizable settings
- Session management via Supabase

### UI Features
- Dark/Light theme toggle with multiple theme options
- Collapsible navigation sidebar
- Mobile responsive design
- Resizable panel layouts
- Toast notifications

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management
- **TanStack Start** - Full-stack React framework
- **TanStack Form** - Form state management
- **Tailwind CSS** - Styling
- **Radix UI / shadcn/ui** - Component library
- **Lucide React** - Icons

### Backend & Data
- **Supabase** - PostgreSQL database and authentication

### AI Integration
- **Vercel AI SDK** - LLM integration
- **Deepseek via OpenRouter** - AI model provider

### Development & Deployment
- **TypeScript** - Language
- **Vite** - Build tool
- **Biome** - Linting and formatting
- **Vitest** - Testing
- **Cloudflare Workers** - Edge deployment

## Prerequisites

- Node.js (v18 or higher recommended)
- pnpm
- Supabase account and project
- OpenRouter API key (for AI features)