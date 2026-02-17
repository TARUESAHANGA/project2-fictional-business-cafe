# ☕ The Cafe Website

A fully responsive, modern cafe website built with HTML, CSS, and JavaScript. Features a complete shopping cart system, interactive menu navigation, and mobile-first responsive design.

## 🌟 Features

- 🎯 **Multi-page Structure** - Home, Menu, About, Products, Contact, and Cart pages
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🛒 **Shopping Cart System** - Add items to cart with quantity management and LocalStorage persistence
- 📋 **Interactive Menu** - Category filtering and search functionality
- 🎨 **Modern Design** - Clean, professional cafe-themed styling
- ⚡ **Fast Loading** - Optimized images and efficient code structure
- ♿ **Accessibility** - Skip links, ARIA labels, and keyboard navigation
- 🔍 **SEO Ready** - Semantic HTML structure and meta tags

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required
- Local server recommended for testing (Live Server extension or `python -m http.server`)



## 📁 Project Structure 
```
the-cafe-website/
├── 📁 assets
│   ├── 📁 css
│   │   ├── 🎨 styles.css              # Global/base styles
│   │   ├── 🎨 menu.css                # Menu page styles
│   │   ├── 🎨 about.css               # About page styles
│   │   ├── 🎨 products.css            # Products page styles
│   │   ├── 🎨 contact.css             # Contact page styles
│   │   ├── 🎨 cart.css                # Cart page styles
│   │   ├── 🎨 landingPage.css         # Homepage styles
│   │   ├── 🎨 normalize.css           # CSS reset/normalize
│   │   ├── 🎨 mediaQueries-400.css    # Small mobile (≤400px)
│   │   ├── 🎨 mediaQueries-600.css    # Mobile/Tablet (≤600px)
│   │   └── 🎨 mediaQueries-920.css    # Tablet/Desktop (≤920px)
│   ├── 📁 images
│   │   ├── 📁 landingPage
│   │   │   ├── 🖼️ butter-croissant.webp
│   │   │   ├── 🖼️ coffee-hero-section.png
│   │   │   ├── 🖼️ espresso.png
│   │   │   └── 🖼️ vanilla-latte-png.png
│   │   └── 🖼️ profile.jpg             # Developer profile picture
│   └── 📁 js
│       ├── 📄 main.js                 # Main JavaScript functionality
│       ├── 📄 cart.js                 # Cart logic and LocalStorage
│       ├── 📄 menu-cart.js            # Menu-specific cart interactions
│       ├── 📄 menu.js                 # Menu filtering and search
│       └── 📄 products.js             # Product page functionality
├── 📁 pages
│   ├── 🌐 menu.html                   # Menu page with categories
│   ├── 🌐 about.html                  # About/Portfolio page
│   ├── 🌐 products.html               # Products showcase
│   ├── 🌐 contact.html                # Contact information
│   └── 🌐 cart.html                   # Shopping cart page
├── 🌐 index.html                      # Homepage
└── 📝 readme.md                       # This file
```

## 🚀 Quick Start

