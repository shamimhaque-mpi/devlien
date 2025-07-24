# Devlien Framework

**Devlien** is a minimal and flexible Node.js backend framework designed to work seamlessly with:

- ✅ Nuxt.js
- ✅ Next.js
- ✅ NestJS
- ✅ Or run independently as a standalone server

It gives you a Laravel-like development experience while staying simple and unopinionated.

---

## 🚀 Quick Start with Nuxt.js

This guide will walk you through installing and using Devlien in a **Nuxt.js**, **Nextjs** project.

---

### 1️⃣ Install the Framework

In your Nuxt project root, install Devlien:

```bash
npm install devlien
```

---

### 2️⃣ Run the Setup Command

Initialize the server environment using:

```bash
npx devlien setup
```

This will automatically create the following structure inside your project:

```
server
├── app
│   ├── Http
|   |   ├──Controllers
|   |   ├──Middleware
|   |   └──Resources
│   ├── Models
│   └── Providers
├── config
│   ├── app
│   └── database
├── database
│   ├── migrations
│   └── seeds
├── routes
├── .env
```

---

### 3️⃣ Configure `.env` File

Edit the generated `.env` file and set your database configuration:

```env
APP_NAME="DeepLine"
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=root
DB_PASSWORD=secret
```

> ✅ You must have a running MySQL/MariaDB database before proceeding.

---

## ✨ Generate Core Components

Devlien includes several command-line tools to help you build faster:

---

### 📂 Create a Controller

```bash
npx devlien make:controller HomeController
```

This will generate:  
`server/app/Controllers/HomeController.js`

---

### 📦 Create a Model

```bash
npx devlien make:model User
```

This will generate:  
`server/app/Models/User.js`

---

### 🧱 Create a Migration

```bash
npx devlien make:migration users
```

This will generate:  
`server/database/migrations/2025_06_23_XXXXXX_users.js`

Edit the file to define your table structure.

---

### 🔄 Run Migrations

```bash
npx devlien migrate
npx devlien migrate:rollback --all
```

This will execute all pending migrations and create tables in your database.

---

### 🚀 Create a HTTP Resource

```bash
npx devlien make:resource
```

You’ll be prompted to enter the resource name (e.g., `Product`) and Devlien will generate resource for you.



---
## 📚 Migration Usage Example

In your migraion: /database/migrations/...users.js

```js
import Migration from "devlien/migration";

export default class extends Migration {
    up(schema){
        schema.create('users', (table)=>{
           table.increments('id');
           table.string('name');
           table.string('email').unique();
           table.string('password');
           table.set('status', ['active', 'inactive']).default('active');
        });
    }
    down(schema){
        schema.drop('users');
    }
}
```
---
## 📚 Route Usage Example

In your routes/api.js:

```js
import route from "devlien/route";
import Auth from "../app/Http/Middleware/Auth.js";

export default route.serve(route => {
    route.group({'prefix':'api', 'middleware':[Auth]}, (route)=>{
        route.get('index', 'UserController@index');
        route.put('create', 'UserController@create'); 
        route.put('update/:id', 'UserController@update');
    })
});
```


---
## 📚 Model Usage Example

In your controller:

```js
import User from "../../Models/User.js";

// Fetch users
let users = await User.get();


// or
let user = new User();
let users = await user.get();
```

```js
await User.limit(10).get();
await User.skip(5).limit(10).get();
```

```js
await User.where({id:1}).where([{id:1}, {id:1}]).where(['id', '=', 1]).get();
await User.where({id:1}).first();
```

```js
await User.create({
    "name" : "Shamim Haque",
    "username" : "shmimhaque",
    "email" : "shamim.haque.dev@gmail.com"
});
```

```js
await User.where({id:1}).update({
    "name" : "Shamim Haque",
    "email" : "shamim.haque.dev@gmail.com"
});
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