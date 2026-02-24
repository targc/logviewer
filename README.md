# Kubernetes Logs Viewer

Next.js application for querying Kubernetes logs from Quickwit with search and pagination.

## Features

- Full-text search in log messages
- Filter by Project ID, Deployment ID, Namespace
- Load more pagination (ascending order, oldest first)
- Server-side proxy to Quickwit API
- Basic Authentication (always required)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your settings:
```env
QUICKWIT_URL=http://35.197.154.173:17280
QUICKWIT_INDEX=k8s-logs-prod

# Quickwit Basic Auth (optional - leave empty if not required)
QUICKWIT_USER=dodo
QUICKWIT_PASS=your-password

# Web Application Basic Auth (REQUIRED - change default credentials!)
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=admin123
```

**⚠️ IMPORTANT**: Change the default `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` before deploying to production!

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

**Authentication**: Basic authentication is always required. Enter your `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` credentials when prompted.

1. **Search**: Enter text to search in log messages
2. **Filter**: Use filter inputs to narrow down by Project ID, Deployment ID, or Namespace
3. **Navigate**: Click "Load More" button to load older logs

## API Endpoint

**GET** `/api/logs`

Query parameters:
- `q` - Search query
- `projectId` - Filter by project ID
- `deploymentId` - Filter by deployment ID (kubernetes.labels.id)
- `namespace` - Filter by namespace
- `maxHits` - Results per page (default: 20)
- `startOffset` - Pagination offset (default: 0)

## Build for Production

### Local Build

```bash
npm run build
npm start
```

### Docker Build

```bash
# Build the image
docker build -t quickwit-logs-viewer .

# Run the container
docker run -p 3000:3000 \
  -e QUICKWIT_URL=http://35.197.154.173:17281 \
  -e QUICKWIT_INDEX=k8s-logs-prod \
  -e QUICKWIT_USER=dodo \
  -e QUICKWIT_PASS=sfi1A8j!0 \
  -e BASIC_AUTH_USER=oox \
  -e BASIC_AUTH_PASS='+Qq1150+' \
  quickwit-logs-viewer
```

Or use docker-compose:

```bash
# Copy the example file
cp docker-compose.example.yml docker-compose.yml

# Edit with your credentials
nano docker-compose.yml

# Start the container
docker-compose up -d
```
