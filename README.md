# Yayvo - Sentiment-Based Review & Product Marketplace

**Author:** Sarjak Bhandari  
**Coventry ID:** 14811977  
**Project:** WEB API DEVELOPMENT

## Overview

Yayvo is an  sentiment-based review platform and product marketplace that revolutionizes how users share experiences. Instead of traditional numerical ratings, Yayvo uses emotional sentiments (calm, cozy, vibrant, etc.) to capture authentic user experiences.

### Key Features

- **Sentiment-Based Reviews** - Express experiences through emotions rather than traditional ratings
- **Product Marketplace** - Retailers can list and manage products with detailed information
- **Multi-Role System** - Support for consumers, retailers, and admin accounts
- **Product Discovery** - Advanced search and exploration of products
- **Market Intelligence** - Retailers can view marketplace trends and competitor products
- **Admin Dashboard** - Complete management system for users and accounts
- **Collections** - Users can create and organize product and review collections (liked and save)
- **Secure Authentication** - Comprehensive user registration and login system

## Tech Stack

### Frontend Framework & UI
- **Next.js** 16.1.6 - React framework for production
- **React** 19.2.3 - JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** 4 - Utility-first CSS framework

### Form Management & Validation
- **React Hook Form** 7.69.0 - Performant, flexible forms
- **@hookform/resolvers** - Schema validators for form validation

### API & HTTP
- **Axios** 1.13.2 - Promise-based HTTP client

### UI Components & Notifications
- **Lucide React** 0.562.0 - Beautiful icon components
- **React Toastify** 11.0.5 - Toast notifications

### Development & Testing
- **Jest** 30.2.0 - JavaScript testing framework
- **Testing Library** - React component testing utilities
- **ESLint** - Code quality and consistency

## Project Structure

```
yayvo/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Authentication routes (protected layout)
│   │   ├── login/
│   │   ├── register/
│   │   │   ├── consumer/
│   │   │   └── retailer/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── admin/                   # Admin dashboard
│   │   ├── consumers/
│   │   └── retailers/
│   ├── consumer/                # Consumer user section
│   │   ├── collection/
│   │   ├── create/
│   │   ├── explore/
│   │   └── profile/
│   ├── retailer/                # Retailer user section
│   │   ├── create/
│   │   ├── products/
│   │   └── profile/
│   └── types/                   # TypeScript type definitions
├── lib/                          # Utility functions & API client
│   ├── actions/                 # Server actions for data mutations
│   ├── api/                     # API client configuration
│   └── utilities (cookie, url helpers)
├── public/                       # Static assets
├── __tests__/                   # Integration tests
├── coverage/                    # Test coverage reports
└── Configuration files (tsconfig, jest, eslint, etc.)
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yayvo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_API_BASE_URL=<your-api-endpoint>
   # Add other required environment variables
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Development
- `npm run dev` - Start development server with hot module reloading

### Production
- `npm run build` - Build optimized production bundle
- `npm start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint to check code quality
- `npm run lint -- --fix` - Auto-fix linting issues

### Testing
- `npm test` - Run tests in watch mode
- `npm run test:watch` - Run tests with watch mode enabled
- `npm run test:coverage` - Generate coverage report

## Testing

The project includes comprehensive integration tests for different user roles:
- `admin.integration.test.tsx` - Admin dashboard tests
- `consumer.integration.test.tsx` - Consumer features tests
- `retailer.integration.test.tsx` - Retailer features tests

Run tests with:
```bash
npm test                # Run all tests
npm run test:coverage   # Generate coverage report
```

## Architecture Overview

### Authentication System
- Consumer registration and login
- Retailer registration and login
- Password reset and recovery
- Admin account management

### Core Modules
1. **Consumer Module** - Browse products, write reviews, create collections
2. **Retailer Module** - Create products, manage inventory, view analytics
3. **Admin Module** - Manage users, oversee marketplace, handle disputes

### API Integration
- Centralized Axios configuration for API calls
- Server actions for data mutations
- Type-safe API endpoints

## Deployment

The application is containerized using Docker for easy deployment:

```bash

# Build Docker image
docker build -t yayvo:latest .

# Run container
docker run -p 3000:3000 yayvo:latest
```

