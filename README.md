# MattressKing - E-commerce Website

A modern, responsive e-commerce website for mattresses and sleep products built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Clean, professional UI with consistent blue color scheme
- **Responsive Layout**: Mobile-first design that works on all devices
- **Product Catalog**: Comprehensive product listings with filtering and search
- **Shopping Cart**: Full cart functionality with persistent state
- **Checkout Process**: Complete checkout flow with multiple steps
- **Product Categories**: Organized product categories (mattresses, pillows, bedding, etc.)
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Mattress Finder Quiz**: Interactive quiz to help customers find the perfect mattress
- **Financing Options**: Information about financing and payment plans

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **State Management**: React Context API
- **Package Manager**: npm or pnpm
- **Icons**: Lucide React
- **Fonts**: Geist Sans

## 📁 Project Structure

```
usman/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── adjustable-bases/  # Adjustable bases page
│   ├── bedding/          # Bedding page
│   ├── beds/             # Beds page
│   ├── box-springs/      # Box springs page
│   ├── cart/             # Cart page
│   ├── checkout/         # Checkout page
│   ├── contact/          # Contact page
│   ├── financing/        # Financing page
│   ├── mattress-finder/  # Mattress finder quiz
│   ├── mattress-guide/   # Mattress guide page
│   ├── mattresses/       # Mattresses page
│   ├── pillows/          # Pillows page
│   ├── sale/             # Sale page
│   ├── sofas/            # Sofas page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── not-found.tsx     # 404 page
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── cart-drawer.tsx  # Shopping cart drawer
│   ├── category-filters.tsx # Category filters
│   ├── category-grid.tsx # Category grid
│   ├── featured-products.tsx # Featured products
│   ├── footer.tsx       # Footer component
│   ├── header.tsx       # Header component
│   ├── hero-section.tsx # Hero section
│   ├── horizontal-filter-bar.tsx # Filter bar
│   ├── mega-menu.tsx    # Mega menu
│   ├── popular-categories.tsx # Popular categories
│   ├── product-card.tsx # Product card component
│   ├── product-grid.tsx # Product grid
│   ├── products-layout.tsx # Products layout
│   ├── products-sidebar.tsx # Products sidebar
│   └── theme-provider.tsx # Theme provider
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── cart-context.tsx # Cart context
│   └── utils.ts         # Utility functions
├── public/              # Static assets
│   ├── mattress-image.svg # Custom mattress image
│   └── placeholder.*    # Placeholder images
├── styles/              # Additional styles
├── .gitignore          # Git ignore file
├── components.json     # UI components configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Dependencies and scripts
├── postcss.config.mjs  # PostCSS configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🎨 Design Features

- **Consistent Color Scheme**: All blue elements use `blue-900` for consistency
- **Pop-up Effects**: Cards have hover animations with lift effects
- **Custom Mattress Image**: SVG-based mattress illustration
- **Modern UI Components**: Built with Radix UI primitives
- **Smooth Animations**: CSS transitions and transforms
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd usman
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` from `.env.example` and set your keys.

## 📱 Pages

- **Home** (`/`) - Landing page with hero section and featured products
- **Mattresses** (`/mattresses`) - Product catalog with filtering
- **Pillows** (`/pillows`) - Pillow products
- **Bedding** (`/bedding`) - Bedding products
- **Adjustable Bases** (`/adjustable-bases`) - Adjustable bed bases
- **Box Springs** (`/box-springs`) - Box springs and bed frames
- **Cart** (`/cart`) - Shopping cart
- **Checkout** (`/checkout`) - Checkout process
- **Contact** (`/contact`) - Contact information
- **Financing** (`/financing`) - Financing options
- **Mattress Finder** (`/mattress-finder`) - Interactive quiz

## 🛒 Features

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart state
- Cart drawer component

### Product Filtering
- Filter by category, size, price, features
- Sort by popularity, price, rating
- Search functionality
- Popular categories quick filters

### Checkout Process
- Multi-step checkout
- Information collection
- Delivery options
- Payment processing

## 🎯 Key Components

### ProductCard
- Displays product information
- Add to cart functionality
- Star ratings
- Price display
- Hover animations

### Header
- Navigation menu
- Search bar
- Cart indicator
- Mega menu dropdowns

### FilterBar
- Category filters
- Price range slider
- Sort options
- Quick filters

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling with custom configuration in `tailwind.config.ts`.

### TypeScript
TypeScript is configured with strict mode enabled. Configuration is in `tsconfig.json`.

### Next.js
Next.js is configured with the app router. Configuration is in `next.config.mjs`.

## 📦 Dependencies

### Core Dependencies
- `next`: 15.2.4
- `react`: 18.3.1
- `react-dom`: 18.3.1
- `typescript`: 5.9.2

### UI Dependencies
- `@radix-ui/*`: UI primitives
- `tailwindcss`: CSS framework
- `lucide-react`: Icons
- `class-variance-authority`: Component variants

### Development Dependencies
- `@types/react`: React TypeScript types
- `@types/node`: Node.js TypeScript types
- `eslint`: Code linting
- `postcss`: CSS processing

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The project can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

## 🔄 Recent Updates

### Product Variant Enhancements

This update adds new fields to product variants in the admin panel and database:

#### New Fields Added
- **length** (VARCHAR(100)) - Product length
- **width** (VARCHAR(100)) - Product width  
- **height** (VARCHAR(100)) - Product height
- **availability** (BOOLEAN) - Whether the variant is available for purchase

#### Database Changes
- Added new columns to `product_variants` table
- Created migration script: `migrations/add-variant-dimensions-availability.sql`
- Migration runner: `run-migration.js`

### Dimensions & Specifications Enhancements

This update significantly enhances the Dimensions & Specifications section in the product adding form:

#### New Features
- **Editable Headings**: All dimension field headings can now be customized
  - Mattress Size
  - Maximum Height
  - Weight Capacity
  - Pocket Springs
  - Comfort Layer
  - Support Layer
- **Multiple Image Upload**: Admins can add unlimited images to the dimensions section
- **Image Management**: Upload, preview, and remove dimension images with drag-and-drop support

#### Database Changes
- Added editable heading columns to `product_dimensions` table
- Created new `product_dimension_images` table for storing multiple images
- Created migration script: `migrations/add-dimension-images.sql`
- Migration runner: `run-dimension-migration.js`

#### UI Improvements
- Enhanced Dimensions & Specifications section with image upload interface
- Editable heading inputs above each dimension field
- Image preview and management controls
- Responsive grid layout for better organization

### Running Migrations

To apply the database changes, run the appropriate migration script:

```bash
# For variant enhancements
node run-migration.js

# For dimension enhancements (safe version)
node run-safe-dimension-migration.js
```

Make sure you have the required environment variables set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Troubleshooting Database Errors

If you encounter the error `ERROR: 42P07: relation "product_dimensions" already exists`, this means the database already has some of the required tables. The solution is to use the safe migration script:

1. **Use the safe migration**: Run `node run-safe-dimension-migration.js` instead of the regular migration
2. **Check database state**: Use `node check-database-state.js` to see which tables already exist
3. **Safe migration features**: The safe migration automatically checks for existing tables and columns before creating them

The safe migration will:
- Check if tables exist before creating them
- Add only missing columns
- Handle existing constraints gracefully
- Provide detailed feedback about what was created vs. what already existed
