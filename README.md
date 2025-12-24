# JharkhandYatra Backend API

**SIH 2025 Problem Statement #25032**

[![Node.js](https://img.shields.io/badge/Node.js-24_LTS-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=fff)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-9.0-880000)](https://mongoosejs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

---

## Overview

RESTful API backend for **JharkhandYatra** - a smart digital platform for eco and cultural tourism in Jharkhand. This API provides endpoints for managing homestays, local guides, handicraft products, bookings, and user authentication.

**Frontend Repository:** [sih-2025-jharkhand-tourism](https://github.com/dbc2201/sih-2025-jharkhand-tourism)

**Postman Collection:** [JharkhandYatra API Collection](https://www.postman.com/itm-university-gwalior-dec-2025-mern-bootcamp/workspace/itm-university-gwalior-dec-2025-mern-bootcamp-workspace/collection/2753478-007116c2-3670-4c26-9313-73fb0d02a4b6?action=share&creator=2753478)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 24 LTS | JavaScript runtime |
| **Express.js** | 5.2.1 | Web framework |
| **MongoDB** | 8.0+ | Database |
| **Mongoose** | 9.0.2 | MongoDB ODM |
| **TypeScript** | 5.5.3 | Type safety |
| **tsx** | 4.21.0 | TypeScript execution |
| **Zod** | 4.2.1 | Schema validation |
| **JWT** | 9.0.3 | Authentication tokens |
| **bcrypt** | 6.0.0 | Password hashing |

---

## Features

- **User Authentication** - JWT-based registration, login, and profile management
- **Role-Based Access Control (RBAC)** - Four roles with granular permissions
- **Homestay Management** - CRUD operations for tribal homestay listings
- **Guide Profiles** - Manage local tour guide registrations
- **Product Catalog** - Handicraft marketplace with inventory
- **Booking System** - Reservation management with conflict detection
- **Unified Search** - Cross-entity search with autocomplete
- **Request Validation** - Zod-based schema validation with detailed errors
- **Pagination** - Cursor-based pagination on all list endpoints
- **Docker Support** - Easy local development with Docker Compose

---

## Quick Start

### Prerequisites

- Node.js 24 LTS ([Download](https://nodejs.org))
- MongoDB 8.0+ ([Download](https://www.mongodb.com/try/download/community) or use Docker)
- Docker & Docker Compose (recommended)
- npm

### Installation

```bash
# Clone repository
git clone <repository-url>
cd sih-2025-jharkhand-tourism-backend

# Install dependencies
npm install
```

### Environment Configuration

Copy the example environment file and update values:

```bash
cp .env.example .env
```

**Environment Variables:**

```env
# Server Configuration
PORT=2201
NODE_ENV=development
TZ=Asia/Kolkata

# MongoDB Configuration
MONGO_URI=mongodb://app_user:app_password@localhost:27017/sih-2025-jharkhand-tourism?authSource=sih-2025-jharkhand-tourism

# Docker MongoDB Settings
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DATABASE=sih-2025-jharkhand-tourism
MONGO_PORT=27017

# JWT Authentication
JWT_SECRET=your-super-secret-key-change-this-in-production-minimum-32-characters
JWT_EXPIRES_IN=7d

# bcrypt Configuration
BCRYPT_SALT_ROUNDS=12
```

### Run with Docker (Recommended)

```bash
# Start MongoDB container
docker compose up -d

# Start the development server
npm run dev
```

### Run without Docker

```bash
# Start MongoDB locally
mongod --dbpath /path/to/data

# Start the development server
npm run dev
```

Server will start at: `http://localhost:2201`

### Build for Production

```bash
# Compile TypeScript
npm run build

# Start production server
npm start
```

---

## API Documentation

### Base URL

```
http://localhost:2201/api/v1
```

### Response Format

All responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "fieldName", "message": "Validation error" }
  ]
}
```

---

### Endpoints

#### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Server health status |

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "message": "Server is running",
    "timestamp": "2025-12-23T00:00:00.000Z"
  }
}
```

---

#### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/auth/register` | Register new user | Public |
| `POST` | `/api/v1/auth/login` | Login and get token | Public |
| `GET` | `/api/v1/auth/me` | Get current user profile | Required |
| `PUT` | `/api/v1/auth/me` | Update profile | Required |

**Register Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "customer"
}
```

**Login Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Login Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "isActive": true,
      "createdAt": "2025-12-24T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

**Update Profile Body:**
```json
{
  "name": "New Name",
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Using Authentication:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

#### User Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| `admin` | Full system access | All operations |
| `host` | Homestay owners | Manage own homestays, view bookings |
| `guide` | Tour guides | Manage own profile, view bookings |
| `customer` | Tourists/visitors | Browse, book, manage own bookings |

---

#### Homestays

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/homestays` | List all homestays |
| `GET` | `/api/v1/homestays/:id` | Get homestay by ID |
| `POST` | `/api/v1/homestays` | Create new homestay |
| `PUT` | `/api/v1/homestays/:id` | Update homestay |
| `DELETE` | `/api/v1/homestays/:id` | Delete homestay |

**Query Parameters (GET /api/v1/homestays):**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `district` | string | Filter by district name |
| `minPrice` | number | Minimum base price |
| `maxPrice` | number | Maximum base price |

**Create Homestay Body:**
```json
{
  "title": "Mountain View Retreat",
  "description": "A peaceful retreat with stunning views",
  "propertyType": "entire",
  "location": {
    "address": "Ranchi Hills",
    "district": "Ranchi",
    "state": "Jharkhand",
    "coordinates": { "lat": 23.3441, "lng": 85.3096 }
  },
  "pricing": {
    "basePrice": 3500,
    "cleaningFee": 500,
    "weekendPrice": 4000
  },
  "capacity": {
    "guests": 6,
    "bedrooms": 3,
    "beds": 4,
    "bathrooms": 2
  },
  "amenities": ["wifi", "parking", "kitchen"],
  "images": ["https://example.com/image.jpg"]
}
```

---

#### Guides

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/guides` | List all guides |
| `GET` | `/api/v1/guides/:id` | Get guide by ID |
| `POST` | `/api/v1/guides` | Create new guide |
| `PUT` | `/api/v1/guides/:id` | Update guide |
| `DELETE` | `/api/v1/guides/:id` | Delete guide |

**Query Parameters (GET /api/v1/guides):**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `specialization` | string | Filter by specialization |

**Create Guide Body:**
```json
{
  "name": "Vikram Oraon",
  "bio": "Certified wildlife guide with 12 years experience",
  "specializations": ["wildlife", "trekking"],
  "languages": ["Hindi", "English", "Mundari"],
  "experience": "12 years",
  "location": {
    "district": "Latehar",
    "state": "Jharkhand"
  },
  "pricing": {
    "halfDay": 1500,
    "fullDay": 2500,
    "multiDay": 2000
  },
  "availability": "available"
}
```

---

#### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/products` | List all products |
| `GET` | `/api/v1/products/:id` | Get product by ID |
| `POST` | `/api/v1/products` | Create new product |
| `PUT` | `/api/v1/products/:id` | Update product |
| `DELETE` | `/api/v1/products/:id` | Delete product |

**Query Parameters (GET /api/v1/products):**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12, max: 100) |
| `category` | string | Filter by category |

**Create Product Body:**
```json
{
  "title": "Dokra Brass Elephant",
  "description": "Traditional brass figurine using lost-wax technique",
  "category": "handicrafts",
  "subcategory": "brass",
  "price": {
    "amount": 2400,
    "originalAmount": 3000,
    "discount": 20
  },
  "stock": 5,
  "images": ["https://example.com/elephant.jpg"]
}
```

---

#### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/bookings` | List all bookings |
| `GET` | `/api/v1/bookings/:id` | Get booking by ID |
| `POST` | `/api/v1/bookings` | Create new booking |
| `PUT` | `/api/v1/bookings/:id/cancel` | Cancel booking |

**Query Parameters (GET /api/v1/bookings):**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `status` | string | Filter by status (pending, confirmed, cancelled, completed) |

**Create Booking Body:**
```json
{
  "listingType": "homestay",
  "listingId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "checkIn": "2025-12-28",
  "checkOut": "2025-12-31",
  "guests": {
    "adults": 2,
    "children": 1
  },
  "guestDetails": {
    "name": "Priya Singh",
    "email": "priya@example.com",
    "phone": "+91-9876543210"
  },
  "specialRequests": "Early check-in if possible",
  "pricing": {
    "basePrice": 10500,
    "cleaningFee": 500,
    "total": 11000
  }
}
```

**Booking Number Format:** `JY-YYYY-NNNNNN` (e.g., `JY-2025-001001`)

---

#### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/search` | Unified search across entities |
| `GET` | `/api/v1/search/autocomplete` | Search suggestions |

**Query Parameters (GET /api/v1/search):**
| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (min 2 characters) |
| `type` | string | Filter by type (all, homestays, guides, products) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |

**Example:**
```
GET /api/v1/search?q=wildlife&type=guides
```

---

## Project Structure

```
sih-2025-jharkhand-tourism-backend/
├── docker/
│   └── mongo-init.js            # MongoDB initialization script
│
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── swagger.ts           # Swagger/OpenAPI config
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts   # Authentication handlers
│   │   ├── bookings.controller.ts
│   │   ├── guides.controller.ts
│   │   ├── health.controller.ts
│   │   ├── homestays.controller.ts
│   │   ├── products.controller.ts
│   │   └── search.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts       # JWT authentication
│   │   ├── rbac.middleware.ts       # Role-based access control
│   │   └── validation.middleware.ts # Zod validation
│   │
│   ├── models/
│   │   ├── bookings/
│   │   │   └── Booking.model.ts
│   │   ├── counters/
│   │   │   └── Counter.model.ts     # Auto-increment for booking numbers
│   │   ├── guides/
│   │   │   └── Guide.model.ts
│   │   ├── homestays/
│   │   │   └── Homestay.model.ts
│   │   ├── products/
│   │   │   └── Product.model.ts
│   │   └── users/
│   │       └── User.model.ts        # User with bcrypt password hashing
│   │
│   ├── routes/
│   │   ├── auth/
│   │   │   └── Auth.route.ts        # Authentication routes
│   │   ├── bookings/
│   │   │   └── Bookings.route.ts
│   │   ├── guides/
│   │   │   └── Guides.route.ts
│   │   ├── homestays/
│   │   │   └── Homestays.route.ts
│   │   ├── products/
│   │   │   └── Products.route.ts
│   │   ├── search/
│   │   │   └── Search.route.ts
│   │   └── index.ts                 # Route aggregator
│   │
│   ├── types/
│   │   ├── api.types.ts             # TypeScript interfaces
│   │   └── express.d.ts             # Express type extensions
│   │
│   ├── utils/
│   │   └── response.utils.ts        # Response helpers
│   │
│   ├── validation/
│   │   ├── schemas/
│   │   │   ├── auth.schema.ts       # Auth validation schemas
│   │   │   ├── booking.schema.ts
│   │   │   ├── common.schema.ts
│   │   │   ├── guide.schema.ts
│   │   │   ├── homestay.schema.ts
│   │   │   ├── product.schema.ts
│   │   │   └── search.schema.ts
│   │   └── index.ts                 # Validation exports
│   │
│   └── server.ts                    # Application entry point
│
├── tests/
│   ├── postman/
│   │   ├── collection.json          # Postman API collection
│   │   └── environment.json         # Postman environment
│   └── reports/                     # Test report output
│
├── .env.example                     # Environment template
├── docker-compose.yml               # Docker Compose config
├── package.json
├── tsconfig.json
└── README.md
```

---

## Database Schema

### Collections

| Collection | Description |
|------------|-------------|
| `users` | User accounts with authentication |
| `homestays` | Accommodation listings |
| `guides` | Tour guide profiles |
| `products` | Handicraft products |
| `bookings` | Reservations |
| `counters` | Auto-increment sequences |

### Indexes

**Users:**
- `email` (unique) - Login lookup
- `role` - Role-based filtering

**Homestays:**
- `location.district` - District filtering
- `pricing.basePrice` - Price range queries
- `status` - Active/inactive filtering
- `title, description` (text) - Full-text search

**Guides:**
- `specializations` - Specialization filtering
- `availability` - Availability status

**Products:**
- `category` - Category filtering
- `subcategory` - Subcategory filtering

**Bookings:**
- `listingId, checkIn, checkOut` - Availability checking
- `status` - Status filtering
- `bookingNumber` (unique) - Lookup by booking number

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server with hot reload |
| `build` | `npm run build` | Compile TypeScript to JavaScript |
| `start` | `npm start` | Start production server |
| `test:api` | `npm run test:api` | Run API tests with Newman |
| `test:api:report` | `npm run test:api:report` | Run tests with HTML report |
| `version:major` | `npm run version:major` | Bump major version |
| `version:minor` | `npm run version:minor` | Bump minor version |
| `version:patch` | `npm run version:patch` | Bump patch version |

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request / Validation Error |
| `401` | Unauthorized (authentication required) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Resource Not Found |
| `409` | Conflict (e.g., booking date conflict, email exists) |
| `500` | Internal Server Error |

---

## Testing

### API Testing with Postman/Newman

Import the Postman collection to test all endpoints:

**Collection URL:** [JharkhandYatra API Collection](https://www.postman.com/itm-university-gwalior-dec-2025-mern-bootcamp/workspace/itm-university-gwalior-dec-2025-mern-bootcamp-workspace/collection/2753478-007116c2-3670-4c26-9313-73fb0d02a4b6?action=share&creator=2753478)

```bash
# Run tests via command line
npm run test:api

# Generate HTML test report
npm run test:api:report
```

The collection includes:
- Pre-configured requests for all endpoints
- Example request bodies
- Environment variables for base URL
- Authentication token handling

---

## Docker Support

### Using Docker Compose

The project includes a ready-to-use Docker Compose configuration:

```bash
# Start MongoDB container
docker compose up -d

# View logs
docker compose logs -f mongodb

# Stop containers
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

**docker-compose.yml features:**
- MongoDB 7 with authentication
- Persistent data volume
- Automatic database initialization
- Health checks
- Custom network for services

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| **2.1.0** | Dec 2025 | Authentication, RBAC, Zod validation, Docker support |
| **2.0.0** | Dec 2025 | MongoDB integration (breaking change) |
| **1.9.0** | Dec 2025 | Server startup with DB connection |
| **1.8.0** | Dec 2025 | MongoDB search controller |
| **1.7.0** | Dec 2025 | Controllers updated for MongoDB |
| **1.6.0** | Dec 2025 | Booking model with Mongoose |
| **1.5.0** | Dec 2025 | Product model with Mongoose |
| **1.4.0** | Dec 2025 | Guide model with Mongoose |
| **1.3.0** | Dec 2025 | Homestay model with Mongoose |
| **1.2.0** | Dec 2025 | Counter model for sequences |
| **1.1.0** | Dec 2025 | Mongoose and database config |
| **1.0.0** | Dec 2025 | Initial release (in-memory) |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint for linting
- Write meaningful commit messages (conventional commits)
- Add JSDoc comments for functions

---

## Related Links

- **Frontend:** [sih-2025-jharkhand-tourism](https://github.com/dbc2201/sih-2025-jharkhand-tourism)
- **Live Demo:** [https://dbc2201.github.io/sih-2025-jharkhand-tourism/](https://dbc2201.github.io/sih-2025-jharkhand-tourism/)
- **Postman Collection:** [API Collection](https://www.postman.com/itm-university-gwalior-dec-2025-mern-bootcamp/workspace/itm-university-gwalior-dec-2025-mern-bootcamp-workspace/collection/2753478-007116c2-3670-4c26-9313-73fb0d02a4b6?action=share&creator=2753478)

---

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Smart India Hackathon 2025** for the opportunity
- **Jharkhand Tourism Department** for inspiration
- **MongoDB** for the excellent database
- **Express.js** community for the robust framework

---

**Built for Jharkhand Tourism & Community Empowerment**

**SIH 2025 - Problem Statement #25032**

---

**Version:** 2.1.0
**Status:** Production Ready
**Last Updated:** December 2025