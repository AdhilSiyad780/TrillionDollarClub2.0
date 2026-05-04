# TrillionDollarClub

A production-ready full-stack web application built with FastAPI, React, Supabase Auth, MongoDB Atlas, and Cloudinary.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, Redux Toolkit, React Router, Axios |
| Backend | FastAPI (Python) |
| Auth | Supabase (email/password + Google OAuth) |
| Database | MongoDB Atlas |
| Images | Cloudinary |
| Hosting | Vercel |

---

## Project Structure

```
fullstack-app/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db/
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── product.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   └── product.py
│   │   ├── routes/
│   │   │   ├── users.py
│   │   │   ├── products.py
│   │   │   ├── admin.py
│   │   │   └── upload.py
│   │   └── services/
│   │       ├── user_service.py
│   │       ├── product_service.py
│   │       └── cloudinary_service.py
│   ├── requirements.txt
│   ├── vercel.json
│   ├── .env              ← never commit this
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── app/
    │   │   └── store.js
    │   ├── features/
    │   │   ├── auth/authSlice.js
    │   │   ├── users/usersSlice.js
    │   │   └── products/productsSlice.js
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   └── AdminPage.jsx
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Spinner.jsx
    │   │   │   └── ErrorMessage.jsx
    │   │   └── layout/
    │   │       └── Navbar.jsx
    │   ├── services/
    │   │   ├── supabase.js
    │   │   └── api.js
    │   ├── hooks/useAuth.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env              ← never commit this
    └── .env.example
```

---

## API Endpoints

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | User | Get current user profile |
| PUT | `/api/users/me` | User | Update name and avatar |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | List products with pagination and search |
| GET | `/api/products/{id}` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/{id}` | Admin | Update product |
| DELETE | `/api/products/{id}` | Admin | Delete product |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | List all users |
| PATCH | `/api/admin/users/{id}` | Admin | Promote or demote user |
| DELETE | `/api/admin/users/{id}` | Admin | Delete user |

### Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload/image` | User | Upload single image to Cloudinary |
| POST | `/api/upload/images` | User | Upload up to 10 images |

---

## Local Setup

### Prerequisites

- Node.js v18+
- Python 3.11+
- Git

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/fullstack-app.git
cd fullstack-app
```

### 2. Backend

```bash
cd backend

python -m venv venv

# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# Fill in your values in .env

uvicorn app.main:app --reload --port 8000
```

- API runs at `http://localhost:8000`
- Swagger docs at `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend

npm install

cp .env.example .env
# Fill in your values in .env

npm run dev
```

- App runs at `http://localhost:5173`

---

## Environment Variables

Copy the example files — never commit the real `.env` files.

### `backend/.env.example`

```env
SUPABASE_URL=
SUPABASE_PROJECT_REF=

MONGODB_URL=
MONGODB_DB_NAME=fullstack_db

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CORS_ORIGINS=["http://localhost:5173"]
APP_NAME=TrillionDollarClub API
```

### `frontend/.env.example`

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=http://localhost:8000
```

---

## Deployment

### Backend → Vercel

```bash
cd backend
vercel --prod
```

Add all env vars in Vercel dashboard → **Settings → Environment Variables**.
After adding, update `CORS_ORIGINS` to include your frontend URL then redeploy.

### Frontend → Vercel

```bash
cd frontend
vercel --prod
```

Add these env vars in Vercel dashboard:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_API_BASE_URL    ← your deployed backend URL
```

---

## Promoting a User to Admin

Use MongoDB Atlas UI:

1. Open cluster → Browse Collections → `fullstack_db` → `users`
2. Find the user by email
3. Set `is_admin` to `true`

---

## Supabase Configuration

1. Enable **Email/Password** under Authentication → Providers
2. For Google OAuth: Authentication → Providers → Google
3. Add redirect URLs under Authentication → URL Configuration:
   - `http://localhost:5173`
   - Your deployed frontend URL

---

## Features

- Email/password and Google OAuth via Supabase
- JWT verification using Supabase JWKS (RS256)
- Auto-creates MongoDB user on first login
- Role-based access control (admin vs user)
- Product catalogue with pagination and search
- Multi-image upload via Cloudinary
- Avatar upload via Cloudinary
- Admin panel — manage users, promote/demote, delete
- Mobile-responsive UI
- Futuristic black and white terminal design

---

## .gitignore

```
.env
__pycache__/
*.pyc
venv/
node_modules/
dist/
.vercel/
```

---

## License

MIT