# inSSIght - SSI Platform

A comprehensive platform for Student Success Initiative (SSI) programs, built with Next.js, Prisma, and NextAuth.js.

## Features

- **Authentication**: Separate login flows for students and administrators
- **Event Management**: Create, edit, and manage events
- **Check-in System**: Allow students to check in to events
- **Feedback Collection**: Gather feedback from students after events
- **Reporting**: Generate reports and visualize data
- **Form Builder**: Customize form fields and options

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- PostgreSQL database (or use Neon)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/insight-ssi-platform.git
   cd insight-ssi-platform
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   \`\`\`
   DATABASE_URL="postgresql://username:password@localhost:5432/insight?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key-here"
   RESEND_API_KEY="your-resend-api-key-here"
   \`\`\`

4. Set up the database:
   \`\`\`bash
   npx prisma migrate dev --name init
   npx prisma db seed
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Credentials

- **Admin**:
  - Email: admin@example.com
  - Password: admin123

- **Department Head**:
  - Email: depthead@example.com
  - Password: depthead123

- **Student**:
  - Any valid S-number (e.g., S12345678)

## Project Structure

- `/app`: Next.js App Router pages and layouts
- `/components`: Reusable React components
- `/lib`: Utility functions and services
- `/prisma`: Database schema and migrations
- `/public`: Static assets

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Email**: Resend
- **PDF Generation**: Puppeteer
- **Charts**: Recharts

## License

This project is licensed under the MIT License.
\`\`\`

Let's create a .gitignore file:

```txt file=".gitignore"
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
/prisma/dev.db
/prisma/dev.db-journal
