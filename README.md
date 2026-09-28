# Capstone Car Dealership Project

**Best Cars** is a full-stack car dealership review platform, built as the capstone project for the IBM Full Stack Software Developer Professional Certificate. Visitors can browse dealerships across the US, filter them by state and read customer reviews. Registered users can post their own reviews, and each review is tagged positive, neutral or negative by a sentiment analysis microservice.

## Features

- **Dealer directory** – browse every dealership and filter by state using a searchable dropdown
- **Dealer details** – see a dealer's address, its reviews and a summary of positive, neutral and negative reviews
- **Reviews** – logged-in users can post a review with the purchase date, car make, model and year
- **Sentiment analysis** – each review is scored automatically with NLTK VADER
- **Authentication** – register, log in and log out, handled by Django's user system
- **Modern, responsive UI** – styled with Tailwind CSS, with a mobile navigation menu

## Architecture

```
                         ┌──────────────────────────────┐
  Browser ─────────────▶ │  Django  (port 8000)         │
                         │  • serves React build + pages│
                         │  • auth, car makes/models    │──▶ SQLite
                         │  • proxies dealer/review API │
                         └───────┬──────────────┬───────┘
                                 │              │
                                 ▼              ▼
             ┌──────────────────────────┐   ┌───────────────────────────┐
             │ Node/Express API (3030)  │   │ Sentiment analyzer (5050) │
             │ dealers & reviews        │   │ Flask + NLTK VADER        │
             └────────────┬─────────────┘   └───────────────────────────┘
                          ▼
                    MongoDB (27017)
```

| Service | Tech | Location |
|---|---|---|
| Web app and API gateway | Django, Python | `server/djangoproj`, `server/djangoapp` |
| Frontend | React 18, React Router, Tailwind CSS 3 | `server/frontend` |
| Dealers & reviews API | Node.js, Express, Mongoose | `server/database` |
| Database | MongoDB | `server/database/docker-compose.yml` |
| Sentiment analyzer | Flask, NLTK | `server/djangoapp/microservices` |

## Pages

| Route | Description |
|---|---|
| `/` | Home page with hero section and highlights |
| `/about` | About the company and the team |
| `/contact` | Contact details |
| `/dealers` | Dealer directory with a searchable state filter |
| `/dealer/<id>` | Dealer details and reviews |
| `/postreview/<id>` | Review form (requires login) |
| `/login`, `/register` | Authentication |

Home, About and Contact are static templates in `server/frontend/static`. The other pages are React routes served from the React production build.

## Running locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB, either through Docker or a local install

### 1. Start MongoDB and the dealers API

**With Docker** (as in the course lab):

```bash
cd server/database
docker build . -t nodeapp
docker-compose up
```

**Without Docker**, run MongoDB locally on port 27017 and start the API, pointing it at your MongoDB with `MONGO_URL`. The API loads the seed data from the current directory, so run it from `data/`:

```bash
cd server/database
npm install
cd data
MONGO_URL=mongodb://127.0.0.1:27017/ node ../app.js
```

`MONGO_URL` defaults to `mongodb://mongo_db:27017/`, the hostname used in Docker Compose.

### 2. Start the sentiment analyzer

```bash
cd server/djangoapp/microservices
pip install -r requirements.txt
python -c "import nltk; nltk.download('vader_lexicon')"
flask --app app run --port 5050
```

### 3. Build the frontend

```bash
cd server/frontend
npm install
npm run build
```

`npm run build` does two things. It compiles Tailwind into `static/tailwind.css` for the Django-served pages, then builds the React app into `build/`. To regenerate only the CSS, run `npm run build:css`.

### 4. Start Django

```bash
cd server
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

Open **http://localhost:8000**.

### Configuration

Django reads the backend URLs from `server/djangoapp/.env`, and environment variables take priority over that file:

| Variable | Default | Purpose |
|---|---|---|
| `backend_url` | `http://localhost:3030` | Node/Express dealers & reviews API |
| `sentiment_analyzer_url` | `http://localhost:5050/` | Sentiment analysis microservice |

The committed `.env` points at the Coursera lab URLs. For local development, change these values or override them, for example:

```bash
backend_url=http://localhost:3030 sentiment_analyzer_url=http://localhost:5050/ python manage.py runserver
```

## Project structure

```
server/
├── database/              # Node/Express API + MongoDB seed data
├── djangoapp/             # Django app: views, models, REST client
│   └── microservices/     # Flask sentiment analyzer
├── djangoproj/            # Django project settings and URLs
├── frontend/
│   ├── src/components/    # React pages: Dealers, Dealer, PostReview, Login, Register, Header
│   ├── static/            # Home/About/Contact templates, site.js, compiled tailwind.css
│   └── tailwind.config.js # Shared design tokens for React and static pages
├── deployment.yaml        # Kubernetes deployment
└── Dockerfile
```

## CI

GitHub Actions (`.github/workflows/main.yml`) runs `flake8` on all Python files and `jshint` on the Node API on every push and pull request to `main`.
