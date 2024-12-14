whycook/
├── .env.local                # Local environment variables
├── .env.production           # Production environment variables
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.js
├── src/
│   ├── app/                  # Next.js 13+ app directory
│   │   ├── layout.js         # Root layout with navigation
│   │   ├── page.js          # Home page (recipe list with stock status)
│   │   ├── inventory/        # Inventory management
│   │   │   └── page.js    
│   │   └── recipes/          # Recipe management
│   │       └── page.js
│   ├── components/           # Shared components
│   ├── lib/                  # Configuration and utilities
│   ├── models/              # MongoDB schemas
│   └── api/                 # API routes
└── public/                  # Static assets

DEVELOPMENT PHASES:

1. Setup Phase
   └── Initial Configuration
       ├── Create Next.js project with TypeScript and Tailwind
       ├── Set up ESLint and Prettier
       ├── Configure MongoDB connection
       └── Set up development environment variables

2. Local Development Phase
   ├── Database Models
   │   ├── Implement Food schema
   │   └── Implement Recipe schema
   │
   ├── Backend Development
   │   ├── Create MongoDB connection utility
   │   └── Implement API routes for CRUD operations
   │
   └── Frontend Development
       ├── Build basic UI components
       ├── Implement home page with recipe listing
       ├── Create inventory management page
       └── Develop recipe management page

3. Testing Phase
   ├── Manual testing of all features
   ├── Data validation testing
   └── Responsive design testing

4. Deployment Phase
   ├── Railway Setup
   │   ├── Create Railway project
   │   ├── Configure MongoDB deployment
   │   └── Set up environment variables
   │
   ├── Vercel Setup
   │   ├── Connect to GitHub repository
   │   ├── Configure build settings
   │   ├── Set up environment variables
   │   └── Configure domain settings
   │
   └── Post-Deployment
       ├── Verify all features work in production
       ├── Monitor application performance
       └── Set up logging and error tracking

DEPLOYMENT WORKFLOW:

1. Railway (Database)
   ├── Push MongoDB to Railway
   ├── Obtain connection string
   └── Configure network access

2. Vercel (Frontend/API)
   ├── Push code to GitHub
   ├── Connect Vercel to repository
   ├── Configure environment variables
   │   ├── MongoDB connection string
   │   └── Other sensitive data
   └── Deploy application

ENVIRONMENT VARIABLES NEEDED:
├── MONGODB_URI
├── NEXTAUTH_URL (if adding auth later)
├── NEXTAUTH_SECRET (if adding auth later)
└── NODE_ENV