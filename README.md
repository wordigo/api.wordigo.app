# Wordigo API

Welcome! This document comprehensively explains the setup and usage of the Wordigo API. The Wordigo API is a backend service designed to manage dictionaries, words, translations, and user interactions.

## Features

- **User Authentication**: Secure login and registration functionality.
- **Dictionary Management**: Create, update, delete, and retrieve dictionaries.
- **Word Management**: Add, update, and delete words within dictionaries.
- **Translation Services**: Use external APIs to translate words.
- **Dashboard Statistics**: Provides general statistics and word interaction data.
- **Swagger Documentation**: Automatically generated API documentation with Swagger.

## Prerequisites

Before starting, make sure the following are installed:
- Node.js (v14 or newer)
- pnpm
- Git

## Installation

Clone the repository:

```bash
git clone https://github.com/wordigo/api.wordigo.app.git
cd api.wordigo.app
```

Install dependencies:

```bash
pnpm install
```

## Configuration

In the root directory, copy the `.env.example` file to create a `.env` file and fill in the necessary environment variables:

```bash
cp .env.example .env
```

Then edit the `.env` file with your own values.

## Running the Application

To start the server in development mode:

```bash
pnpm run dev
```

To build the application for production:

```bash
pnpm run build
```

To start the server in production mode:

```bash
pnpm start
```

## API Documentation

While the server is running, you can visit the Swagger UI at this address to interact with the API:

```
http://localhost:4000/docs
```

## Testing

To run automated tests:

```bash
pnpm test
```

## Contributing

We welcome your contributions! Please do not hesitate to send a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/wordigo/api.wordigo.app/blob/main/LICENSE) file for details.

## Contact

If you have any questions, you can reach out to the maintainers:
- Sefa Kapısız <m.sefa06@hotmail.com>
- Osman Delişmen

---

For more details, visit the project's main page: [Wordigo API GitHub](https://github.com/wordigo/api.wordigo.app).

