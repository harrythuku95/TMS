# TMS Backend

## This project was generated for the Ticket Management System.

- Backend: [NodeJS](https://flatlogic.com/templates?backend%5B%5D=nodejs&sort=default)
- Database: PostgreSQL

## To start the project:

### Backend:

> Please change current folder: `cd backend`

#### Install local dependencies:
```
yarn add
```

#### Adjust local db:
1. Install PostgreSQL if not already installed.
2. Create a database for the project.

#### Set up environment variables:
Create a `.env` file in the root of the backend directory and add the necessary environment variables.

#### Start production build:
```
yarn start
```

The server will start running on `http://localhost:8080`.

## To start the project with Docker:

1. Build the Docker image:
   ```
   docker build -t tms-backend .
   ```

2. Run the container:
   ```
   docker run -p 8080:8080 -e NODE_ENV=production -d tms-backend
   ```

   This command runs the container in detached mode and maps port 8080 of the container to port 8080 on the host machine.

## API Documentation

(Include information about your API endpoints here)

## Testing

To run the test suite:
```
npm test
```

## License
