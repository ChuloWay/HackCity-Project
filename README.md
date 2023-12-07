## Introduction

This Content Management System (CMS) is a web application designed to manage and organize content efficiently. Users can sign up, create posts, manage post categories, and admins have access to a real-time dashboard to monitor events within the application.

## Project Overview

## Technologies Used

- **PostgreSQL:** A powerful open-source relational database management system.
- **TypeORM:** An Object-Relational Mapping (ORM) library for TypeScript and JavaScript.
- **WebSockets:** A communication protocol that enables real-time bidirectional communication between clients and servers.
- **REST Protocol:** Traditional Representational State Transfer for standard HTTP-based communication.
- **NestJS:** A progressive Node.js framework for building efficient, scalable server-side applications.



## Features

1. **User Authentication:**

   - Users can sign up and log in securely to access CMS features.

2. **Post Management:**

   - Create, update, and delete posts.
   - Organize posts using categories.

3. **Category Management:**

   - Create, update, and delete post categories.

4. **Admin Dashboard:**
   - Real-time dashboard for admins to monitor user activities.
   - Uses WebSockets to provide live updates.

## Implementation Details

The project is implemented using NodeJS, NestJs, TypeScript, and TypeORM for database interactions. The chosen database is PostGresql.

## Getting Started

### Prerequisites

Ensure the following packages are installed locally:

1. [Postgres](https://www.postgresql.org/download/)
2. [Node (LTS Version)](https://nodejs.org)
3. [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
4. NestJS CLI:  `npm install @nestcli -g`

### Setup Steps

1. **Clone the repo**

   ```bash
   git clone https://github.com/ChuloWay/HackCity-Project
   ```

2. **Create an env file:**

   - Duplicate the `.env.example` file in the project root.
   - Rename the duplicated file to `.env`.
   - Open the `.env` file and set your variables as shown in the example file.

   ```bash
   cp .env.example .env
   ```

   Ensure to fill in the necessary values in the `.env` file for a smooth configuration.

3. **Run migration:**

   ```bash
   npm run apply:migration
   ```

4. **Start your server:**

   ```bash
   npm run start:dev
   ```

## API Documentation

Explore the API documentation at - [API Postman Documentation](https://documenter.getpostman.com/view/24154143/2s9YeN3pPV)s.

## Acknowledgements

Special thanks to:

- NestJS
- TypeScript
- PostGres
- TypeORM
- JSON Web Tokens
- Websocket
- PostMan

## Conclusion
Thank you for exploring our Content Management System! We hope this tool enhances your content management experience. Feel free to provide feedback, report issues, or contribute to the project. Happy managing!