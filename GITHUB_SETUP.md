# 🚀 GitHub Repository Setup Guide

This guide walks you through setting up the TomaShops FamousAI project on GitHub at https://github.com/toma-shops/TomaShops-FamousAI

## Quick Setup Steps

### 1. Repository Access
Ensure you have access to the GitHub repository:
- Repository owner should add you as a collaborator
- Or fork the repository to your own account

### 2. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/toma-shops/TomaShops-FamousAI.git
cd TomaShops-FamousAI

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Project Structure
The repository should contain:
```
TomaShops-FamousAI/
├── .github/workflows/     # GitHub Actions
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utilities
├── package.json         # Dependencies
├── vite.config.ts       # Build config
├── tailwind.config.ts   # Styling config
└── README.md           # Documentation
```

## Deployment Options

### Option 1: GitHub Pages (Free)
Automatic deployment is configured via GitHub Actions:
1. Push code to `main` branch
2. GitHub Actions builds and deploys automatically
3. Site available at: `https://toma-shops.github.io/TomaShops-FamousAI`

### Option 2: Netlify
1. Connect Netlify to GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Auto-deploy on push

### Option 3: Vercel
1. Import project from GitHub
2. Vercel auto-detects Vite configuration
3. Deploy with zero configuration

## Development Workflow

### Making Changes
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Commit changes
git add .
git commit -m "Add your feature description"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Code Quality
```bash
# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Repository Settings

### Branch Protection
Recommended settings for `main` branch:
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Include administrators

### GitHub Pages Setup
1. Go to repository Settings
2. Navigate to Pages section
3. Source: "GitHub Actions"
4. The workflow will handle deployment

### Environment Variables
For production deployment, set these in repository secrets:
- `VITE_SUPABASE_URL` (if using Supabase)
- `VITE_SUPABASE_ANON_KEY` (if using Supabase)

## Collaboration

### Issue Tracking
- Use GitHub Issues for bug reports
- Use issue templates for consistency
- Label issues appropriately

### Pull Requests
- Use descriptive titles
- Include screenshots for UI changes
- Reference related issues
- Request reviews from team members

### Code Reviews
- Review for functionality
- Check code style and conventions
- Test changes locally
- Approve when ready

## Troubleshooting

### Build Failures
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run lint

# Test build locally
npm run build
```

### Deployment Issues
- Check GitHub Actions logs
- Verify all files are committed
- Ensure build succeeds locally
- Check repository permissions

### Access Issues
- Verify repository permissions
- Check if repository is private/public
- Contact repository owner for access

## Next Steps

1. ✅ Repository setup complete
2. ✅ Development environment ready
3. ✅ Deployment pipeline configured
4. 🚀 Start building features!

---

**Ready to collaborate!** The repository is now set up for team development and automatic deployment.