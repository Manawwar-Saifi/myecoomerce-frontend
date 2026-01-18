# E-Commerce Frontend

React-based frontend for the e-commerce platform built with modern tools and best practices.

## Tech Stack

- **Framework:** React 19.0.0
- **Build Tool:** Vite 6.3.1
- **Routing:** React Router 7.5.2
- **State Management:**
  - TanStack React Query 5.81.5 (Server State)
  - React Context API (Global State)
- **HTTP Client:** Axios 1.9.0
- **UI Libraries:**
  - Material-UI (MUI) v7.0.2
  - Tailwind CSS v4.1.8
  - Lucide React (Icons)
  - Recharts & Chart.js
- **Forms:** React Hook Form 7.60.0
- **Notifications:** React Toastify 11.0.5
- **Real-time:** Socket.io-client 4.8.1
- **Payment:** Razorpay 2.9.6

## Project Structure

```
src/
├── pages/
│   ├── user-pages/          # User-facing pages
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── SingleProduct.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ...
│   └── admin-pages/         # Admin dashboard pages
│       ├── Dashboard.jsx
│       ├── Products.jsx
│       ├── Orders.jsx
│       ├── Users.jsx
│       └── ...
├── components/
│   ├── user-components/     # User UI components
│   ├── admin-components/    # Admin UI components
│   ├── ui/                  # Reusable UI components
│   ├── ErrorBoundary.jsx    # Error handling
│   └── ...
├── contexts/
│   ├── AuthContext.jsx      # Authentication state
│   ├── CartContext.jsx      # Cart state
│   ├── NotificationContext.jsx  # Real-time notifications
│   └── LoaderContext.jsx    # Loading state
├── hooks/
│   ├── useCart.js           # Cart operations
│   ├── useProducts.js       # Product queries
│   ├── useCategories.js     # Category queries
│   ├── useOrder.js          # Order mutations
│   └── ...
├── api/
│   ├── userAuth.js          # Auth API calls
│   ├── product.js           # Product API calls
│   ├── category.js          # Category API calls
│   └── ...
├── utils/
│   ├── Loader.jsx           # Loading component
│   ├── MiniLoader.jsx       # Small loader
│   ├── Toasty.jsx           # Toast notifications
│   ├── ProtectedRoute.jsx   # Route protection
│   └── ...
├── lib/
│   └── axiosInstance.js     # Axios configuration
├── App.jsx                  # Route definitions
└── main.jsx                 # App entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
```

3. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### User Features
- Product browsing with pagination
- Category filtering
- Shopping cart management
- Checkout with COD/Online payment
- Order tracking
- Product reviews
- User authentication
- Profile management

### Admin Features
- Dashboard analytics
- Product management (CRUD)
- Multi-image upload
- Category management
- Order management
- User management
- Review moderation
- Real-time notifications

## React Query Configuration

The app uses TanStack React Query for server state management with optimized settings:

```javascript
{
  staleTime: 1000 * 60 * 5,      // 5 minutes
  gcTime: 1000 * 60 * 30,        // 30 minutes
  refetchOnWindowFocus: true,     // Refetch on tab focus
  refetchOnMount: true,           // Refetch on component mount
  refetchOnReconnect: true,       // Refetch on network recovery
  retry: 1,                       // Retry failed requests once
}
```

### Query Invalidation Pattern

Mutations automatically invalidate related queries:

```javascript
// Add to cart
onSuccess: () => {
  queryClient.invalidateQueries(["cart", userId]);
}

// Update product
onSuccess: () => {
  queryClient.invalidateQueries(["products"]);
  queryClient.invalidateQueries(["product", productId]);
}
```

## Custom Hooks

### useCart
```javascript
const { mutateAsync: addToCart } = useAddToCart();
const { data: cart } = useCartByUserId(userId);
const { mutateAsync: updateQuantity } = useUpdateCartQuantity();
const { mutateAsync: removeItem } = useRemoveFromCart();
```

### useProducts
```javascript
const { data, isLoading } = useProducts({ page, limit, active });
const { data: product } = useSingleProduct(id);
```

### useAuth (Context)
```javascript
const { user, isLoading, login, logout, isAuthenticated } = useAuth();
```

## Routing

### Public Routes
- `/` - Home
- `/products` - Product listing
- `/product-detail/:id` - Product details
- `/category` - Categories
- `/login` - Login
- `/register` - Register

### Protected User Routes
- `/cart/:id` - Shopping cart
- `/checkout/:id` - Checkout
- `/profile/:id` - User profile

### Protected Admin Routes
All `/admin/*` routes require admin role:
- `/admin` - Dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/categories` - Category management

## State Management

### Server State (React Query)
- Product data
- Cart data
- Order data
- Category data
- User profile

### Global State (Context)
- Authentication
- Notifications
- Loading states

## Error Handling

### ErrorBoundary
Catches React errors app-wide:
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Protected Routes
Handles authentication and authorization:
```jsx
<ProtectedRoute role="admin">
  <AdminLayout />
</ProtectedRoute>
```

## Real-time Features

Socket.io integration for:
- Order notifications
- Low inventory alerts
- Review notifications
- User registration updates

## Recent Improvements

1. **Protected Routes** - Admin route protection enabled
2. **Error Boundaries** - App-wide error handling
3. **Loading States** - Improved loader components
4. **404/Unauthorized Pages** - Professional error pages
5. **React Query Optimization** - Fixed data synchronization
6. **Query Key Standardization** - Consistent invalidation

## Environment Variables

Required variables:
- `VITE_API_URL` - Backend API base URL (e.g., `http://localhost:8000/api`)

## Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## Development Notes

- Uses Vite for fast HMR
- ESLint configured for code quality
- Lazy loading for all pages
- Tailwind CSS for styling
- MUI components for complex UI
- Axios interceptors for auth headers
- Toast notifications for user feedback

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is part of a full-stack learning project.

## License

Educational purposes only.
