# AirPro Flight Booking Backend

Welcome to the **AirPro** backend repository. This is a robust, production-ready RESTful API built to handle the complex relational data, concurrency, and security required for a modern flight booking platform.

This document serves as the ultimate guide to understanding exactly how this system operates, how the code is structured, and how the data flows. **Anyone reading this will understand the entire backend architecture.**

---

## Technology Stack
* **Java 17** - Core programming language.
* **Spring Boot 3.x** - Application framework.
* **Spring Security + JWT** - Role-Based Access Control (RBAC) and stateless authentication.
* **Spring Data JPA / Hibernate** - ORM for database interactions.
* **MySQL** - Relational database.
* **Maven** - Dependency and build management.
* **Swagger (OpenAPI 3)** - Auto-generated interactive API documentation.

---

## Codebase Architecture

The project strictly follows the **Controller-Service-Repository** layered architecture to ensure separation of concerns:

* `com.airpro.controller`: The **Entry Points**. These classes listen for HTTP requests (GET, POST), validate incoming JSON payloads, and pass the data down to the services.
* `com.airpro.service`: The **Brains**. Contains all the business logic. This layer makes decisions, performs calculations, checks if an action is allowed, and handles transactions. 
* `com.airpro.repository`: The **Data Access Layer**. Interfaces extending `JpaRepository` to fetch or save data to MySQL without writing raw SQL.
* `com.airpro.entity`: The **Database Models**. Java classes mapped directly to MySQL tables.
* `com.airpro.dto`: Data Transfer Objects. Wrappers used to strictly control what data is received from the frontend and what data is sent back, ensuring internal database fields are never exposed accidentally.
* `com.airpro.config`: Configuration classes (Security, JWT, CORS).
* `com.airpro.exception`: Global error handlers that catch exceptions and return clean JSON error messages.

---

## Security & Authentication (JWT + RBAC)

The system uses **Stateless JWT Authentication**. 

1. **Login:** A user sends their email/password to `/auth/login`. The system verifies the credentials against the database and generates a secure String (JWT). This token contains the user's `email` and `role` (USER or ADMIN) cryptographically signed.
2. **The Filter:** Every single request made to the API must pass through the `JwtFilter`. The filter looks at the `Authorization: Bearer <token>` header, verifies the signature, and reads the user's role.
3. **Role-Based Access Control (RBAC):** 
   * Endpoints starting with `/api/admin/**` are strictly locked down by Spring Security (`.hasRole("ADMIN")`). If a normal user tries to access them, they get a `403 Forbidden`.
   * Endpoints like `/api/flights/search` are open for viewing.

---

## Database Architecture & The "Dependency Flow"