### Direct Open
1. Clone or download the project files
2. Open `index.html` in your web browser
3. No build process required - runs directly in browser
4. Live Demo [The Cafe website](https://taruesahanga.github.io/the-cafe-website/)


## 🔗 Navigation Structure
Root: index.html (Homepage)
Pages: All other pages located in /pages/ directory
Paths:
From root: ./pages/menu.html
From pages: ../index.html to return home


## 🛠️ Built With
Frontend: HTML5, CSS3, JavaScript (ES6+)
Styling: CSS Grid, Flexbox, CSS Custom Properties (Variables)
Icons: Font Awesome
Fonts: Google Fonts (Jost)
Storage: LocalStorage for cart persistence across sessions
No Frameworks: Pure vanilla JavaScript implementation

## 🎨 Pages Overview
### 🏠 Homepage (index.html)
Hero section with cafe branding
Featured menu items
Customer reviews
Location/map section
Call-to-action buttons

### 📋 Menu (pages/menu.html)
Category Navigation: Breakfast, Lunch, Dinner, Kiddies Meal, Beverages, Specials
Search Functionality: Filter items by name or category
Add to Cart: Direct ordering from menu items
Responsive Design: Mobile-friendly category tabs and quick access dropdown

### 🛍️ Products (pages/products.html)
Product showcase with images
Add to cart functionality
Product categories and filtering

### 👤 About (pages/about.html)
Developer portfolio section
Skills showcase (HTML, CSS, JavaScript, Git/GitHub)
Featured projects gallery
Professional story and background

### 📞 Contact (pages/contact.html)
Contact information form
Location details
Social media links

### 🛒 Cart (pages/cart.html)
###### Shopping Cart Features:
- Add/remove items
 ![removing items](./assets/images/cart%20screen%20shots/delete%20item%20button.png)
 ![adding items](./assets/images/cart%20screen%20shots/adding%20to%20cart.png)
- Quantity adjustment (+/-)
 ![adjusting quantity](./assets/images/cart%20screen%20shots/increment%20and%20decreament%20buttons.png)
- Real-time price calculations
 ![calculations](./assets/images/cart%20screen%20shots/calculations.png)
- Order summary with total
- Clear cart to remove all items from the basket
 ![clear cart](./assets/images/cart%20screen%20shots/clear%20cart%20button.png)
- Persistent storage (survives page refresh)
- Checkout process simulation

### 🔧 Key Features Breakdown
#### Navigation System
* Multi-level Dropdown Menu: Smooth CSS animations for desktop
* Mobile Hamburger Menu: Touch-friendly controls with ARIA support
* Active Page Highlighting: Visual indicator for current page in nav
* Quick Access Dropdown: Native select element for mobile menu navigation
* Shopping Cart Integration: Real-time cart icon updates across all pages

### 📱 Mobile Features
Responsive images that scale with container width
Smooth scrolling for anchor links
Collapsible hamburger menu for space efficiency
Stacked layout optimization for touch interactions

### 🎓 Learning Opportunities
This project demonstrates:
HTML5 Semantic Structure - Proper use of the following tags
- header 
- nav
- main 
- section 
- footer
- CSS Grid & Flexbox - Modern layout techniques
- CSS Custom Properties - Variable usage for consistent theming
- JavaScript DOM Manipulation - Dynamic content updates
- Event Handling - Click, scroll, resize, and input events
- Local Storage API - Cart data persistence across sessions
- Responsive Design - Mobile-first approach with progressive enhancement
- Accessibility - ARIA labels, skip links, keyboard navigation, focus management

### 🗺️ Roadmap
```
Future enhancements planned:
[ ] User authentication system
[ ] Online payment integration (Stripe/PayPal)
[ ] Admin dashboard for menu management
[ ] Online reservation system
[ ] Newsletter subscription
[ ] Dark mode toggle
[ ] Multi-language support
```
### 🤝 Contributing
Feel free to fork this project and submit pull requests for improvements:
- Bug fixes
- Additional features
- Design improvements
- Performance optimizations
- Accessibility enhancements

### 📄 License
This project is open source and available under the MIT License.


## Validation
- HTML - https://validator.w3.org/#validate_by_input
- CSS - http://jigsaw.w3.org/css-validator/
- JavaScript - https://javascriptvalidator.net/

### HTML
#### index/home.html    
![index.html](./assets/images/validation%20screenshots%20HTML/html%20shots/home%20page%20index.html.png)
- errors found: Trailing slash on void elements
- errors found: Two consecutive hyphens in comment
![index.html](./assets/images/validation%20screenshots%20HTML/html%20shots/index.html%20with%20no%20errors%20.png)
- removed the trailing slash and extra hyphens

#### menu.html
![menu.html](./assets/images/validation%20screenshots%20HTML/html%20shots/menu.html%20no%20errors%20or%20warnings.png)

#### about.html
![about.html](./assets/images/validation%20screenshots%20HTML/html%20shots/about.html%20no%20errors%20or%20warnings.png)

#### products.html
![products](./assets/images/validation%20screenshots%20HTML/html%20shots/products.html%20no%20errors%20or%20warnings.png)

#### contact.html
![contact.html](./assets/images/validation%20screenshots%20HTML/html%20shots/contact.html%20no%20errors%20and%20warnings.png)

#### cart.html
![cart.html](./assets/images/validation%20screenshots%20HTML/html%20shots/cart.html%20no%20errors.png)
### CSS
#### styles/global.css
![styles.css](./assets/images/validation%20screenshots%20HTML/css%20shots/styles.css%20no%20errors.png)

#### about.css
![about.css](./assets/images/validation%20screenshots%20HTML/css%20shots/about.css%20no%20error%20found%20warnings.png)

#### cart.css
![cart.css](./assets/images/validation%20screenshots%20HTML/css%20shots/cart.css%20no%20errors.png)

#### contact.css
![contact.css](./assets/images/validation%20screenshots%20HTML/css%20shots/contact.css%20no%20errors.png)

#### landingPage.css
![landingPage.css](./assets/images/validation%20screenshots%20HTML/css%20shots/landingPage.css%20no%20errors.png)

#### menu.css
![menu.css](./assets/images/validation%20screenshots%20HTML/css%20shots/menu.css%20no%20errors.png)

#### mediaQueries.css 920, 600 & 400
![mediaQueries-920.css](./assets/images/validation%20screenshots%20HTML/css%20shots/mediaQueries-920.css%20no%20errors.png)
![mediaQueries-600.css](./assets/images/validation%20screenshots%20HTML/css%20shots/mediaQueries-600.css%20no%20errors.png)
![mediaQueries-400.css](./assets/images/validation%20screenshots%20HTML/css%20shots/mediaQueries-400.css%20no%20errors.png)

#### products.css
![products.css](./assets/images/validation%20screenshots%20HTML/css%20shots/product.css%202%20errors%20found.png)
- errors found: box shadow value not set
![products.css](./assets/images/validation%20screenshots%20HTML/css%20shots/product.css%20fixed%20errors%20found.png)
- errors fixed by adding box shadow values.

### JavaScript
#### cart.js
![cart.js](./assets/images/validation%20screenshots%20HTML/js%20shots/cart.js%20no%20errors.png)

#### menu.js
![menu.js](./assets/images/validation%20screenshots%20HTML/js%20shots/menu.js%20no%20errors.png)

#### menu-cart.js
![menu-cart.js](./assets/images/validation%20screenshots%20HTML/js%20shots/menu-cart.js%20no%20errors.png)

#### products.js
![products.js](./assets/images/validation%20screenshots%20HTML/js%20shots/products.js%20no%20errors.png)

#### main.js
![main.js](./assets/images/validation%20screenshots%20HTML/js%20shots/main.js%20errors%20found.png)
- Linting error: no inner declarations
- structural issue: calling functions that may not exist yet
![main.js no errors](./assets/images/validation%20screenshots%20HTML/js%20shots/main.js%20no%20errors.png)
- Lint rule: function declarations can not appear inside blocks
- Solution: move the function outside then call it inside the block


