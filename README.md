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

RESTful API backend for **JharkhandYatra** - a smart digital platform for eco and cultural tourism in Jharkhand. This API provides endpoints for managing homestays, local guides, handicraft products, and bookings.

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

---

## Features

- **Homestay Management** - CRUD operations for tribal homestay listings
- **Guide Profiles** - Manage local tour guide registrations
- **Product Catalog** - Handicraft marketplace with inventory
- **Booking System** - Reservation management with conflict detection
- **Unified Search** - Cross-entity search with autocomplete
- **Pagination** - Cursor-based pagination on all list endpoints
- **Validation** - Request validation with detailed error messages

---

## Quick Start

### Prerequisites

- Node.js 24 LTS ([Download](https://nodejs.org))
- MongoDB 8.0+ ([Download](https://www.mongodb.com/try/download/community) or use Docker)
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

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sih-2025-jharkhand-tourism
TZ=Asia/Kolkata
```

### Run Development Server

```bash
# Start MongoDB (if using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:8

# Start the development server
npm run dev
```

Server will start at: `http://localhost:5000`

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
http://localhost:5000/api
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
| `GET` | `/api/health` | Server health status |

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

#### Homestays

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/homestays` | List all homestays |
| `GET` | `/api/homestays/:id` | Get homestay by ID |
| `POST` | `/api/homestays` | Create new homestay |
| `PUT` | `/api/homestays/:id` | Update homestay |
| `DELETE` | `/api/homestays/:id` | Delete homestay |

**Query Parameters (GET /api/homestays):**
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
| `GET` | `/api/guides` | List all guides |
| `GET` | `/api/guides/:id` | Get guide by ID |
| `POST` | `/api/guides` | Create new guide |
| `PUT` | `/api/guides/:id` | Update guide |
| `DELETE` | `/api/guides/:id` | Delete guide |

**Query Parameters (GET /api/guides):**
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
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/:id` | Get product by ID |
| `POST` | `/api/products` | Create new product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |

**Query Parameters (GET /api/products):**
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
| `GET` | `/api/bookings` | List all bookings |
| `GET` | `/api/bookings/:id` | Get booking by ID |
| `POST` | `/api/bookings` | Create new booking |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking |

**Query Parameters (GET /api/bookings):**
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
| `GET` | `/api/search` | Unified search across entities |
| `GET` | `/api/search/autocomplete` | Search suggestions |

**Query Parameters (GET /api/search):**
| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (min 2 characters) |
| `type` | string | Filter by type (all, homestays, guides, products) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |

**Example:**
```
GET /api/search?q=wildlife&type=guides
```

---

## Project Structure

```
sih-2025-jharkhand-tourism-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── bookings.controller.ts
│   │   ├── guides.controller.ts
│   │   ├── health.controller.ts
│   │   ├── homestays.controller.ts
│   │   ├── products.controller.ts
│   │   └── search.controller.ts
│   │
│   ├── models/
│   │   ├── bookings/
│   │   │   └── Booking.model.ts
│   │   ├── counters/
│   │   │   └── Counter.model.ts  # Auto-increment for booking numbers
│   │   ├── guides/
│   │   │   └── Guide.model.ts
│   │   ├── homestays/
│   │   │   └── Homestay.model.ts
│   │   └── products/
│   │       └── Product.model.ts
│   │
│   ├── routes/
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
│   │   └── index.ts              # Route aggregator
│   │
│   ├── types/
│   │   └── api.types.ts          # TypeScript interfaces
│   │
│   ├── utils/
│   │   └── response.utils.ts     # Response helpers
│   │
│   └── server.ts                 # Application entry point
│
├── .env                          # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Database Schema

### Collections

| Collection | Description |
|------------|-------------|
| `homestays` | Accommodation listings |
| `guides` | Tour guide profiles |
| `products` | Handicraft products |
| `bookings` | Reservations |
| `counters` | Auto-increment sequences |

### Indexes

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
| `404` | Resource Not Found |
| `409` | Conflict (e.g., booking date conflict) |
| `500` | Internal Server Error |

---

## Testing with Postman

Import the Postman collection to test all endpoints:

**Collection URL:** [JharkhandYatra API Collection](https://www.postman.com/itm-university-gwalior-dec-2025-mern-bootcamp/workspace/itm-university-gwalior-dec-2025-mern-bootcamp-workspace/collection/2753478-007116c2-3670-4c26-9313-73fb0d02a4b6?action=share&creator=2753478)

The collection includes:
- Pre-configured requests for all endpoints
- Example request bodies
- Environment variables for base URL

---

## Docker Support

### Using Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:8
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://admin:password@mongodb:27017/jharkhand-tourism?authSource=admin
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
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

**Version:** 2.0.0
**Status:** Production Ready
**Last Updated:** December 2025
