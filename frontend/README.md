React + Vite Starter Template

This template provides a minimal and optimized setup to run React with Vite, including Hot Module Replacement (HMR) and basic ESLint configuration.

->Features
->React (latest)
->Vite (fast build tool)
->Hot Module Replacement (HMR)
->ESLint for code quality
->Lightweight and fast setup
->Available Plugins

Currently, two official plugins are supported for React:

1. Babel-based Plugin
@vitejs/plugin-react
Uses Babel (or OXC with rolldown-vite)
Supports Fast Refresh
2. SWC-based Plugin (Faster)
@vitejs/plugin-react-swc
Uses SWC (faster than Babel)
Recommended for better performance


React Compiler (Optional)

The React Compiler is not enabled by default due to its impact on development and build performance.

->To enable it, follow:
https://react.dev/learn/react-compiler/installation


--->ESLint Configuration (Recommended Upgrade)

For production-level apps, enhance ESLint with TypeScript support and stricter rules.

Suggested Improvements:
Use TypeScript
Enable type-aware linting
Add stricter rules for maintainability

->Official TypeScript template:
https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts

->typescript-eslint docs:
https://typescript-eslint.io