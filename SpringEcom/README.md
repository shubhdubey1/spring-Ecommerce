<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java" alt="Java 17"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1-green?style=flat-square&logo=springboot" alt="Spring Boot 4.1"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/JPA-Hibernate-59666C?style=flat-square&logo=hibernate" alt="JPA/Hibernate"/>
  <img src="https://img.shields.io/badge/Maven-C71A36?style=flat-square&logo=apachemaven" alt="Maven"/>
  <img src="https://img.shields.io/badge/Lombok-ED8B00?style=flat-square" alt="Lombok"/>
</p>

<h1 align="center">&#x1f6d2; Spring-Ecommerce &mdash; Backend API</h1>
<p align="center">
  A <strong>RESTful e-commerce backend</strong> built with Spring Boot 4.1 and PostgreSQL.<br>
  Clean layered architecture with DTO-based data transfer. Loosely coupled. Production-ready structure.
</p>

---

## &#x1f4cb; Overview

Spring-Ecommerce is a full-featured e-commerce API handling both <strong>product management</strong> and <strong>order processing</strong>:

- <strong>Full Product CRUD</strong> &mdash; Create, read, update, and delete products
- <strong>Order management</strong> &mdash; Place orders with line items and automatic stock deduction
- <strong>DTO-based data transfer</strong> &mdash; Clean API contracts decoupled from persistence entities
- <strong>Managed entity relationships</strong> &mdash; @OneToMany / @ManyToOne between Orders and OrderItems
- <strong>Image handling</strong> &mdash; Multipart image upload and retrieval as BLOBs
- <strong>Keyword search</strong> &mdash; Case-insensitive search across name, brand, description, category
- <strong>Stock management</strong> &mdash; Real-time inventory tracking with checkout integration
- <strong>CORS enabled</strong> &mdash; Cross-origin support for SPA frontends

The entire backend is built with <strong>loose coupling</strong> in mind &mdash; swap the database, swap the frontend, swap the image storage strategy. Each layer is independently testable and replaceable.

---

## &#x1f3d7;&#xfe0f; Architecture

```
&#x250c;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2510;
&#x2502;                    REST Client                        &#x2502;
&#x2502;          (React SPA / Postman / Mobile App)           &#x2502;
&#x2514;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2518;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2510;
                       &#x2502;  HTTP / JSON (DTOs)
                       &#x25bc;
&#x250c;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2510;
&#x2502;                  Controller Layer                     &#x2502;
&#x2502;     ProductController.java                             &#x2502;
&#x2502;     OrderController.java                               &#x2502;
&#x2502;     &mdash; Accepts DTOs, delegates to services            &#x2502;
&#x2514;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2518;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2510;
                       &#x2502;  Method call
                       &#x25bc;
&#x250c;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2510;
&#x2502;                   Service Layer                       &#x2502;
&#x2502;     ProductService.java                                &#x2502;
&#x2502;     OrderService.java                                  &#x2502;
&#x2502;     &mdash; Business logic, DTO mapping, stock management    &#x2502;
&#x2514;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2518;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2510;
                       &#x2502;  JPA Repository
                       &#x25bc;
&#x250c;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2510;
&#x2502;                  Repository Layer                     &#x2502;
&#x2502;     ProductRepo.java (JPA)                             &#x2502;
&#x2502;     OrderRepo.java (JPA)                               &#x2502;
&#x2502;     &mdash; Database queries, custom JPQL                  &#x2502;
&#x2514;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2518;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2510;
                       &#x2502;  JDBC
                       &#x25bc;
&#x250c;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2510;
&#x2502;                     Database                          &#x2502;
&#x2502;               PostgreSQL (springecom)                 &#x2502;
&#x2514;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2518;
```

---

## &#x1f517; Loose Coupling

Each layer communicates through well-defined interfaces, never through shared state.

| Component | Swap To | Change Required |
|-----------|---------|-----------------|
| Database | MySQL, H2, MariaDB | `application.properties` only |
| Frontend | Any HTTP client | None |
| Image storage | AWS S3, local filesystem | `ProductService` only |
| Business logic | Mocked in unit tests | Zero Spring context needed |

---

## &#x1f4cc; Tech Stack

| Layer | Technology |
|-------|------------|
| Language | **Java 17** |
| Framework | **Spring Boot 4.1.0** |
| API Layer | Spring Web (REST) |
| ORM | Spring Data JPA / Hibernate |
| Database | PostgreSQL 16 |
| Build Tool | Maven |
| Boilerplate | Project Lombok |
| Testing | JUnit 5 + Spring Boot Starter Test |

---

## &#x1f4c2; Project Structure

