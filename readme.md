# Vehicle Booking Application

## User Credentials

- **Admin**
  - Email: `admin@example.com`
  - Password: `password123`
- **Approver**
  - Email: `approver@example.com`
  - Password: `password123`

## Database

- **Version:** PostgreSQL 16

## Frameworks and Libraries

- **Backend:** Node.js with Express.js
- **Frontend:** React.js

## Application Usage Guide

### Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/darrenjo/vehicle-booking-app.git
   cd vehicle-booking-app

   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Database**

   - Ensure PostgreSQL is installed.
   - Create a new database:
     ```sql
     CREATE DATABASE vehicle_booking;
     ```
   - Run the SQL script to create tables:

     ```sql
        CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE drivers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE vehicles (
        id SERIAL PRIMARY KEY,
        model VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        vehicle_id INT NOT NULL,
        user_id INT NOT NULL REFERENCES users(id),
        driver_id INT NOT NULL,
        approver_id INT NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        admin_approval VARCHAR(50) DEFAULT 'pending',
        approver_approval VARCHAR(50) DEFAULT 'pending',
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        INSERT INTO users (name, email, password, role) VALUES
        ('Test Admin', 'admin@example.com', '$2a$10$BSkw/GnY2VXIe2GZyw7.n.SXAzaEF/sGIiN9n7RPTf9GlX2Q3PGBC', 'admin'),
        ('Test Approver', 'approver@example.com', '$2a$10$PvHFedEHkmU3TO7Enmo.Bu0g2mhSE/nQYXm.5JoIgZsaWBjPqx136', 'approver');
     ```

4. **Configure Environment Variables**
   - Go to backend folder
   - add .env:
   ```bash
   DB_USER="your_db_user"
   DB_HOST="your_db_host"
   DB_NAME="your_db_name"
   DB_PASSWORD="your_db_password"
   DB_PORT=your_dbport
   JWT_SECRET="your_jwt"
   PORT=5000
   ```

### Running the Application

1. Install Dependencies **Backend**

   ```bash
   cd backend
   npm install express pg bcryptjs jsonwebtoken cors dotenv
   ```

2. Start the **Backend**

   ```bash
   npm run start
   ```

3. Install Dependencies **Frontend**

   ```bash
   cd frontend
   npm install axios react-router-dom
   ```

4. Start the **Frontend**

   ```bash
   npm start
   ```

5. Access the Application

   - Open your browser and navigate to http://localhost:3000
   - Log in using the provided credentials.

### Main Features

1. Login

   - Log in using admin or approver accounts.

2. Dashboard

   - View vehicle booking statistics and other information.

3. Booking Form

   - Create a new vehicle booking.

4. Booking Approval

   - Admin and approver can approve or reject vehicle bookings.

5. Logout

   - Log out from the application.
