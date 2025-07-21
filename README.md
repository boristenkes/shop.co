# shop.co

A full‑stack, production‑ready e‑commerce storefront and admin dashboard built with Next.js 15, TypeScript, Tailwind CSS, Neon Postgres + Drizzle ORM, Auth.js, Stripe and UploadThing.

**Live demo:** https://bt-shop-co.vercel.app

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Author](#author)
4. [License](#license)

## Features

- **Product catalog** with categories, colors, stock levels, FAQ sections, and image galleries. Products are paginated
- **Search** by product name
- **Filtering** by price, color, size and/or category
- **Sorting** by date, price or rating. Ascending or descending
- **Shopping cart** (persistent) with quantity controls & total calculation
  - Supports both **authenticated users** (stored in database) and **guests** (stored in `sessionStorage`)
- **Coupons**: create/use discount codes with usage limits and type (percentage, fixed)
- **Checkout** powered by Stripe Checkout + webhook to create orders in database
- **Order management**
  - Customer: view order history, cancel pending orders
  - Admin: full CRUD on orders, status updates
- **PDF receipts** generated server‑side with jsPDF + AutoTable, stored via UploadThing, URL saved to the order for download/view access
- **User reviews** with ratings and comments on products
- **Newsletter subscribers** (email capture)
- **Admin dashboard**: protected routes under `/dashboard/*` for product, category, order, coupon and user management; as well as statistics overview
- **Rich‑text editing** for product details using Tiptap editor
- **Image uploads** for products via react-dropzone and UploadThing (type‑safe, server‑middleware)
- **Responsive design** (mobile‑first) with Tailwind CSS
- **Data fetching & state** via React Query and the App Router
- **Form handling & validation** with React Hook Form + Zod resolvers
- **Role‑based access**: Google OAuth login (`admin:demo` and `customer:demo` accounts are available for demonstrational purposes)

## Tech Stack

- **General**: React with Next.js v15 (App router + Server Actions) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Neon Postgres + Drizzle ORM
- **Client-side API handling**: Tanstack Query
- **Form handling and validation**: React Hook Form + Zod
- **Authentication**: Auth.js v5
- **Payment handling**: Stripe
- **File storage**: Uploadthing
- **Deployment**: Vercel
- **Other**: jsPDF, date-fns, js-cookie, slugify, ULID, DomPurify

## Author

### Boris Tenkeš

- Email: [boris.tenkes.dev@gmail.com](mailto:boris.tenkes.dev@gmail.com)
- GitHub: [@boristenkes](https://github.com/boristenkes)
- LinkedIn: [boris-tenkes](https://linkedin.com/in/boris-tenkes)

## License

MIT &copy; 2025 Boris Tenkes