```
SpringEcom/
&#x251c;&#x2500;&#x2500; pom.xml
&#x2502;
&#x251c;&#x2500;&#x2500; src/main/java/com/springcourse/springecom/
&#x2502;   &#x251c;&#x2500;&#x2500; SpringEcomApplication.java          # Entry point
&#x2502;   &#x2502;
&#x2502;   &#x251c;&#x2500;&#x2500; controller/
&#x2502;   &#x2502;   &#x251c;&#x2500;&#x2500; ProductController.java          # Product REST endpoints
&#x2502;   &#x2502;   &#x251c;&#x2500;&#x2500; OrderController.java            # Order REST endpoints
&#x2502;   &#x2502;   &#x2514;&#x2500;&#x2500; HelloController.java             # Health check
&#x2502;   &#x2502;
&#x2502;   &#x251c;&#x2500;&#x2500; model/
&#x2502;   &#x2502;   &#x251c;&#x2500;&#x2500; Product.java                     # Product JPA entity
&#x2502;   &#x2502;   &#x251c;&#x2500;&#x2500; Order.java                       # Order JPA entity (@OneToMany)
&#x2502;   &#x2502;   &#x251c;&#x2500;&#x2500; OrderItem.java                   # OrderItem JPA entity (@ManyToOne)
&#x2502;   &#x2502;   &#x2514;&#x2500;&#x2500; dtos/
&#x2502;   &#x2502;       &#x251c;&#x2500;&#x2500; OrderRequest.java              # Inbound order DTO
&#x2502;   &#x2502;       &#x251c;&#x2500;&#x2500; OrderResponse.java             # Outbound order DTO
&#x2502;   &#x2502;       &#x251c;&#x2500;&#x2500; OrderItemRequest.java          # Inbound line-item DTO
&#x2502;   &#x2502;       &#x2514;&#x2500;&#x2500; OrderItemResponse.java         # Outbound line-item DTO
&#x2502;   &#x2502;
&#x2502;   &#x251c;&#x2500;&#x2500; repository/
&#x2502;   &#x2502;   &#x251c;&#x2500;&#x2500; ProductRepo.java                # Product JPA repo + custom JPQL
&#x2502;   &#x2502;   &#x2514;&#x2500;&#x2500; OrderRepo.java                  # Order JPA repo
&#x2502;   &#x2502;
&#x2502;   &#x2514;&#x2500;&#x2500; service/
&#x2502;       &#x251c;&#x2500;&#x2500; ProductService.java             # Product business logic
&#x2502;       &#x2514;&#x2500;&#x2500; OrderService.java               # Order orchestration + stock mgmt
&#x2502;
&#x251c;&#x2500;&#x2500; src/main/resources/
&#x2502;   &#x2514;&#x2500;&#x2500; application.properties              # DB, JPA, server config
&#x2502;
&#x2514;&#x2500;&#x2500; src/test/java/
    &#x2514;&#x2500;&#x2500; SpringEcomApplicationTests.java       # Context load test
```

---

## &#x1f9e9; Data Model

### Product

| Field | Type | JPA / Notes |
|-------|------|-------------|
| `id` | `Integer` | `@Id`, auto via sequence `my_own_seq` |
| `name` | `String` | Product title |
| `description` | `String` | Product details |
| `brand` | `String` | Manufacturer / brand name |
| `price` | `BigDecimal` | &mdash; |
| `category` | `String` | Laptop, Mobile, Fashion, etc. |
| `releaseDate` | `Date` | JSON format `dd-MM-yyyy` |
| `stockQuantity` | `int` | Validated during checkout |
| `productAvailable` | `boolean` | Controls item visibility |
| `imageName` | `String` | Original filename |
| `imageType` | `String` | MIME type (e.g. `image/jpeg`) |
| `imageData` | `byte[]` | `@Lob` &mdash; raw image bytes |

### Order

| Field | Type | JPA / Notes |
|-------|------|-------------|
| `id` | `long` | `@Id` `@GeneratedValue` |
| `orderId` | `String` | UUID string, unique per order |
| `customerName` | `String` | Buyer name |
| `email` | `String` | Buyer email |
| `status` | `String` | Order status (e.g. PLACED) |
| `orderDate` | `LocalDateTime` | Timestamp when placed |
| `items` | `List<OrderItem>` | `@OneToMany(cascade = ALL)` |

### OrderItem

| Field | Type | JPA / Notes |
|-------|------|-------------|
| `id` | `long` | `@Id` `@GeneratedValue` |
| `product` | `Product` | `@ManyToOne` to Product |
| `quantity` | `int` | Number of units ordered |
| `totalPrice` | `BigDecimal` | price x quantity |
| `order` | `Order` | `@ManyToOne` (LAZY fetch) |

---

## &#x1f310; API Endpoints

