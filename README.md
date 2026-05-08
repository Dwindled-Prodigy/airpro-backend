# AIRPRO - Airline Booking & Management System

Welcome to AIRPRO! Whether you are a senior developer or a complete beginner looking at programming for the very first time, this document will explain exactly how this system works from top to bottom.

---

## 🍼 The Basics: Understanding the System 

If you are brand new to programming, think of this project like a restaurant.

### 🤔 What is What? (The Concepts)
* **The Frontend (The Dining Area):** This is the website you actually see and click on. It's built with **Angular** (which builds the structure, like the tables and chairs) and **Tailwind CSS** (which provides the paint and decorations, making it look pretty).
* **The Backend (The Kitchen):** This is the invisible worker behind the scenes. When you click "Book Flight" on the frontend, the request goes to the backend. It's built with **Java** and **Spring Boot**. The backend does all the math, checks if seats are available, and processes the logic.
* **The Database (The Pantry):** This is where all the data is saved permanently. If the server turns off, the data is safe here. We use **MySQL** for this. It's basically a giant, super-fast Excel spreadsheet.
* **The API (The Waiter):** The Frontend and Backend are completely separate. The API is the messenger (the waiter) that takes your order from the Frontend, carries it to the Backend, and brings the food (data) back to you.
* **JWT (The VIP Wristband):** When you log in, the Backend gives you a "JSON Web Token" (JWT). It's like a VIP wristband. For every future click, you show the wristband so the Backend knows who you are without asking for your password again.

### 🎯 Which is Which? (Our Specific Tools)
* **AIRPRO Frontend:** Runs on `http://localhost:4200`. This is where users book tickets and admins manage the flights.
* **AIRPRO Backend:** Runs on `http://localhost:8080`. This is the brain listening for requests.
* **MySQL Database `airpro_db`:** Runs on port `3306`. This is the specific vault holding our data.
* **Endpoints:** These are the specific "doors" the Waiter goes to. For example, the Waiter goes to the `/api/auth/login` door to check your password.

### 🗺️ Where is What? (The Code Map)
If you open the folders in this project, here is where everything lives:
* **`/frontend` folder:** All the website code.
  * `frontend/src/app/components/`: The visual building blocks of the website (like the login box, the admin dashboard, the ticket receipt).
* **`/backend` folder:** All the server code.
  * `backend/src/main/java/com/airpro/controller/`: The "Doors" (APIs). This is where the Waiter knocks to deliver messages.
  * `backend/src/main/java/com/airpro/service/`: The "Chefs". This code does the heavy lifting, like calculating prices and generating tickets.
  * `backend/src/main/java/com/airpro/entity/`: The "Blueprints". This defines exactly what a "Flight" or a "User" looks like before it gets saved to the Database.

---
---

## 🏗️ Technology Stack (Technical Details)

### Backend
* **Java 17**
* **Spring Boot 3.5.14** (Spring Web, Spring Data JPA, Spring Security)
* **MySQL** (Relational Database)
* **Lombok** (Boilerplate reduction)
* **JJWT (0.11.5)** (JSON Web Tokens for stateless authentication)
* **Swagger/OpenAPI (2.5.0)** (API Documentation)

### Frontend
* **Angular 18.2.0** (Standalone Components architecture)
* **Tailwind CSS 3.4** (Utility-first styling, Container queries, Forms plugin)
* **RxJS** (Reactive programming and API integration)

---

## 💾 Database Architecture

The backend connects to a MySQL database named `airpro_db`. 

### ERD / Entities
1. **`User`**: System users and administrators. (Role: `USER` or `ADMIN`).
2. **`Carrier`**: Airline companies (e.g., Air India, Vistara). Includes fields for `discountPercentage` and `refundAllowed`.
3. **`Flight`**: Associated with a Carrier. Contains Origin, Destination, Base Price.
4. **`FlightSchedule`**: Specific instances of a Flight occurring on a specific `travelDate` with departure/arrival times.
5. **`SeatCategory`**: Pre-defined ENUMs (`ECONOMY`, `ECONOMY_PLUS`, `BUSINESS`).
6. **`FlightSeatInventory`**: The available/total seats for a specific Schedule + Category combo. Prices are dynamically generated here based on the flight's base price.
7. **`Booking`**: Holds PNR, total price, status (`CONFIRMED`, `CANCELLED`), and links to the `User` and `FlightSchedule`.
8. **`Passenger`**: Linked to a specific Booking.
9. **`Payment`**: Tracks transaction IDs and payment status.

