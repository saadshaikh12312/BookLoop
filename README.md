# BookLoop

> **Where books find another reader.**

BookLoop is a student-focused textbook marketplace that helps students **buy, sell, exchange, and donate academic books**. It provides a structured way for students to discover relevant books, create listings, send requests, and connect with book owners.

## Live Application

**Demo:** https://bookloop-8vh5.onrender.com/

---

## Overview

Students often have textbooks that are no longer needed while other students are looking for the same books at an affordable price. BookLoop addresses this problem by providing a dedicated platform for students to reuse academic books.

Users can:

- List books they no longer need.
- Search and filter available books.
- Sell, donate, or exchange books.
- Send requests to book owners.
- Accept or reject incoming requests.
- Track request-related notifications.
- Continue communication through the available contact flow.

---

## Features

### User & Authentication

- User signup, login, and logout.
- Session-based authentication.
- Passport Local Strategy for authentication.
- Protected routes for authenticated users.
- Authorization for user-owned resources.

### Book Listings

- Create, view, edit, and delete book listings.
- Add academic information such as title, subject, subject code, course, semester, university, and publication.
- Add book condition and pricing information.
- Choose an exchange type: Sell, Donate, or Exchange.
- Add location information.
- Upload book images using Cloudinary.
- Maintain a personal **My Books** collection.

### Search & Discovery

- Search books by title, subject, university, or location.
- Filter by course, condition, and exchange type.
- Sort listings by newest, lowest price, or highest price.

### Request System

- Send a request for a book.
- Prevent users from requesting their own listings.
- Prevent duplicate requests for the same book.
- Allow book owners to accept or reject requests.
- Track request status: Pending, Accepted, or Rejected.
- Display request-related notifications.
- Track read and unread messages.

### User Interface

- Responsive design for desktop and mobile devices.
- Bootstrap-based UI.
- Reusable EJS layouts and partials.
- Responsive navigation and empty-state handling.
- Dynamic filtering and sorting interactions.
- Informational pages for About, Help, Terms, Privacy, and Contact.

---

## Technology Stack

### Backend

- **Node.js**
- **Express.js 5**
- **MongoDB**
- **Mongoose**
- **Passport.js**
- **passport-local-mongoose**
- **express-session**
- **connect-mongo**
- **Joi**
- **Multer**
- **multer-storage-cloudinary**
- **Cloudinary**
- **connect-flash**
- **method-override**

### Frontend

- **EJS**
- **ejs-mate**
- **Bootstrap 5**
- **Font Awesome**
- **Custom CSS**
- **JavaScript**

### Deployment

- **Render**
- **MongoDB Atlas**
- **Cloudinary**

---

## Application Architecture

BookLoop follows a conventional **MVC (Model-View-Controller)** architecture.

```text
                    ┌──────────────────────┐
                    │       Browser        │
                    │    EJS + Bootstrap   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Routes         │
                    │    Express Router    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Controllers      │
                    │  Application Logic   │
                    └───────┬───────┬──────┘
                            │       │
                 ┌──────────┘       └──────────┐
                 ▼                             ▼
        ┌──────────────────┐          ┌──────────────────┐
        │     Models       │          │    Middleware    │
        │ Mongoose Schemas │          │ Auth/Validation  │
        └────────┬─────────┘          └──────────────────┘
                 │
                 ▼
        ┌──────────────────┐
        │     MongoDB      │
        │  Database Layer  │
        └──────────────────┘
                 │
                 ▼
        ┌──────────────────┐
        │    Cloudinary    │
        │   Image Storage  │
        └──────────────────┘
```

### Architecture Responsibilities

- **Routes** map HTTP requests to controller functions.
- **Controllers** contain application and database logic.
- **Models** define MongoDB data structures using Mongoose.
- **Middleware** handles authentication, authorization, validation, and error handling.
- **Views** render the user interface using EJS.
- **Cloudinary** stores uploaded book images.
- **MongoDB** stores application data and references to uploaded images.

---

## Project Structure

```text
BookLoop/
│
├── app.js
├── cloudinaryConfig.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
│
├── controllers/
│   ├── booksController.js
│   ├── requestController.js
│   ├── usersBookController.js
│   └── usersController.js
│
├── middlewares/
│   ├── authMiddlewares.js
│   ├── ExpErrors.js
│   └── wrapAsync.js
│
├── models/
│   ├── bookSchema.js
│   ├── requestSchema.js
│   └── userSchema.js
│
├── Schema/
│   ├── bookValidation.js
│   └── userValidation.js
│
├── routes/
│   ├── booksRoute.js
│   ├── pagesRoute.js
│   ├── requestsRoute.js
│   ├── usersBookRoute.js
│   └── usersRoute.js
│
├── public/
│   ├── css/
│   │   ├── variables.css
│   │   ├── main.css
│   │   ├── index.css
│   │   ├── form.css
│   │   └── show.css
│   └── js/
│       ├── main.js
│       ├── landing.js
│       ├── index.js
│       ├── show.js
│       └── account.js
│
└── views/
    ├── layouts/
    │   └── boilerplate.ejs
    ├── includes/
    │   ├── head.ejs
    │   └── foot.ejs
    ├── partials/
    │   ├── navbar.ejs
    │   └── footer.ejs
    ├── books/
    │   ├── index.ejs
    │   ├── new.ejs
    │   ├── edit.ejs
    │   └── show.ejs
    ├── user/
    │   ├── login.ejs
    │   ├── signup.ejs
    │   └── messages.ejs
    ├── pages/
    │   ├── landing.ejs
    │   ├── about.ejs
    │   ├── contact.ejs
    │   ├── help.ejs
    │   ├── privacy.ejs
    │   └── terms.ejs
    └── errors/
        ├── 404.ejs
        └── error.ejs
```