All endpoints are prefixed with `/api`. CORS is enabled globally.

### Products

| Method | Endpoint | Description | Request |
|--------|----------|-------------|---------|
| `GET` | `/products` | List all products | &mdash; |
| `GET` | `/product/{id}` | Get product by ID | Path: `id` |
| `GET` | `/product/{id}/image` | Get product image | Path: `id` |
| `POST` | `/product` | Create a product | Multipart: `product` (JSON) + `imageFile` |
| `PUT` | `/product/{id}` | Update a product | Path: `id` + Multipart |
| `DELETE` | `/product/{id}` | Delete a product | Path: `id` |
| `GET` | `/products/search?keyword={query}` | Search products | Query: `keyword` |

### Orders

| Method | Endpoint | Description | Request |
|--------|----------|-------------|---------|
| `GET` | `/orders` | List all orders | &mdash; |
| `POST` | `/orders/place` | Place a new order | JSON body: `OrderRequest` DTO |

### Order Request Format

```json
{
  "customerName": "Shubh Dubey",
  "email": "shubh@example.com",
  "items": [
    { "productId": 101, "quantity": 2 },
    { "productId": 102, "quantity": 1 }
  ]
}
```

The API validates stock availability, deducts quantities, and returns an `OrderResponse` DTO with order details, line items, and computed totals.

### Search Implementation

The search endpoint runs a single <strong>case-insensitive JPQL query</strong> across four product fields:

```java
@Query("SELECT p FROM Product p WHERE " +
       "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
       "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
       "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
       "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
List<Product> searchProducByKeyword(String keyword);
```

---

## &#x2699;&#xfe0f; Configuration

```properties
spring.application.name=SpringEcom
server.port=8080

# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/springecom
spring.datasource.username=postgres
spring.datasource.password=your_password_here
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.datasource.hikari.auto-commit=false

# File upload
spring.servlet.multipart.max-file-size=30MB
spring.servlet.multipart.max-request-size=30MB
```

Set `ddl-auto` to `validate` in production and use environment variables for credentials.

---

## &#x1f680; Getting Started

### Prerequisites
- Java 17+
- PostgreSQL 16+ running with a database named `springecom`
- Maven (or use the bundled `mvnw` wrapper)

### Clone & Run

```bash
git clone https://github.com/shubhdubey1/spring-ecommerce.git
cd SpringEcom
```

**Windows**
```bash
mvnw.cmd spring-boot:run
```

**macOS / Linux**
```bash
./mvnw spring-boot:run
```

The API starts at:
```
http://localhost:8080
```

Verify it's running:
```bash
curl http://localhost:8080/api/products
```

---

## &#x1f9ea; Testing

```bash
./mvnw test
```

A context-loading test is included to verify that the Spring container starts correctly with all beans wired.

---

## &#x1f5a5;&#xfe0f; Frontend

The React SPA (in `ebuy/frontend/`) was built as part of the <strong>Telusko Spring Boot course</strong> curriculum, with UI refinements assisted by an LLM for component styling. Core logic, state management, API integration, and architecture were implemented independently.

---

## &#x1f9e0; What This Demonstrates

- Clean <strong>Controller &rarr; Service &rarr; Repository</strong> layering
- <strong>RESTful API design</strong> with proper HTTP methods and status codes
- <strong>DTO-based data transfer</strong> with clean API contracts (`OrderRequest` / `OrderResponse`)
- <strong>JPA entity relationships</strong> (@OneToMany, @ManyToOne) with cascading persistence
- <strong>Custom JPQL queries</strong> for cross-field search
- <strong>Order orchestration</strong> with automatic stock deduction and validation
- <strong>Multipart file handling</strong> for image upload
- <strong>CORS configuration</strong> for SPA compatibility
- <strong>Sequence-based ID generation</strong> with custom starting value
- <strong>Lombok</strong> for minimal boilerplate
- <strong>Spring Boot 4.1</strong> on <strong>Java 17</strong>

---

## &#x1f6a7; Future Improvements

- [ ] Add authentication (JWT / OAuth2)
- [ ] Payment gateway integration (Razorpay, Stripe)
- [ ] Pagination for product listings
- [ ] Input validation with `@Valid`
- [ ] Docker Compose for one-command setup
- [ ] Integration tests with Testcontainers

---

## &#x1f64c; Acknowledgements

- Backend architecture and concepts learned through the <strong>Telusko Spring Boot course</strong>
- Frontend built as part of the course curriculum with LLM-assisted UI enhancements

---

## &#x1f464; Author

**Shubh Dubey**<br>
GitHub: [@shubhdubey1](https://github.com/shubhdubey1)

---

## &#x1f4c4; License

This project is open source and available for learning and portfolio purposes.
