# ShopIT - Full-Stack E-commerce Platform

A modern e-commerce application built with Node.js/Express backend and React frontend, featuring user authentication, product management, secure payment processing, and responsive design for seamless online shopping experience.

## Features

- **User Authentication**: Register, login, logout with JWT tokens
- **Password Recovery**: Forgot password functionality with email reset
- **Product Management**: CRUD operations for products with categories
- **Product Reviews**: User ratings and reviews system
- **Search & Filter**: Advanced product search and filtering
- **Responsive Design**: Mobile-friendly interface
- **Secure API**: Protected routes with authentication middleware

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Email functionality
- Error handling middleware

### Frontend
- React.js (coming soon)
- Modern UI/UX design

## Project Structure

```
shopIT/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── seeder/         # Database seeding
├── frontend/           # React frontend (coming soon)
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/dushf12/MERN---E_COMMERCE-WEBSITE.git
cd MERN---E_COMMERCE-WEBSITE
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Copy the example configuration file and update it with your values:
```bash
cp backend/config/config.env.example backend/config/config.env
```
Then edit `backend/config/config.env` with your actual values:
```env
PORT=6000
NODE_ENV=DEVELOPMENT
DB_LOCAL_URI=mongodb://localhost:27017/shopit
DB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_email_password
FROM_NAME=ShopIT
FROM_EMAIL=noreply@shopit.com
```

4. Run the development server
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/v1/register` - Register a new user
- `POST /api/v1/login` - User login
- `GET /api/v1/logout` - User logout
- `POST /api/v1/password/forgot` - Forgot password
- `PUT /api/v1/password/reset/:token` - Reset password

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/product/:id` - Get single product
- `POST /api/v1/admin/products` - Create new product (Admin)
- `PUT /api/v1/admin/product/:id` - Update product (Admin)
- `DELETE /api/v1/admin/product/:id` - Delete product (Admin)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Dushyanth - [@dushf12](https://github.com/dushf12)

Project Link: [https://github.com/dushf12/MERN---E_COMMERCE-WEBSITE](https://github.com/dushf12/MERN---E_COMMERCE-WEBSITE) 