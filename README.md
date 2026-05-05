# ✈️ AIRPRO: Enterprise Airline Reservation System

AIRPRO is a modern, full-stack airline reservation and management system designed to handle the end-to-end flow of flight searches, seat selection, booking operations, and administrative oversight. 

This document serves as the **Master Architectural Blueprint** for AIRPRO. It contains every detail necessary to understand, maintain, or rebuild the system from scratch.

---

## 🏗️ 1. Technology Stack

### **Frontend (Client-Side)**
*   **Framework:** Angular 19+ (Strictly Standalone Components, no `ngModules`).
*   **Styling:** Tailwind CSS (Utility-first framework for modern, responsive UI).
*   **Routing:** Angular Router with nested routes and lazy-loadable patterns.
*   **State Management:** RxJS (BehaviorSubjects) and Singleton Injectable Services (`BookingStateService`).
*   **Icons:** Google Material Symbols (Outlined).

### **Backend (Server-Side)**
*   **Framework:** Spring Boot 3.x (Java).
*   **Database:** MySQL.
*   **ORM:** Spring Data JPA / Hibernate.
*   **Security:** Spring Security with stateless JWT (JSON Web Tokens) authentication.
*   **Serialization:** FasterXML Jackson.

---

## 🗄️ 2. Database Schema & Entities

The system revolves around 8 core relational entities, deeply integrated with JPA associations:

1.  **`User`**: Core identity. Stores `name`, `email`, `password` (BCrypt hashed), `role` (`ROLE_USER`, `ROLE_ADMIN`), and loyalty `category` (`REGULAR`, `SILVER`, `GOLD`).
2.  **`Carrier`**: Airline companies (e.g., Emirates, Air India). Stores `name`, `discountPercentage`, and global `refundAllowed` policies.
3.  **`Flight`**: The **Master Route**. Defines a standard journey between an `origin` and `destination`, a `basePrice`, and links to a `Carrier`.
4.  **`FlightSchedule`**: The actual **Instance** of a flight. Links to a `Flight` and assigns a specific `travelDate`, `departureTime`, and `arrivalTime`.
5.  **`SeatCategory`**: Enumeration for seat tiers (`ECONOMY`, `PREMIUM_ECONOMY`, `BUSINESS`).
6.  **`FlightSeatInventory`**: The pricing and availability engine. Links a `FlightSchedule` to a `SeatCategory`, tracking `totalSeats`, `availableSeats`, and the specific `price` for that class on that date.
7.  **`Booking`**: The finalized reservation. Links a `User`, `FlightSchedule`, and `SeatCategory`. Tracks `seatsBooked`, `totalAmount`, unique `bookingRef` (PNR), and `status` (`CONFIRMED`, `CANCELLED`).
8.  **`Payment`**: Transaction ledger. Links to a `Booking`, storing `amount`, `paymentMethod`, `transactionId`, and `status`.

> **Critical Serialization Note:** Entities utilize `@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})` to prevent Jackson serialization crashes when encountering Hibernate `FetchType.LAZY` proxy objects.

---

## 🔌 3. Backend API Architecture (Endpoints & Controllers)

The backend exposes RESTful APIs wrapped in a standardized `ApiResponse<T>` envelope containing `status`, `message`, and `data`.

### **Auth Operations (`/auth`)**
*   `POST /auth/register`: Accepts `AuthRequest` (email, password, name, role). Hashes password, saves User.
*   `POST /auth/login`: Accepts `AuthRequest`. Validates credentials, generates and returns a JWT containing the user's email, name, and role.

### **Flight Operations (`/api/flights`)**
*   `GET /search`: Accepts `origin`, `destination`, `travelDate`.
    *   *Service Logic:* Queries `FlightScheduleRepository`. Maps entities to `FlightSearchResponse` DTOs, preventing N+1 queries. Fetches linked `FlightSeatInventory` to return a list of available seat classes and their real-time prices.
    *   *Transaction:* Uses `@Transactional(readOnly = true)` to safely initialize lazy collections.

### **Booking Operations (`/api/bookings`)**
*   `POST /create`: Accepts `BookingRequest` (userId, flightScheduleId, seatCategoryId, passengerCount, baseFare). Validates inventory, creates PNR, updates available seats, generates `Booking` record.
*   `GET /user/{userId}`: Retrieves all bookings for a specific customer.
*   `PUT /{id}/cancel`: Sets booking status to `CANCELLED` and restores seats to `FlightSeatInventory`.

### **Administrative Operations (`/api/admin`)** *[Secured: ROLE_ADMIN]*
*   `GET /users`, `GET /bookings`, `GET /carriers`, `GET /flights`, `GET /schedules`
*   `POST /carriers`: Creates a new airline carrier.
*   `POST /flights`: Creates a new Master Route (`FlightRequest` -> `flightNumber`, `carrierId`, `origin`, `destination`, `basePrice`).

---

## 🛡️ 4. Security & Authentication