---

## Data Models

### User

Stores user information, authentication-related data, listing references, and request-related messages.

```text
User
├── name
│   ├── firstName
│   └── lastName
├── email
├── mobileNo
├── myBooks[]
└── messages[]
```

### Book

Stores information about an academic book listing.

```text
Book
├── title
├── description
├── subject
├── subjectCode
├── course
├── semester
├── university
├── publication
├── condition
├── price
│   ├── actualPrice
│   └── sellingPrice
├── location
├── exchangeType
├── ownerName
├── owner
└── images
```

### Request

Connects a requester with a book owner.

```text
Request
├── book
├── sender
├── owner
├── status
│   ├── pending
│   ├── accepted
│   └── rejected
└── timestamps
```

---

## Request Workflow

```text
Student discovers a book
          │
          ▼
     Sends request
          │
          ▼
   Request = Pending
          │
          ▼
      Book Owner
       /       \
      /         \
 Accept         Reject
   │               │
   ▼               ▼
Accepted         Rejected
   │
   ▼
Communication / Contact
```

---

## Security & Validation

BookLoop includes application-level security and validation mechanisms:

- Session-based authentication.
- Passport-based user authentication.
- Protected routes for authenticated users.
- Ownership-based authorization for book modifications.
- Request-state checks.
- Joi validation for submitted book data.
- Mongoose schema validation.
- Environment variables for sensitive credentials.
- MongoDB-backed sessions.
- Centralized Express error handling.

---

## Routes

### Public Pages & Authentication

| Method | Path | Description |
|---|---|---|
| GET | `/` | Landing page |
| GET | `/about` | About page |
| GET | `/help` | Help page |
| GET | `/terms` | Terms page |
| GET | `/privacy` | Privacy page |
| GET, POST | `/contact` | Contact page and submission |
| GET | `/signup` | Signup form |
| POST | `/signup` | Register user |
| GET | `/login` | Login form |
| POST | `/login` | Authenticate user |
| POST | `/logout` | Logout user |

### Books

| Method | Path | Description |
|---|---|---|
| GET | `/books` | Browse, search, filter, and sort books |
| GET | `/books/new` | Create listing form |
| POST | `/books` | Create a book listing |
| GET | `/books/:id` | View book details |
| GET | `/books/:id/edit` | Edit listing |
| PUT | `/books/:id` | Update listing |
| DELETE | `/books/:id` | Delete listing |
| GET | `/mybooks` | View user's listings |

### Requests

| Method | Path | Description |
|---|---|---|
| GET | `/request/:id` | Send a book request |
| GET | `/request/:id/accept` | Accept a request |
| GET | `/request/:id/reject` | Reject a request |
| GET | `/request/:id/seen` | Mark request message as read |
| GET | `/:id/messages` | View request messages |

---

## Local Setup

### Prerequisites

- Node.js
- npm
- MongoDB / MongoDB Atlas
- Cloudinary account

### Installation

```bash
git clone <repository-url>
cd BookLoop
npm install
```

Create a `.env` file:

```env
PORT=3000
SESSION_SECRET=your-session-secret
ATLAS_DB_URL=your-mongodb-connection-string
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret
```

Start the application:

```bash
node app.js
```

For development:

```bash
npx nodemon app.js
```

Open:

```text
http://localhost:3000
```

**Never commit `.env` or expose credentials in the repository.**

---

## Future Roadmap

- [ ] In-app chat after a request is accepted.
- [ ] Dedicated conversation and message models.
- [ ] Real-time messaging with Socket.IO.
- [ ] Unread chat message counts.
- [ ] Typing indicators.
- [ ] Online/offline user status.
- [ ] Improved notification system.
- [ ] Pagination for book listings.
- [ ] Advanced search and filtering.
- [ ] Admin moderation.
- [ ] Automated testing.
- [ ] Improved production security.
- [ ] CI/CD pipeline.
- [ ] Performance and caching improvements.

---

## Why BookLoop?

BookLoop goes beyond a basic CRUD application by combining:

- Authentication and authorization
- CRUD operations
- Search and filtering
- Request-based workflows
- User-to-user interaction
- Image upload and cloud storage
- MongoDB data relationships
- Session management
- Input validation
- Responsive UI/UX
- MVC architecture

The project demonstrates the design and implementation of a real-world student marketplace using the Node.js and Express ecosystem.

---

## License

This project uses the **ISC License**.
