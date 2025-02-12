﻿# Nest.js_API_Efrei_Samuel_CHARTON
## Running the Application in Development

Exercices are located in `Moviie_booker_Efrei_Samuel_CHARTON/exos`

To run the Nest.js application in development mode, follow these steps:

1. Clone the repository:
    ```bash
    # clone the project
    cd Moviie_booker_Efrei_Samuel_CHARTON/moviie_booker_api/
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    POSTGRES_HOST=localhost
    POSTGRES_PASSWORD=examplepassword
    POSTGRES_USER=exampleuser
    POSTGRES_DB=exampledb
    JWT_SECRET=examplesecret
    API_TOKEN=exampleapitoken
    API_KEY=exampleapikey
    API_URL=https://api.themoviedb.org/3
    ```

4. Run the application in dev:
    ```bash
    npm run start:dev
    ```

The application should now be running in development mode.

## Deploying the Application

To deploy the Nest.js application, follow these steps:

1. Build the application:
    ```bash
    npm run build
    ```

2. Start the application:
    ```bash
    npm run start:prod
    ```

The application should now be running in production mode.


In local the api should run on `http://localhost:3001/` and the swagger instance is available at `http://localhost:3001/api`

The production address is `https://mooviiebooker-nest-js-api-efrei-samuel.onrender.com/api`
