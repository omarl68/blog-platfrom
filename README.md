# 🧠 Blog Platform – Backend API

This is the backend for a **collaborative blog platform** built using the **MEAN stack** (MongoDB, Express.js, Angular, Node.js), following a **modular monolith architecture**.

It includes:
- Role-based access control (Admin, Editor, Writer, Reader)
- Real-time comment system (Socket.IO)
- RESTful APIs for articles, users, comments
- Docker support for development and production
- OpenAPI documentation

---

## 🚀 Quick Start

### 🔧 Requirements

- Node.js v18+
- [pnpm](https://pnpm.io/) (package manager)
- Docker & Docker Compose (optional, but recommended)

---

### 📥 Installation (Local without Docker)

```bash
# Clone the repo
git clone https://github.com/your-org/blog-platform.git
cd blog-platform

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit `.env` and set your MongoDB URI
# Example: MONGODB_URI=mongodb://localhost:27017/blog-platform

# Start the server
pnpm run start:dev
Server will run by default on:

arduino
Copy
Edit
http://localhost:3001
🐳 Running with Docker
Make sure Docker and Docker Compose are installed.

Development
bash
Copy
Edit
make dev         # Start dev environment
make dev-build   # Build and start dev
make dev-down    # Stop dev environment
Production
bash
Copy
Edit
make prod        # Start production
make prod-build  # Build and start
make prod-down   # Stop production
Useful commands
bash
Copy
Edit
make logs        # View logs
make restart     # Restart containers
make clean       # Remove volumes and prune
make clean-dev   # Clean dev environment
make test        # Run backend tests
make db-shell    # Access MongoDB shell
make help        # View all make targets
🔐 Roles & Permissions
Role	Permissions
Admin	Manage users, manage all articles
Editor	View all articles, edit/write articles
Writer	Write and edit own articles
Reader	View all articles

📂 Folder Structure
bash
Copy
Edit
/project-root/
├── diagrams/                # Architecture diagrams
├── dist/                    # Compiled output
├── logs/                    # Application logs
├── public/                  # Static files (avatars, articles)
├── scripts/                 # Seeders, CLI tools
├── src/
│   ├── constants/           # Enums, roles, codes
│   ├── core/                # Auth middleware, base services
│   ├── docs/                # OpenAPI YAML files
│   ├── modules/             # Features (auth, articles, users, comments)
│   ├── routes/              # Routes definition and mapping
│   ├── types/               # TypeScript interfaces and types
│   ├── utils/               # Helper functions (e.g. multer, errors)
│   ├── app.ts               # Express config
│   └── server.ts            # Application entry point
├── .env                     # Environment variables
├── .env.example             # Example env file
├── docker-compose.dev.yml
├── docker-compose.yml
├── Makefile
├── package.json
├── pnpm-lock.yaml
📑 API Documentation
📖 The API documentation is auto-generated with Swagger (OpenAPI).

URL: http://localhost:3001/api-docs

Format: YAML files stored in src/docs/

Tags: User, Auth, Role, Article, Comment

🧪 Testing
You can run tests inside Docker or locally:

bash
Copy
Edit
make test
# or
pnpm test
✅ Tech Stack
Node.js with Express.js

MongoDB with Mongoose

TypeScript

Socket.IO (real-time features)

Swagger (OpenAPI) for docs

Joi for validation

Docker & Makefile for environment control

pnpm for package management

📜 License
This project is licensed under the MIT License.