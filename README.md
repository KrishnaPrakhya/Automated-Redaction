Automated Redaction Project
This project provides a web application for automated document redaction. It features a frontend built with Next.js and a backend server component to handle the redaction logic and data management.

Table of Contents
Tech Stack
Folder Structure
Prerequisites
Getting Started
Cloning the Repository
Installing Dependencies
Environment Variables
Database Setup
Running the Application
Development Mode
Production Build
Available Scripts
Tech Stack
Framework: Next.js
Language: TypeScript
Styling: Tailwind CSS
UI Components: Likely shadcn/ui (inferred from components.json)
Backend Server: Custom Node.js and Flask server (likely Express.js, inferred from the server directory and commit messages)
Linting: ESLint
Package Manager: npm
Folder Structure
.

├── public/            # Static assets served by Next.js
├── server/            # Custom backend server code (e.g., Express.js API)
├── src/               # Next.js application source code (pages, components, styles, utils)
├── .eslintrc.json     # ESLint configuration
├── .gitignore         # Git ignore rules
├── components.json    # Configuration for UI components (likely shadcn/ui)
├── new2.pdf           # Example/Test PDF document
├── next.config.ts     # Next.js configuration
├── package-lock.json  # Exact dependency versions
├── package.json       # Project metadata and dependencies
├── postcss.config.mjs # PostCSS configuration (for Tailwind CSS)
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
Prerequisites
Before you begin, ensure you have the following installed:

Node.js (Version 18.x or later recommended)
npm (Comes bundled with Node.js)

Getting Started
Follow these steps to set up the project locally.

1. Cloning the Repository
Bash

git clone <your-repository-url>
cd <repository-directory-name>
Replace <your-repository-url> with the actual URL of your Git repository and <repository-directory-name> with the name of the folder created after cloning.

2. Installing Dependencies
Install the project dependencies using npm:

Bash

npm install
3. Environment Variables
This project requires environment variables for configuration, particularly for the database connection and potentially other API keys or secrets.

Create a .env file in the root of the project directory.

Add the necessary environment variables. You'll likely need at least:

Code snippet

# Example .env file
DATABASE_URL="your_database_connection_string"

# Add any other required variables for the backend server or Next.js
# NEXT_PUBLIC_API_ENDPOINT=...
# SECRET_KEY=...
Replace "your_database_connection_string" with your actual database URL. Consult the prisma/schema.prisma file and server code (server/) for other required variables.

npm run dev
This command should typically start both the Next.js frontend and the custom backend server (depending on how the dev script is configured in package.json).

Open your browser and navigate to http://localhost:3000 (or the port specified in your configuration/console output).

Production Build
To build the application for production:
npm run build
To run the production build:

Bash

npm start
