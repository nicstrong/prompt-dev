# Prompt Dev


A modern AI chat application built with React, tRPC, Express.js and Vercel AI SDK.

This project began as an exploration into technologies I hadn’t used before, including:
- Express.js
- tRPC
- Tailwind CSS
- shadcn/ui
- Vercel AI SDK
- Turborepo (monerepos)
  
I was also curious to see how modern AI tools and workflows perform in a greenfield project, since most of my professional experience has been with legacy applications. Inspired by the amazing t3.chat—though this is a humble and much simpler imitation.

While it started as a learning project, my hope is to grow it into a comprehensive platform for prompt engineering and agent/assistant development.


## Features

- 🚀 **Modern Tech Stack**: Built with TypeScript, React, React Native, tRPC, Express.js.
- 📱 **Mobile App**: React Native app, Paper UI, and React Navigation.
- 🤖 **AI Integration**: Powered by Vercel AI SDK.
- 🔐 **Authentication**: Secure user authentication with Clerk
- 🗄️ **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- 🏗️ **Monorepo**: Organized with Turborepo for efficient development

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/prompt-dev.git
cd prompt-dev
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp apps/api/.env.example apps/api/.env
``` 

4. Configure your environment variables in `apps/api/.env`:
```bash
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/prompt_dev
OPENAI_API_KEY=your_openai_api_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

5. Run database migrations:
```bash
cd apps/api
pnpm db:migrate
```

6. Start the development servers:
```bash
# From the root directory
pnpm dev
```

The web app will be available at `http://localhost:5173` and the API at `http://localhost:3001`.

## Architecture

This project is organized as a monorepo with the following structure:

### Apps and Packages

- **`apps/web`**: React frontend application built with Vite
- **`apps/api`**: Express.js backend with tRPC endpoints
- **`apps/mobile`**: React Native mobile app, Paper UI, and React Navigation
- **`packages/shared-types`**: Shared TypeScript types and schemas
- **`packages/trpc-api`**: tRPC router definitions
- **`packages/eslint-config`**: Shared ESLint configurations
- **`packages/typescript-config`**: Shared TypeScript configurations
- **`packages/prettier-config`**: Shared Prettier configurations

### Project Structure

```
├── apps/
│   ├── api/          # Express.js backend
│   ├── web/          # React frontend
│   └── mobile/       # React Native mobile app
├── packages/
│   ├── shared-types/ # Shared TypeScript types
│   ├── trpc-api/     # tRPC router definitions
│   └── config/       # Shared configurations
└── docs/            # Documentation
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Turborepo](https://turbo.build/repo)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI capabilities powered by [Vercel AI SDK](https://sdk.vercel.ai/)
- Authentication by [Clerk](https://clerk.com/)
- Inspired by [t3.chat](https://t3.chat) b

## Mobile App

The mobile app is built with React Native and Material Design 3, using React Native Paper and React Navigation for UI and navigation. It shares types and API logic with the web and API apps via workspace packages.

### Features
- Material Design 3 theming and Paper UI components
- Drawer and tab navigation structure
- Shared authentication and API logic via Clerk and tRPC
- Consistent safe area and theming with `ScreenWrapper` and `PreferencesContext`

### Running the Mobile App
1. Install dependencies:
   ```bash
   cd apps/mobile
   pnpm install
   ```
2. Start the Metro bundler:
   ```bash
   pnpm start
   ```
3. Run on your device/emulator (using Expo or React Native CLI):
   ```bash
   pnpm android   # for Android
   pnpm ios       # for iOS
   ```