### **Backend (`SecurityConfig.java`)**
*   **CORS:** Configured to allow `*` origins and all HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`).
*   **FilterChain:** Stateless session policy. `/auth/**` and `/api/flights/search` are `permitAll()`. `/api/admin/**` requires `hasRole("ADMIN")`. Everything else requires authentication.
*   **JwtFilter:** Intercepts incoming requests. Extracts the Bearer token from the `Authorization` header, decodes it using a secret key, validates expiration, and populates the Spring `SecurityContextHolder`.

### **Frontend (`auth-interceptor.ts`)**
*   Angular `HttpInterceptorFn` that automatically retrieves `jwt_token` from `localStorage` and appends `Authorization: Bearer <token>` to all outgoing `HttpClient` requests.

---

## 💻 5. Frontend Architecture & UI Flow

The Angular application is heavily componentized, utilizing Tailwind CSS for a premium, glassmorphism-inspired aesthetic.

### **State Management**
*   **`AuthService`**: Manages user sessions using an RxJS `BehaviorSubject<any>`. Parses the JWT payload to instantly inform the UI of the user's name and role (`ADMIN` vs `USER`).
*   **`BookingStateService`**: An in-memory injectable service acting as a pipeline. It holds the `origin`, `destination`, `travelDate`, `selectedFlight`, `selectedSeatsList`, `passengers` details, and `pricing` data as the user progresses through the multi-step checkout flow.

### **Routing Map (`app.routes.ts`)**
1.  **`/` (Home Component):**
    *   Hero section with a dynamic search bar.
    *   Features `<select>` dropdowns for Departure/Arrival, auto-converting human-readable cities (e.g., "New Delhi") into backend-compatible IATA codes (e.g., "DEL").
    *   Calls `FlightService.searchFlights()`. Results render as rich cards with dynamic seat class pricing.
2.  **`/auth` (Auth Modal Component):**
    *   Tabbed UI for Login / Sign Up. Dispatches to `AuthService`. Handles strict role-based redirects (Admins are pushed directly to `/admin/dashboard`).
3.  **Checkout Pipeline:**
    *   **`/booking/seats`**: An interactive 2D aircraft seat map array. Validates seat selections against passenger counts and selected fare classes.
    *   **`/booking/passengers`**: Dynamic reactive form generating input fields based on the number of required seats.
    *   **`/booking/payment`**: Simulated checkout gateway summarizing the `BookingStateService` payload.
    *   **`/booking/confirmation`**: Issues the finalized e-ticket with PNR and QR code visuals.
4.  **`/admin` (Administrative Layout Module):**
    *   Features a persistent sidebar navigation shell.
    *   **`/admin/dashboard`**: High-level statistical overview (Total Users, Revenue, Routes).
    *   **`/admin/flights` & `/admin/carriers`**: Full management tables with "Add" Modals passing data to `AdminDataService`.
    *   **`/admin/users` & `/admin/bookings`**: Data grid views to monitor operations.

---

## 🛠️ 6. Core Workflows (How It Actually Works)

### **The Search-to-Checkout Flow**
1. User selects "DEL" to "BOM" and a Date on `/` (Home).
2. Angular sends `GET /api/flights/search?origin=DEL&destination=BOM&travelDate=...`.
3. Backend searches `flight_schedules` where `flight.origin == DEL`. Returns DTO containing flight details and all attached `FlightSeatInventory` objects.
4. User clicks "Business Class ($500)".
5. Frontend sets `BookingStateService.selectedFlight` and routes to `/booking/seats`.
6. User picks seats -> enters passenger info -> submits payment.
7. Frontend packages this into a JSON `BookingRequest` and hits `POST /api/bookings/create`.
8. Backend confirms inventory, creates a `Booking` entity, generates a random 6-character PNR (`bookingRef`), and returns it.
9. UI redirects to `/booking/confirmation` to display the ticket.

### **The Administrator Flow**
1. Admin logs in. `AuthService` detects `ROLE_ADMIN` in the JWT payload and routes to `/admin/dashboard`.
2. Global `app.html` detects the URL contains `/admin` and aggressively hides the standard Header, Footer, and navigation links, revealing only the secure Admin Sidebar.
3. Admin navigates to Carriers -> creates "Emirates" (`POST /api/admin/carriers`).
4. Admin navigates to Flights -> creates Route "AI-101" from "DEL" to "BOM" attached to "Emirates" (`POST /api/admin/flights`).
5. *(Pending Feature)* Admin navigates to Schedules -> assigns "AI-101" to depart on Dec 25th, creating the `FlightSchedule` and automatically generating `FlightSeatInventory` entries so users can actually book it.

---

## 🚀 7. Required Next Steps for Production

To take this application to a fully complete, production-ready state, the following must be implemented:

1.  **Admin Flight Scheduling Interface**: The backend has `FlightSchedule` logic, but the Admin Dashboard lacks a UI to schedule Master Flights. Without this, the system requires direct database insertion to create searchable dates.
2.  **User Profile & Booking History Views**: Dead links currently exist in the user dropdown for `/profile` and `/bookings`. These components must be generated and hooked to `GET /api/bookings/user/{id}`.
3.  **Angular Route Guards**: Implement `CanActivate` guards (`AuthGuard`, `AdminGuard`) to structurally prevent unauthorized users from manually navigating to `/admin/**` or `/booking/**` via the URL bar.
4.  **Edit/Delete Capabilities**: Expand the Admin tables to support `PUT` and `DELETE` requests for full CRUD functionality. 

---
*Generated by Antigravity AI — Architectural Documentation*
