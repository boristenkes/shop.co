# shop.co

A full‑stack e‑commerce storefront and admin dashboard built with Next.js 15, TypeScript, Tailwind CSS, Neon Postgres + Drizzle ORM, Auth.js, Stripe and UploadThing.

- [Live Demo](https://bt-shop-co.vercel.app)
- [Source code](https://github.com/boristenkes/shop.co)

## Table of Contents

- [shop.co](#shopco)
  - [Table of Contents](#table-of-contents)
  - [Previews](#previews)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Author](#author)
    - [Boris Tenkeš](#boris-tenkeš)
  - [License](#license)

## Previews

Home
![Home page](https://898glvi4ys.ufs.sh/f/xoTuq3r8CcVaYkOZ3XTBZlCuSgWO97F86AGMTPIb53mVQDx1)

Products
![Products page](https://898glvi4ys.ufs.sh/f/xoTuq3r8CcVa69k2knX05UQopv4m31iCOndxNhZ9DXKAjcIf)

Product Details
![Product Details page](https://898glvi4ys.ufs.sh/f/xoTuq3r8CcVaTKO61uZz2rEGRskFUqJjYIQCLedtmwvSapuh)

Cart
![Cart page](https://898glvi4ys.ufs.sh/f/xoTuq3r8CcVamMl8VIjDIoOnYbsLzxhFdaJ06uGyA72EH5TM)

Products (admin)
![Products (admin) page](https://898glvi4ys.ufs.sh/f/xoTuq3r8CcVafPbsNE6CVuZB7UqojnkA5z9XLmdJvc6O3N2H)

Orders (admin)
![Orders (admin) page](https://898glvi4ys.ufs.sh/f/xoTuq3r8CcVaDOjccJh1xXkTjNrCbUw6IK5ZfPLYaqnp3JR8)

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

- Portfolio: [boristenkes.com](https://boristenkes.com)
- Email: [boris.tenkes.dev@gmail.com](mailto:boris.tenkes.dev@gmail.com)
- GitHub: [@boristenkes](https://github.com/boristenkes)
- LinkedIn: [boris-tenkes](https://linkedin.com/in/boris-tenkes)

## License

MIT &copy; 2025 Boris Tenkes
