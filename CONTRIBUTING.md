# Contributing to 8StarLabs UI

Thank you for your interest in contributing to 8StarLabs UI! This document will guide you through the contribution process and help you get started with developing components for our UI library.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

## Before You Start

### Check Existing Issues First

Before starting work on a new feature or bug fix, please:

1. **Browse the [Issues tab](https://github.com/8starlabs/ui/issues)** to see if there's already:
   - 🐛 **Bug Report** - Someone has reported the issue you want to fix
   - ✨ **Feature Request** - The component or feature you want to add has been requested
   - 🔒 **Report a Security Vulnerability** - Please review our [security policy](https://github.com/8starlabs/ui/security) for more details

2. **Look for issues labeled:**
   - `help wanted` - We're actively seeking contributors
   - `bug` - Confirmed bugs that need fixing

3. **If you find a relevant issue:**
   - Comment on it to let others know you're working on it
   - Ask questions if you need clarification
   - Reference the issue number in your PR

4. **If no issue exists:**
   - **For bugs:** Create a bug report with reproduction steps
   - **For features:** Open a feature request or discussion first

This helps avoid duplicate work and ensures your contribution aligns with the project's goals.

## About this repository

This repository is a monorepo.

- We use [npm](https://npmjs.com) for development.

## Getting Started

1. **Fork the repository**
   Click “Fork” on the top right of the main repo
   to create a copy under your own GitHub account.

2. **Clone on your local machine**

   ```bash
   git clone https://github.com/<your-username>/ui.git
   cd ui
   ```

3. **Add the upstream remote**
   This allows you to sync your fork with the original repo.

   ```bash
   git remote add upstream https://github.com/8starlabs/ui.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

## Development Workflow

1. **Create a New Branch**

   ```bash
   git checkout -b <username>/<your-feature-name>
   ```

2. **Making Changes**
   - Components should be added to the appropriate directory in `registry/8starlabs-ui`
   - Follow the existing component structure
   - Ensure your code follows our TypeScript and React best practices
   - Add proper documentation and types

3. **Component Guidelines**
   - Keep components modular and reusable
   - Include proper TypeScript types
   - Follow accessibility best practices
   - Add necessary comments for complex logic
   - Test your components thoroughly

4. **Update the Registry**
   After developing or updating any registry items (such as blocks or examples), update the root `registry.json` and run `npm run registry:build` to ensure the registry is up to date and your changes can be installed properly.

   If you’ve added a new registry item, please also run `npm run registry:generate-index` to update the `__index__.tsx` file.

5. **Commit Guidelines**
   We follow conventional commit messages:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `chore:` - All other tasks

Example: `git commit -m 'feat: add new Button variant'`

6. **Push your branch**

   ```bash
   git push origin <username>/<your-feature-name>
   ```

7. **Open a Pull Request (PR)**
   Go to your fork on GitHub and click “Compare & pull request”.

Please include:

- A clear title and description
- Screenshots or GIFs for UI changes
- Any related issue links
- The reason or context behind the change

## Project Structure

```
registry/8starlabs-ui/
├── blocks/          # Components to be added to registry
└── ui/              # Components that are installed via `npx shadcn@latest` commmand
```

## Pull Request Process

1. Update your fork to the latest upstream changes
2. Create your feature branch
3. Commit your changes following our commit guidelines
4. Push to your fork
5. Submit a Pull Request with a clear title and description
   - Link any related issues
   - Include screenshots for UI changes
   - Describe your changes and the rationale behind them

## Documentation Standards

- Be Clear: Use simple, clear language
- Be Complete: Document all props, methods, and use cases
- Be Practical: Include real-world examples
- Be Accessible: Always include accessibility information
- Be Consistent: Follow the existing documentation style

**Note:** PRs with incomplete documentation will not be accepted. Quality documentation is just as important as quality code.

## Style Guide

- Use TypeScript for all components
- Follow Next.js 14+ best practices
- Use Tailwind CSS for styling
- Maintain consistent naming conventions
- Keep components simple and focused
- Document props using TypeScript interfaces

## Requests for new components

If you have a request for a new component, please open a discussion on GitHub. We'll be happy to help you out.

## License

By contributing to 8StarLabs UI, you agree that your contributions will be licensed under the project's license.

Thank you for contributing to 8StarLabs UI! 🌟
