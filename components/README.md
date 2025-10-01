# Component System Documentation

## Overview
The navbar and footer have been externalized into reusable components to make maintenance easier. Now you only need to update the navbar or footer in one place and it will automatically update across all pages.

## File Structure
```
components/
├── navbar.html      # Navigation component
├── footer.html      # Footer component
└── README.md        # This file

scripts/
└── components.js    # Component loader utility
```

## How It Works

### 1. Component Files
- **`components/navbar.html`** - Contains the navigation HTML
- **`components/footer.html`** - Contains the footer HTML

### 2. Component Loader (`scripts/components.js`)
- Automatically loads navbar and footer components
- Sets active navigation states based on current page
- Initializes navigation functionality (hamburger menu, etc.)

## Usage

### For New Pages
Replace your static navbar and footer with component containers:

#### Before (Static):
```html
<body>
    <nav>
        <!-- Navigation HTML -->
    </nav>
    
    <!-- Page content -->
    
    <footer>
        <!-- Footer HTML -->
    </footer>
    
    <script src="scripts/nav.js"></script>
</body>
```

#### After (Components):
```html
<body>
    <div id="navbar-container"></div>
    
    <!-- Page content -->
    
    <div id="footer-container"></div>
    
    <script src="scripts/components.js"></script>
</body>
```

### For Existing Pages
1. Replace `<nav>...</nav>` with `<div id="navbar-container"></div>`
2. Replace `<footer>...</footer>` with `<div id="footer-container"></div>`
3. Add `<script src="scripts/components.js"></script>` before closing `</body>`
4. Remove `<script src="scripts/nav.js"></script>` (navigation functionality is now handled by components.js)

## Benefits

### 1. Centralized Maintenance
- Update navbar/footer in one place
- Changes automatically reflect across all pages
- No more copy-pasting HTML between pages

### 2. Consistency
- Guaranteed identical navbar/footer on all pages
- Automatic active state management
- Unified navigation behavior

### 3. Performance
- Components are cached by the browser
- Reduced HTML file sizes
- Faster loading after first visit

## Active States
The component loader automatically sets the correct active navigation state based on the current page:
- `index.html` → "PROJECTS" is active
- `about.html` → "ABOUT" is active  
- `contact.html` → "CONTACT" is active

## Updating Components

### To Update Navigation:
Edit `components/navbar.html` and the changes will appear on all pages.

### To Update Footer:
Edit `components/footer.html` and the changes will appear on all pages.

### To Update Navigation Functionality:
Edit `scripts/components.js` to modify how navigation works (hamburger menu, active states, etc.).

## Pages Already Converted
- ✅ `about.html` - Using component system

## Pages To Convert
- ⏳ `index.html`
- ⏳ `contact.html`
- ⏳ `blender.html`
- ⏳ `nothing.html`

## Technical Notes

### Error Handling
The component loader includes error handling for failed component loads and will log errors to the console.

### Browser Compatibility
Uses modern JavaScript features:
- `fetch()` API
- `async/await`
- `Promise.all()`

Supported by all modern browsers (Chrome 55+, Firefox 52+, Safari 10.1+).

### Fallback
If JavaScript is disabled, the page will still load but without navbar/footer. Consider adding `<noscript>` fallback content if needed.

## Example Implementation

Here's how the about.html page was converted:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- head content -->
</head>
<body>
    <div id="navbar-container"></div>
    
    <main class="about-main">
        <!-- page content -->
    </main>
    
    <div id="footer-container"></div>
    
    <script src="scripts/components.js"></script>
    <!-- other scripts -->
</body>
</html>
```