---

## 🔐 Security & Authentication

### JWT Implementation (The "Gotchas")
* The system uses stateless JWT authentication.
* **CRITICAL SECURITY NOTE (For internal reference):** The JWT Secret Key is currently hardcoded in `JwtUtil.java` as: `MySuperSecretKeyForJwtTokenGeneration!123`. This was done explicitly to prevent "Access Denied" bugs upon server restarts, as the previous implementation used dynamically generated keys (which invalidated all active sessions on every reboot).
* **Interceptor:** The Angular frontend uses an `authInterceptor` to automatically inject the `Authorization: Bearer <token>` header on all requests if a token exists in `localStorage`.

### Role-Based Access Control (RBAC)
* `/api/auth/**` (Public endpoints: Login, Signup).
* `/api/admin/**` (Secured endpoints: Require `ADMIN` role).
* `/api/user/**` (Secured endpoints: Require `USER` role).

---

## ⚙️ Frontend Architecture

The Angular application heavily utilizes modern Angular features like Standalone Components, Signals (where applicable), and Reactive Services.

### 🌐 Global Resiliency & Error Handling
The application features a global `error-interceptor` paired with a `ServerStatusService` to actively monitor backend health.
* **Server Outage Detection:** If the API returns a `0` (Connection Refused), `503`, or `504` status code, the interceptor flags the server as offline.
* **UI Feedback:** A massive, un-closeable `SERVER IS DOWN` overlay automatically renders on top of the root `app.html` to block user interaction until the backend is restored.
* **Modal Recovery:** API POST failures (like duplicate entries or 500 errors) are caught within the component `.ts` files, displaying an inline red error message in the creation modals instead of silently failing and locking the UI.

### 🐛 Fixed Implementation Bugs (Internal Developer Notes)
1. **The Jackson Serialization Bug (Proxy 500 Error):**
   * *Issue:* Fetching Carriers or Users randomly threw `500 Internal Server Errors`.
   * *Cause:* Hibernate Lazy Loading was creating proxy objects (`$HibernateProxy$`) which Jackson couldn't serialize.
   * *Fix:* Added `@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})` to all entity classes.

2. **The "Empty Dashboard" Data Binding Bug:**
   * *Issue:* The Admin dashboard was successfully fetching data (Status 200), but tables appeared empty (showing "No carriers found"). 
   * *Cause:* The Angular components were evaluating `if (res.success)`, but the `ApiResponse.java` class only returns `status`, `message`, and `data` (no `success` boolean). Since `success` was undefined, it evaluated to false.
   * *Fix:* Updated `carriers.ts`, `flights.ts`, `bookings.ts`, `schedules.ts`, and `users.ts` to explicitly check `if (res.status === 200)` instead.

3. **Schedule Inventory Auto-Generation:**
   * When an Admin creates a `FlightSchedule` (via `/api/admin/schedules/full`), the `AdminService.java` automatically intercepts the creation and generates three `FlightSeatInventory` records (Economy, Economy Plus, Business) based on the `Flight`'s `basePrice` using standard multipliers.

---

## 🎤 Interview & Sales Pitch Preparation Guide

If you are presenting this project in a technical interview, a code review, or pitching it to a client, you can use the following Q&A and architecture explanations to demonstrate deep domain knowledge.

### 🌊 The Data Flow (How does a booking happen?)
1. **Search:** The user enters an origin, destination, and date. The Angular frontend calls the `FlightSearchController` via `GET /api/user/search`. The backend queries the database for matching `FlightSchedules`.
2. **Selection & Details:** The user selects a flight and enters passenger details. This data is temporarily stored in Angular's state or `localStorage`.
3. **Transaction Initiation:** Once payment is simulated, the frontend sends a massive JSON payload to `POST /api/user/bookings/create`.
4. **The Critical Database Transaction:** The `BookingService` takes over. Because it uses `@Transactional`, it guarantees ACID properties:
   - It verifies the `FlightSeatInventory` has enough `availableSeats`.
   - It deducts the seats from the database.
   - It generates a unique PNR (Passenger Name Record).
   - It saves the `Booking`, the `Passengers`, and the `Payment` records.
   - *If any step fails (e.g. seats ran out just a millisecond prior), the entire transaction rolls back, preventing ghost bookings.*

