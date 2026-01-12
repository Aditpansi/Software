# Zero G Dashboard - Electron Build Instructions

## Development

To run the application in development mode:

```bash
npm start
```

Or with developer tools enabled:

```bash
npm run dev
```

## Building Executables

### Prerequisites

1. Install dependencies:
```bash
npm install --registry http://registry.npmjs.org/
```

2. Install electron-builder globally (optional):
```bash
npm install -g electron-builder
```

### Build for Current Platform

```bash
npm run dist
```

### Build for Specific Platforms

**Windows:**
```bash
npx electron-builder --win
```

**macOS:**
```bash
npx electron-builder --mac
```

**Linux:**
```bash
npx electron-builder --linux
```

### Build for All Platforms

```bash
npx electron-builder --win --mac --linux
```

## Output

Built applications will be in the `dist/` folder:

- **Windows**: `.exe` installer and portable `.exe`
- **macOS**: `.dmg` installer and `.app` bundle
- **Linux**: `.AppImage` portable executable

## File Sizes

- **Development**: ~150-200MB (includes dev tools)
- **Production**: ~100-150MB (optimized)
- **Compressed installer**: ~50-80MB

## Features

- ✅ Offline functionality
- ✅ Cross-platform compatibility
- ✅ Auto-updater ready
- ✅ Native menus and shortcuts
- ✅ Secure renderer process
- ✅ Professional installer

## Customization

### App Icon

Add icons in the root directory:
- `icon.ico` (Windows)
- `icon.icns` (macOS) 
- `icon.png` (Linux)

### App Information

Edit `package.json` to customize:
- App name and description
- Version number
- Author information
- Build configuration

### Window Settings

Modify `main.js` to adjust:
- Window size and constraints
- Title bar style
- Menu configuration
- Security settings

## Distribution

The built executables are completely standalone and don't require:
- Node.js installation
- Internet connection
- Additional dependencies

Users can simply download and run the executable file.