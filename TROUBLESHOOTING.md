# 🔧 Troubleshooting Guide

Common issues and how to fix them.

## Build Issues

### "npm: command not found"
**Problem:** Node.js not installed  
**Solution:** 
1. Download Node.js from [nodejs.org](https://nodejs.org)
2. Install version 18 or higher
3. Restart terminal and try again

### "Module not found" errors
**Problem:** Dependencies not installed  
**Solution:**
```bash
npm install
```

### Build fails with TypeScript errors
**Problem:** Code syntax issues  
**Solution:**
```bash
npm run lint
```
Fix reported errors, then build again.

## Deployment Issues

### Site shows blank page
**Causes & Solutions:**
1. **Wrong folder uploaded**
   - Upload `dist` folder, not root folder
   - Make sure `npm run build` ran successfully

2. **JavaScript errors**
   - Open browser console (F12)
   - Fix any red error messages

3. **Missing index.html**
   - Check if `dist/index.html` exists
   - Rebuild if missing: `npm run build`

### 404 errors on page refresh
**Problem:** Single Page App routing  
**Solution:** Add `_redirects` file to `public` folder:
```
/*    /index.html   200
```

### Images not loading
**Causes:**
1. **Wrong paths** - Use relative paths: `./images/photo.jpg`
2. **Missing files** - Check images exist in `public` folder
3. **Case sensitivity** - Match exact filename case

### Slow loading
**Solutions:**
1. **Optimize images** - Compress before uploading
2. **Enable caching** - Automatic on Netlify/Vercel
3. **Check file sizes** - Keep under 1MB per image

## Development Issues

### "Port already in use"
**Problem:** Another app using port 5173  
**Solutions:**
1. Kill other processes: `pkill -f vite`
2. Use different port: `npm run dev -- --port 3000`

### Hot reload not working
**Solutions:**
1. Restart dev server: `Ctrl+C` then `npm run dev`
2. Clear browser cache: `Ctrl+Shift+R`
3. Check file permissions

### Styles not updating
**Problem:** CSS cache issues  
**Solutions:**
1. Hard refresh: `Ctrl+Shift+R`
2. Clear browser cache
3. Restart dev server

## Git/GitHub Issues

### "Permission denied" on push
**Problem:** Authentication issues  
**Solutions:**
1. Check GitHub credentials
2. Use personal access token instead of password
3. Set up SSH keys

### Large files rejected
**Problem:** Files over 100MB  
**Solutions:**
1. Add to `.gitignore`: `node_modules`, `dist`
2. Use Git LFS for large assets
3. Remove from history: `git filter-branch`

## Mobile Issues

### Site not responsive
**Check:**
1. Viewport meta tag in `index.html`
2. Tailwind responsive classes
3. Test on actual devices

### Touch events not working
**Solutions:**
1. Add touch event listeners
2. Test on real mobile devices
3. Use mobile-first CSS approach

## Performance Issues

### Slow loading
**Optimizations:**
1. **Compress images** - Use WebP format
2. **Lazy loading** - Load images on scroll
3. **Code splitting** - Split large bundles
4. **CDN** - Use hosting provider's CDN

### High memory usage
**Solutions:**
1. **Optimize images** - Reduce file sizes
2. **Remove unused code** - Tree shake dependencies
3. **Lazy load components** - Load on demand

## Browser Compatibility

### Site broken in older browsers
**Solutions:**
1. **Check browser support** - Use caniuse.com
2. **Add polyfills** - For missing features
3. **Test thoroughly** - Use BrowserStack

## Getting More Help

### Community Resources
- **Stack Overflow** - Search existing questions
- **GitHub Issues** - Check project issues
- **Discord/Slack** - Join developer communities

### Hosting Support
- **Netlify:** [docs.netlify.com](https://docs.netlify.com)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **GitHub Pages:** [docs.github.com](https://docs.github.com)

### Debug Tools
- **Browser DevTools** - F12 for console/network
- **Lighthouse** - Performance auditing
- **React DevTools** - Component debugging

---

**Still stuck?** Create an issue on GitHub with:
1. Error message (full text)
2. Steps to reproduce
3. Browser/OS information
4. Screenshots if helpful

We're here to help! 🤝