The database is highly normalized. This means data is split into specialized tables to avoid duplication and prevent impossible scenarios (like booking a flight that doesn't exist). 

Data must be created in this exact order:

### 1. Carrier & Seat Categories (The Foundation)
You must first define the Airlines (e.g., *Delta*) and the global Seat Categories (e.g., *Economy, First Class*).

### 2. Flight (The Route)
Represents a geographical route (e.g., *JFK to LAX*). 
* **Rule:** A Flight cannot exist without belonging to a Carrier.

### 3. Flight Schedule (The Timetable)
Pins a Route to a specific calendar date and time.
* **Rule:** You cannot schedule a flight if the generic Route doesn't exist.

### 4. Flight Seat Inventory (The Physical Seats)
This defines how many seats exist on a specific plane on a specific day, and how much they cost.
* **Rule:** Links **one Schedule** to **one Seat Category**. (e.g., *The May 10th JFK to LAX flight has 150 Economy seats available for $300 each*).

### 5. Booking (The Transaction)
The user's reservation. Links a User to a Schedule and Seat Category.

### 6. Payment
The confirmation of funds. Tied strictly to one Booking.

---

## The Booking Engine (How it actually works)

The most complex part of the system is the `BookingService`. When a user attempts to book a flight, the system must ensure the plane doesn't get overbooked.

1. **Transaction Safety:** The `createBooking` method is annotated with `@Transactional`. This means if *anything* goes wrong during the booking process, the database rolls back completely as if it never happened.
2. **Inventory Check:** The system queries the `FlightSeatInventory`. If `availableSeats < requestedSeats`, it throws an error immediately.
3. **Deduction:** If seats are available, the system mathematically deducts the requested seats from the inventory and saves it back to the database.
4. **Price Snapshot:** The system multiplies the number of seats by the current price of the seat in the inventory, calculating the `totalAmount` for the Booking. This ensures if the admin changes the price tomorrow, this user's booking price doesn't change.
5. **Reference Generation:** A unique 8-character alphanumeric `bookingRef` is generated.

---

## Handover Guide: Receiving & Integrating the Frontend

When the frontend team delivers the Angular (or React/Vue) codebase to you, you have two choices for how to integrate and run them together:

### Option A: Run Separately (Development Mode)
This is the easiest way to test everything locally.
1. Start your Spring Boot backend so it runs on `http://localhost:8080`.
2. Open the frontend code in a terminal and run its start command (e.g., `npm start` or `ng serve`). It will run on a port like `http://localhost:4200` or `3000`.
3. **Why it works:** Because we configured **Global CORS** in `SecurityConfig.java`, your backend allows the frontend running on a different port to successfully make API requests without the browser blocking them.

### Option B: Package Together as a Monolith (Production Mode)
If you want to package the frontend and backend into **one single runnable file** (so you don't have to start two servers), follow these steps:
1. Ask the frontend team to "build" their code for production (usually `npm run build` or `ng build`). This creates a `dist/` or `build/` folder filled with HTML, CSS, and JS files.
2. Copy all the contents of that `dist/` folder.
3. Paste them into your Spring Boot backend inside this exact folder: `src/main/resources/static/`.
4. Stop the backend, run `mvn clean install`, and start the backend again.
5. **The Result:** Now, when you go to `http://localhost:8080` in your browser, Spring Boot will automatically serve the frontend UI, and the UI will communicate with the backend APIs on the exact same port!

---

## Frontend Implementation Rules

The backend returns **every single response** (success or error) in a standardized JSON wrapper:

```typescript
export interface ApiResponse<T> {
  status: number;       // HTTP Status (e.g., 200, 400)
  message: string;      // Human-readable message
  data: T;              // The actual payload
}
```

**How the frontend connects:**
1. Send a POST to `http://localhost:8080/auth/login`.
2. Save `response.data` (the JWT token) to `localStorage`.
3. Configure an HTTP Interceptor in your frontend framework to attach `Authorization: Bearer <token>` to the headers of all outgoing requests targeting `http://localhost:8080/api/**`.

---

## Setup & Run Instructions

1. **Prerequisites:** Install Java 17 and MySQL.
2. **Database:** Create a MySQL database named `airpro`.
3. **Application Properties:** Ensure `src/main/resources/application.properties` contains your correct MySQL username and password.
4. **Run the Project:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
5. **Explore & Test:** Open `http://localhost:8080/swagger-ui.html` in your browser.

---

## Live Demo Script (For Presentations)

If you need to explain this project to stakeholders, follow this script using the Swagger UI:

1. **Security:** Use `POST /auth/register` to create an `ADMIN` user. Use `POST /auth/login` to retrieve the JWT. Paste the token into Swagger's top green **Authorize** button.
2. **Data Pipeline:** 
   * Use `POST /api/admin/carriers` to create an Airline.
   * Use `POST /api/admin/flights` to create a Route using the Carrier ID.
   * Use `POST /api/admin/schedules` to set a Date/Time using the Flight ID.
   * Use `POST /api/admin/inventory` to allocate seats and set prices.
3. **User Experience:** Use `GET /api/flights/search` to find the flight you just created based on origin, destination, and date.
4. **The Magic:** Use `POST /api/bookings` to reserve seats. Explain how the system calculates the price and reduces the inventory in real-time. Use `POST /api/payments` to finalize.
