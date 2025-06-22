# 🚀 Complete Deployment Guide for TomaShops FamousAI

This guide will help you deploy your website to the internet step-by-step.

## Option 1: Netlify (Recommended - Free & Easy)

### Step 1: Prepare Your Files
1. Make sure all your project files are in one folder
2. Open terminal/command prompt in your project folder
3. Run: `npm install` (installs dependencies)
4. Run: `npm run build` (creates production files)

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up" (use GitHub, Google, or email)
3. Once logged in, click "Add new site" → "Deploy manually"
4. Drag and drop your `dist` folder to the deploy area
5. Wait for deployment (usually 1-2 minutes)
6. Your site is live! You'll get a URL like `amazing-site-123.netlify.app`

### Step 3: Custom Domain (Optional)
1. In Netlify dashboard, click "Domain settings"
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS setup instructions

## Option 2: Vercel (Also Free & Fast)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
1. In your project folder, run: `vercel`
2. Follow the prompts:
   - Link to existing project? No
   - What's your project name? (press enter for default)
   - In which directory is your code? `./`
   - Want to override settings? No
3. Your site deploys automatically!

## Option 3: GitHub Pages

### Step 1: Push to GitHub
1. Create repository on GitHub
2. In your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

### Step 2: Enable GitHub Pages
1. Go to your GitHub repository
2. Click "Settings" tab
3. Scroll to "Pages" section
4. Source: "GitHub Actions"
5. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy
   on:
     push:
       branches: [ main ]
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm install
         - run: npm run build
         - uses: actions/upload-pages-artifact@v1
           with:
             path: ./dist
     deploy:
       needs: build
       runs-on: ubuntu-latest
       permissions:
         pages: write
         id-token: write
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - uses: actions/deploy-pages@v1
           id: deployment
   ```

## Troubleshooting

### Build Errors
- Run `npm install` first
- Check for TypeScript errors: `npm run lint`
- Make sure Node.js version is 18+

### Site Not Loading
- Check if `dist` folder was created
- Verify all files are uploaded
- Check browser console for errors

### 404 Errors on Refresh
Add `_redirects` file to `public` folder:
```
/*    /index.html   200
```

## Post-Deployment Checklist

✅ Site loads correctly  
✅ All pages work  
✅ Images display properly  
✅ Mobile responsive  
✅ Forms submit correctly  
✅ No console errors  

## Custom Domain Setup

### For Netlify:
1. Buy domain from registrar (Namecheap, GoDaddy, etc.)
2. In Netlify: Settings → Domain management → Add custom domain
3. Update DNS records at your registrar:
   - CNAME: www → your-site.netlify.app
   - A: @ → 75.2.60.5

### For Vercel:
1. In Vercel dashboard: Settings → Domains
2. Add your domain
3. Update DNS at registrar as instructed

## Performance Tips

- Enable gzip compression (automatic on Netlify/Vercel)
- Optimize images before uploading
- Use CDN for faster loading (included with hosting)
- Monitor site speed with Google PageSpeed Insights

## Security

- HTTPS is automatic with modern hosts
- Keep dependencies updated: `npm audit`
- Don't commit sensitive data to Git
- Use environment variables for API keys

---

**Congratulations!** Your site is now live on the internet! 🎉

Share your URL with friends and start getting visitors!