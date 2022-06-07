# Pick me /api (UNFINISHED)

Api for the Pick me platform.

- Users CRUD OK
- Authentication with jwt OK

### Build

    npm install
    echo "DB_URL= API_PREFIX= PORT= TOKEN_SECRET" >> .env
    npm start

### Routes

- `/api/users` (GET, POST): Create and get users
- `/api/users/:id` (GET, PUT, DELETE): Get, update and delete users
- `/api/auth/signin` (POST): Sign in with email and password
- `/api/auth/currentUser` (GET): Get the current user

### Folders

```
|-src
|  |- controllers
|  |- database
|  |- models
|  |- routes
|  |- schemas
|  |- services
```

- **controllers**: Connect the services with the application
- **services**: Integration with database
- **routes**: The main api routes
- **schemas**: The mongoose schema models
- **models**: Interfaces and types
- **database**: Database configuration
