# TMS Frontend

## This project was generated for the Ticket Management System.

- Frontend: [React.js](https://flatlogic.com/templates?framework%5B%5D=react&sort=default)
- Design: [Material UI](https://flatlogic.com/templates?design%5B%5D=material&sort=default)

## To start the project:

### Frontend:

> Please change current folder: `cd frontend/vite-project`

#### Quick Start

1. Install local dependencies:
   ```
   yarn install
   ```

2. Run development server:
   ```
   yarn run dev
   ```

   Open http://localhost:5173 to view it in the browser. 

3. Build for production:
   ```
   yarn run build
   ```

   This builds the app for production to the `dist` folder.

## To start the project with Docker:

1. Build the Docker image:
   ```
   docker build -t tms-frontend .
   ```

2. Run the container:
   ```
   docker run -p 5173:5173 -d tms-frontend
   ```

   This command runs the container in detached mode and maps port 5173 of the container to port 5173 on the host machine.

## Available Scripts

- `npm run dev`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm run preview`: Locally preview production build

## Folder Structure

(Describe the main folders and their purposes here)

## State Management

(Describe how state is managed in the application)

## Styling

This project uses Material-UI for styling. Custom theme configuration can be found in `src/theme.js`.

## Testing

To run the test suite:
```
yarn test
```


## License
