# Crumbwell

Crumbwell is a full-stack bakery website that I built as a university project. Customers can browse the menu, add items to a cart and place orders. Behind that, there is an admin portal where the bakery's staff manage products, stock, employees, sales and reports.

I started with a simple React site and kept growing it into a proper system with a backend, a database and different user roles. It taught me a lot about how the frontend, the API and the data all connect.

## What it can do

**For customers**
- Browse the menu by category and sub category, with search
- View a detail page for each item
- Add items to a cart and change quantities
- Check out, and get an order and a printable bill
- See their past orders
- Pages like Gallery, Testimonials, FAQ, Blog, Events, Location, Catering and Gift cards

**For staff (admin, owner, salesperson)**
- Admin dashboard with full management
- Add and remove categories, sub categories and products
- Owner can order new products from suppliers and add them to stock
- Salesperson can make counter sales, and only sees the pages they need
- Orders page to follow and manage customer orders
- Employee management and monthly salary records
- Reports for sales, expenses, profit and loss, with date filters, a 1 month and 6 month view, and top selling products

## User roles

| Role | What they can do |
| --- | --- |
| Customer | Browse, cart, checkout, view their own orders |
| Salesperson | Counter sales and orders |
| Owner | Stock, suppliers, purchase orders, employees, reports |
| Admin | Everything, including managing the menu |

Access is checked on the server with JWT tokens, not just hidden in the interface. A customer who tries an admin route gets blocked by the API.

## Tech stack

- **Frontend:** React, Vite, React Router, Context API (for login state and the cart)
- **Backend:** Node.js, Express, JWT authentication
- **Database:** MongoDB
- **Tested with:** Postman

## Project structure

```
Crumbwell/
  client/   React frontend
  server/   Express API
  README.md
```

Some parts worth knowing about:

- `client/src`: pages, components, and the AuthContext and CartContext
- `server/routes`: separate route files for auth, menu, cart, orders, stock, employees, salaries and reports
- `server/middleware`: the token check and role check

## How it works

- Logging in returns a JWT token. The frontend keeps it and sends it with every request to protected routes.
- The cart lives on the server. It has a cart id and a session id, and it is removed once the order is placed.
- At checkout, the server saves the order, the order items and a bill (with tax and a delivery fee), and reduces the stock.
- Reports are calculated from paid bills (sales) and from received purchase orders and salaries (expenses), which gives the profit and loss.

## Database design

I designed the tables first with business rules and an ER diagram before building anything. The main entities are category, item, customer, orders, order items, bill, payment, review, employee, salary, supplier, stock, expense and sales, with primary and foreign keys connecting them.

## How to run it locally

You need Node.js and a MongoDB connection (local or Atlas).

**1. Clone the project**

```
git clone https://github.com/SyedaArooj90/Crumbwell.git
cd Crumbwell
```

**2. Start the server**

```
cd server
npm install
```

Create a `.env` file in the `server` folder. You can copy `.env.example` and fill in your own values. It needs things like:

```
PORT=your_port
JWT_SECRET=your_secret_here
MONGO_URI=your_mongodb_connection_string
```

Then run:

```
npm start
```

**3. Start the client** (in a second terminal)

```
cd client
npm install
npm run dev
```

Open the address that Vite prints in the terminal, usually http://localhost:5173.

## What I learned

- Building a REST API and testing every route in Postman, including the 401 and 403 cases
- Keeping login and cart state in React with the Context API
- Protecting routes on both the frontend and the backend
- Designing a database before coding, and keeping the API and the tables in sync
- Debugging real problems: wrong import paths, CORS, token headers and more

## What I want to add next

- Better design for the admin dashboard
- Online payment integration
- Automated tests
- Deploying the site online

## About me

I'm Arooj, a BSCS student focused on cybersecurity and full-stack development.
[GitHub](https://github.com/SyedaArooj90) | [LinkedIn](https://www.linkedin.com/in/arooj-fatima-3028a73b2)