### 🧠 Key Architecture Decisions (The "Why?")
* **Why Spring Boot & Java?** Enterprise readiness. Airline systems require massive transactional integrity. Spring's `@Transactional` annotation ensures that database operations (like deducting a seat and charging a credit card) succeed or fail together.
* **Why Angular Standalone Components?** Modularity. By moving away from `NgModules` to Standalone Components, the application loads faster (lazy loading) and the codebase is much easier to read and test.
* **Why a REST API over Monolith?** Decoupling. By building a strict REST API, we can build an iOS app, an Android app, or a partner B2B integration tomorrow without changing a single line of backend code.

### 🚀 Scalability & Future-Proofing
If a client asks: *"What happens when we hit 10,000 bookings a second?"*
* **Stateless Authentication:** Because we use JWTs, the server doesn't store session data in memory. This means we can deploy 10 identical backend servers behind a Load Balancer, and they will all seamlessly authenticate users without needing to share session states.
* **Database Indexing:** We can add database indexes on high-traffic query columns like `travelDate`, `origin`, and `destination` in the `Flight` tables to speed up searches exponentially.
* **Caching (Future Step):** We can introduce Redis to cache the `FlightSchedules` since schedules don't change every second, drastically reducing database load.

### ❓ Common Technical Q&A

**Q: How do you prevent "Double Bookings" if two users click buy at the exact same millisecond?**
> **A:** "We leverage Relational Database locking and Spring Boot's `@Transactional` boundary. When the system updates the `FlightSeatInventory` to deduct a seat, it checks the current count. If the count drops below 0, it throws an exception and the entire transaction rolls back, safely notifying the user."

**Q: How do you handle security and user roles?**
> **A:** "We use Spring Security with a custom JWT filter. The JWT payload encodes the user's role (`ROLE_USER` or `ROLE_ADMIN`). Every request to `/api/admin/**` is intercepted by the backend. If the token doesn't have the `ADMIN` role, it rejects the request with a 403 Forbidden. The frontend also has an AuthGuard to prevent users from even seeing the admin pages."

**Q: What happens if the backend crashes while someone is using the site?**
> **A:** "We built a highly resilient frontend. Our Angular `error-interceptor` acts as a global net. If it detects a timeout or a Connection Refused (Status 0) error, it immediately broadcasts to a `ServerStatusService`. The UI then instantly overlays a 'Server is Down' blocker, preventing users from attempting doomed transactions and losing data until the server is rebooted."

**Q: Why didn't you use Tailwind classes everywhere instead of custom CSS?**
> **A:** "We use Tailwind for 95% of the styling because it's fast and standard. However, for highly custom animations or complex global resets (like the custom scrollbars or the glassmorphism blur effects), we extract those into `styles.css` to keep the HTML clean and reusable."

---

## 🚀 API Endpoints

### Auth Controller (`/api/auth`)
* `POST /login`: Accepts `{email, password}`, returns JWT.
* `POST /signup`: Accepts registration payload.

### Admin Controller (`/api/admin`)
* **GET/POST/DELETE** for `/carriers`, `/flights`, `/schedules`, `/users`, `/bookings`.
* `POST /schedules/full`: Custom endpoint to create a schedule and auto-generate seat inventories.

---

## 🏃‍♂️ How to Run the Application

**1. Start the MySQL Database**
* Ensure MySQL is running on port 3306.
* Default configuration looks for `root` with password `password`.

**2. Start the Backend (Spring Boot)**
```bash
cd backend
mvn spring-boot:run
```

**3. Start the Frontend (Angular)**
```bash
cd frontend
npm install
npm start
```
Navigate to `http://localhost:4200`. Use `admin@skyops.in` (Password: `Admin@123`) to access the Admin Dashboard.
