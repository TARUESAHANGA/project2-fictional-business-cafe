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


## 🚀 Quick Start

### Direct Open
1. Clone or download the project files
2. Open `index.html` in your web browser
3. No build process required - runs directly in browser


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
- Quantity adjustment (+/-)
- Real-time price calculations
- Order summary with total
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
Native select dropdown for quick menu access on small screens (≤400px)
Responsive images that scale with container width
Smooth scrolling for anchor links
Collapsible hamburger menu for space efficiency
Stacked layout optimization for touch interactions

### Menu Categories
1. ☕ Coffee & Espresso
2. 🍵 Tea & Beverages
3. 🥐 Fresh Pastries
4. 🥪 Lunch & Light Bites
5. 🍰 Desserts
6. 🍳 Kiddies Meal
7. ⭐ Daily Specials

## 🛠️ Browser Support
✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile browsers (iOS Safari, Chrome Android)

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
Future enhancements planned:
[ ] User authentication system
[ ] Online payment integration (Stripe/PayPal)
[ ] Admin dashboard for menu management
[ ] Online reservation system
[ ] Newsletter subscription
[ ] Dark mode toggle
[ ] Multi-language support

### 🤝 Contributing
Feel free to fork this project and submit pull requests for improvements:
Bug fixes
Additional features
Design improvements
Performance optimizations
Accessibility enhancements
📄 License
This project is open source and available under the MIT License.

### 🙏 Credits
Developer: Tarumbidzwa Sahanga - Frontend Web Developer
Location: Gateshead, Tyne and Wear, England
Fonts: Google Fonts (Jost)
Icons: Font Awesome
Images: Placeholder images from placeholder.com
Color Scheme: Inspired by modern cafe aesthetics

### 📞 Support
For questions or issues:
Create an issue in the repository
Check existing issues for solutions
Review the code comments for implementation details
Contact: taruesahanga@gmail.com
Built with ☕ and 💻 by Tarumbidzwa Sahanga