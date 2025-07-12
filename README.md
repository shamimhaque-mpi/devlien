# Deepline Framework

**Deepline** is a minimal and flexible Node.js backend framework designed to work seamlessly with:

- ✅ Nuxt.js
- ✅ Next.js
- ✅ NestJS
- ✅ Or run independently as a standalone server

It gives you a Laravel-like development experience while staying simple and unopinionated.

---

## 🚀 Quick Start with Nuxt.js

This guide will walk you through installing and using Deepline in a **Nuxt.js** project.

---

### 1️⃣ Install the Framework

In your Nuxt project root, install Deepline:

```bash
npm install https://github.com/shamimhaque-mpi/deepline
```

---

### 2️⃣ Run the Setup Command

Initialize the server environment using:

```bash
npx deepline setup
```

This will automatically create the following structure inside your project:

```
server/
├── app/
│   ├── Controllers/
│   └── Models/
├── database/
│   ├── migrations/
│   └── seeds/
├── routes/
├── .env
```

---

### 3️⃣ Configure `.env` File

Edit the generated `.env` file and set your database configuration:

```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=root
DB_PASSWORD=secret
```

> ✅ You must have a running MySQL/MariaDB database before proceeding.

---

## ✨ Generate Core Components

Deepline includes several command-line tools to help you build faster:

---

### 📂 Create a Controller

```bash
npx deepline make:controller HomeController
```

This will generate:  
`server/app/Controllers/HomeController.js`

---

### 📦 Create a Model

```bash
npx deepline make:model User
```

This will generate:  
`server/app/Models/User.js`

---

### 🧱 Create a Migration

```bash
npx deepline make:migration users
```

This will generate:  
`server/database/migrations/2025_06_23_XXXXXX_users.js`

Edit the file to define your table structure.

---

### 🔄 Run Migrations

```bash
npx deepline migrate
npx deepline migrate:rollback --all
```

This will execute all pending migrations and create tables in your database.

---

### 🚀 Create a HTTP Resource

```bash
npx deepline make:resource
```

You’ll be prompted to enter the resource name (e.g., `Product`) and Deepline will generate resource for you.

---

## 📚 Model Usage Example

In your controller:

```js
import User from "../Models/User";

// Fetch all users
let users = await User.get();

// or
let user = new User();
let users = await user.get();
```

More query methods coming soon...

---

## 🧾 Roadmap (Coming Soon)

- Authentication scaffolding  
- RESTful API boilerplate  
- Collection map
- Queue process

---

## 👨‍💻 Author

**Shamim Haque**  
[GitHub: @shamimhaque-mpi](https://github.com/shamimhaque-mpi)  
📧 Email: shamim.haque.dev@gmail.com

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).