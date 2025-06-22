# How to Run the Build Command

To build your React application for production deployment, follow these steps:

## Prerequisites
1. Make sure you have Node.js installed on your computer
2. Navigate to your project directory in the terminal/command prompt
3. Ensure all dependencies are installed by running: `npm install`

## Running the Build Command

Open your terminal/command prompt and run:

```bash
npm run build
```

### Alternative Build Commands Available:
- `npm run build` - Production build (recommended for deployment)
- `npm run build:dev` - Development build

## What Happens During Build

1. Vite will compile and optimize your React application
2. All TypeScript files will be compiled to JavaScript
3. CSS will be processed and optimized
4. Assets will be bundled and optimized
5. A `dist` folder will be created in your project root

## Build Output Location

After running the build command, your deployment files will be located in:

```
your-project-folder/
└── dist/
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   ├── index-[hash].css
    │   └── [other-assets]
    └── [other-files]
```

## For Netlify Deployment

1. Run `npm run build`
2. Upload the entire `dist` folder to Netlify
3. Or connect your Git repository to Netlify for automatic builds

## Troubleshooting

If the build fails:
1. Check for TypeScript errors: `npm run lint`
2. Ensure all dependencies are installed: `npm install`
3. Check the terminal output for specific error messages
4. Make sure all imported files exist and paths are correct

## File Locations on Your PC

- **Source files**: `src/` folder
- **Build output**: `dist/` folder (created after build)
- **Configuration**: Root directory files (package.json, vite.config.ts, etc.)
