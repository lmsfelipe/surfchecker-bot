# Node Docker MongoDB Application

This project is a simple Node.js application that uses Docker for containerization and MongoDB as the database. It demonstrates how to set up a basic Express application with user management features.

## Project Structure

```
node-docker-mongo-app
├── src
│   ├── app.js                # Entry point of the application
│   ├── controllers           # Contains controllers for handling requests
│   │   └── index.js
│   ├── models                # Contains Mongoose models
│   │   └── user.js
│   ├── routes                # Contains route definitions
│   │   └── index.js
├── Dockerfile                # Dockerfile for building the application image
├── docker-compose.yml        # Docker Compose configuration for services
├── package.json              # npm configuration file
├── .dockerignore             # Files to ignore when building Docker image
├── .gitignore                # Files to ignore in Git
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd node-docker-mongo-app
   ```

2. Build the Docker image and start the services:
   ```
   docker-compose up --build
   ```

### Usage

Once the application is running, you can access it at `http://localhost:3000`. You can use tools like Postman or curl to interact with the API.

### API Endpoints

- `POST /users` - Create a new user
- `GET /users` - Retrieve all users

### Stopping the Application

To stop the application, run:
```
docker-compose down
```

### License

This project is licensed under the MIT License.