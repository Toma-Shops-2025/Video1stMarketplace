# 🤝 Contributing to TomaShops FamousAI

Thank you for your interest in contributing to TomaShops FamousAI! This guide will help you get started.

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Go to https://github.com/toma-shops/TomaShops-FamousAI
   # Click "Fork" button
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/TomaShops-FamousAI.git
   cd TomaShops-FamousAI
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Visit `http://localhost:5173`

## Development Workflow

### 1. Create a Branch
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Changes
- Follow the existing code style
- Write clean, readable code
- Add comments for complex logic
- Test your changes thoroughly

### 3. Commit Changes
```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add new product filtering feature"

# Or for bug fixes
git commit -m "fix: resolve cart total calculation issue"
```

### 4. Push and Create PR
```bash
# Push to your fork
git push origin feature/your-feature-name

# Go to GitHub and create Pull Request
```

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible

### React Components
- Use functional components with hooks
- Follow naming conventions (PascalCase)
- Keep components small and focused
- Use proper prop types

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── [ComponentName].tsx
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── lib/                # Utilities and helpers
└── types/              # TypeScript type definitions
```

### Styling
- Use Tailwind CSS classes
- Follow responsive design principles
- Maintain consistent spacing and colors
- Use CSS variables for theme colors

## Testing

### Before Submitting
```bash
# Run linting
npm run lint

# Build for production
npm run build

# Test the build
npm run preview
```

### Manual Testing
- Test on different screen sizes
- Check browser compatibility
- Verify accessibility features
- Test with different user scenarios

## Pull Request Guidelines

### PR Title Format
- `feat: add new feature description`
- `fix: resolve specific bug`
- `docs: update documentation`
- `style: improve UI/UX`
- `refactor: code improvements`

### PR Description
Include:
- What changes were made
- Why the changes were necessary
- Screenshots (for UI changes)
- Testing steps
- Related issues (if any)

### Review Process
1. Automated checks must pass
2. Code review by maintainers
3. Testing by reviewers
4. Approval and merge

## Issue Reporting

### Bug Reports
Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots/videos if helpful

### Feature Requests
Include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Mockups or examples (if applicable)

## Code of Conduct

### Be Respectful
- Use welcoming and inclusive language
- Respect different viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Be Collaborative
- Help others learn and grow
- Share knowledge and resources
- Provide helpful feedback
- Work together towards common goals

## Getting Help

### Resources
- [Project Documentation](README.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [GitHub Issues](https://github.com/toma-shops/TomaShops-FamousAI/issues)

### Contact
- Create an issue for bugs or features
- Join discussions in pull requests
- Reach out to maintainers for guidance

## Recognition

Contributors will be:
- Listed in the project README
- Credited in release notes
- Invited to join the core team (for significant contributions)

---

**Thank you for contributing!** Every contribution, no matter how small, helps make TomaShops FamousAI better for everyone. 🚀