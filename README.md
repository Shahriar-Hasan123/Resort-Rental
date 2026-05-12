# Resort Rental Platform

A full-stack web application for browsing and booking all-inclusive beach resorts. This platform provides an intuitive user interface for exploring luxury resort properties with advanced filtering, image galleries, and interactive maps.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setting Up Your Environment](#setting-up-your-environment)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Architecture](#project-architecture)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

### User-Facing Features
- **Property Browsing**: Browse all-inclusive resort properties with detailed information
- **Advanced Filtering**: Filter resorts by:
  - Most Popular
  - Highest Price
  - Lowest Price
- **Interactive Gallery**: View multiple resort images with thumbnail navigation
- **Smart Date Selection**: Hotel datepicker for intuitive date range selection
- **Guest Capacity Display**: View bedroom, bathroom, and guest capacity information
- **Map Integration**: Interactive Google Maps to locate resort properties
- **Favorites Management**: Save favorite resorts for quick access
- **Show More Functionality**: Expandable content sections for detailed information
- **Nearby Amenities**: Explore nearby attractions and activities
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Backend Features
- **RESTful API**: Clean API endpoints for property and image management
- **Static File Serving**: Efficient image delivery through Express.js
- **CORS Support**: Cross-origin requests properly handled
- **Environment Configuration**: Secure configuration management with environment variables

## Tech Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox/grid
- **JavaScript (Vanilla)**: Interactive features without framework overhead
- **Hotel Datepicker**: Hotel-specific date selection library
- **Font Awesome 6.5.0**: Icon library
- **Google Maps API**: Location-based services

### Backend
- **Node.js**: JavaScript runtime
- **Express.js 5.2.1**: Web application framework
- **CORS 2.8.6**: Cross-origin resource sharing middleware
- **dotenv 17.4.2**: Environment variable management
- **Nodemon 3.1.14**: Development server with auto-reload

## Project Structure

```
Resort-Rental/
├── backend/
│   ├── controllers/
│   │   ├── config.controller.js      # Configuration controller
│   │   ├── image.controller.js       # Image handling logic
│   │   └── property.controller.js    # Property filtering and retrieval
│   ├── routes/
│   │   ├── config.route.js           # Config endpoints
│   │   ├── image.route.js            # Image endpoints
│   │   └── property.route.js         # Property endpoints
│   ├── data/
│   │   ├── highest_price.json        # High-price properties dataset
│   │   ├── lowest_price.json         # Budget properties dataset
│   │   └── most_popular.json         # Popular properties dataset
│   ├── images/                       # Resort property images
│   ├── .env                          # Environment variables (not tracked)
│   ├── .gitignore                    # Git ignore rules
│   ├── package.json                  # Project dependencies
│   ├── package-lock.json             # Dependency lock file
│   └── server.js                     # Express server entry point
│
├── frontend/
│   ├── index.html                    # Main application page
│   ├── css/
│   │   └── styles.css                # Global styles
│   ├── js/
│   │   ├── datepicker.js             # Date range picker functionality
│   │   ├── favourites.js             # Favorites management
│   │   ├── gallery.js                # Image gallery functionality
│   │   ├── map.js                    # Google Maps integration
│   │   ├── nearby.js                 # Nearby amenities display
│   │   └── showmore.js               # Content expansion logic
│   └── assests/                      # Static assets
│       ├── activities/               # Activity images/icons
│       ├── contact/                  # Contact section assets
│       ├── footer/                   # Footer assets
│       ├── highlights/               # Highlight images
│       ├── logo/                     # Brand logos
│       ├── main/                     # Property images
│       └── others/                   # Miscellaneous assets
│

└── README.md                         # This file
```
## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Included with Node.js
- **Git** (optional) - For version control
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge
- **Google Maps API Key** - For location features ([Get API Key](https://developers.google.com/maps/documentation/javascript/get-api-key))

## Setting Up Your Environment (Ubuntu)

### Step 1: Install Node.js and npm

Node.js and npm come bundled together. Run this command to install both:

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24
```

This single command installs:
- **Node.js** - JavaScript runtime
- **npm** - Node Package Manager (included automatically)

### Step 2: Verify Node.js and npm Installation

```bash
node --version
npm --version
```

Both commands should return version numbers successfully.

### Step 3: Install Git (Optional)

```bash
sudo apt-get install git
```

Verify installation:
```bash
git --version
```

### Step 4: Install Backend Dependencies

Navigate to the backend directory and install each package:

```bash
cd backend

# Install express (Web server framework)
npm install express@5.2.1

# Install cors (Cross-origin resource sharing)
npm install cors@2.8.6

# Install dotenv (Environment variable management)
npm install dotenv@17.4.2

# Install nodemon as dev dependency (Auto-reload server)
npm install --save-dev nodemon@3.1.14
```

Or install all at once:

```bash
npm install express@5.2.1 cors@2.8.6 dotenv@17.4.2 && npm install --save-dev nodemon@3.1.14
```

### Step 5: Verify Dependencies Installation

```bash
npm list
```

All required dependencies should be installed successfully. Here's the dependency breakdown:

| Package | Version | Type | Purpose |
|---------|---------|------|---------|
| express | 5.2.1 | Production | Web server framework |
| cors | 2.8.6 | Production | Cross-origin resource sharing |
| dotenv | 17.4.2 | Production | Environment variable management |
| nodemon | 3.1.14 | Development | Auto-reload server during development |

## Installation

### 1. Clone or Download the Repository

```bash
git clone https://github.com/Shahriar-Hasan123/Resort-Rental.git
cd Resort-Rental
```

Or download the ZIP file from your repository and extract it.

### 2. Install Backend Dependencies (Already Done in Setup)

All dependencies should already be installed from the "Setting Up Your Environment" section. If not, run:

```bash
cd backend
npm install express@5.2.1 cors@2.8.6 dotenv@17.4.2 && npm install --save-dev nodemon@3.1.14
```

### 3. Verify Installation

```bash
npm list
```

All dependencies should be listed without errors.

## Configuration

### Backend Configuration

1. **Create or Update `.env` File**

   The `.env` file should be in the `backend/` directory:

   ```env
   PORT=3000
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

2. **Environment Variables**

   | Variable | Description | Default | Required |
   |----------|-------------|---------|----------|
   | `PORT` | Server port number | `3000` | No |
   | `GOOGLE_MAPS_API_KEY` | Google Maps API key | N/A | Yes (for maps) |

3. **Add API Key to Frontend**

   Update the Google Maps API key in your frontend JavaScript files that use the Maps API.

### Frontend Configuration

- Update phone number in `index.html` (currently: +1 (888) 999-9999)
- Customize resort branding (AIBR - All-Inclusive Beach Resorts)
- Update navigation links and breadcrumbs as needed
- Modify asset paths if directory structure changes

## Running the Application

### Development Mode

1. **Start Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

   Expected output:
   ```
   Server running at http://localhost:3000
   ```

   The server will automatically restart when you make changes to `server.js` or related files.

2. **Serve Frontend**

   Option A: Using Node.js `http-server`
   ```bash
   npm install -g http-server
   cd frontend
   http-server
   ```

   Option B: Using Live Server VS Code Extension
   - Install Live Server extension in VS Code
   - Right-click `index.html` and select "Open with Live Server"

3. **Access the Application**

   - **Frontend**: http://127.0.0.1:5500/frontend/index.html (Live Server default)
   - **Backend**: http://localhost:3000

### Production Mode

```bash
cd backend
npm start
```

The server will run once and listen on the specified PORT.

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Get Property Listings
```http
GET /api/get-property?{filter}
```

**Query Parameters**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `most-popular` | boolean | Returns most popular resorts | `?most-popular=true` |
| `highest-price` | boolean | Returns highest-priced resorts | `?highest-price=true` |
| `lowest-price` | boolean | Returns lowest-priced resorts | `?lowest-price=true` |
| `limit` | number | Limit number of results (optional) | `?most-popular=true&limit=4` |

**Example Requests**

```bash
# Get most popular resorts
curl http://localhost:3000/api/get-property?most-popular=true

# Get cheapest resorts
curl http://localhost:3000/api/get-property?lowest-price=true

# Get premium resorts
curl http://localhost:3000/api/get-property?highest-price=true

# Get most popular resorts with limit
curl http://localhost:3000/api/get-property?most-popular=true&limit=4

# Get cheapest resorts with limit
curl http://localhost:3000/api/get-property?lowest-price=true&limit=2
```

**Error Response**

```json
{
  "error": "Provide one of: most-popular=true, highest-price=true, lowest-price=true"
}
```

HTTP Status: `400 Bad Request`

#### Get List of All Images

**Get List of All Image URLs**
```http
GET /api/images
```

**Example Request**
```bash
curl http://localhost:3000/api/images
```

**Access Specific Image Directly**
```http
GET /images/{filename}
```

**Example**
```bash
# In browser or via curl
http://localhost:3000/images/image1.png
```

#### Maps Configuration

**Get Google Maps API Key**
```http
GET /api/config/maps-key
```

**Example Request**
```bash
curl http://localhost:3000/api/config/maps-key
```

## Project Architecture

### Backend Architecture

```
Request
   ↓
server.js (Express app setup)
   ↓
Middleware (CORS, JSON parser, Static files)
   ↓
Routes (property.route.js, image.route.js, config.route.js)
   ↓
Controllers (Business logic)
   ↓
Data Sources (JSON files)
   ↓
Response
```

### Data Flow

1. **Frontend** sends HTTP request with filter query parameters
2. **Express Server** receives request through `property.route.js`
3. **property.controller.js** validates parameters and loads appropriate JSON file
4. **Backend** returns filtered property data as JSON
5. **Frontend JavaScript** parses response and dynamically renders HTML/DOM

### Key Components

**server.js**
- Express application initialization
- Middleware configuration (CORS, JSON parsing)
- Route registration (property, image, config routes with `/api` prefix)
- Static file serving (images directory)
- Server startup on configured PORT (default: 3000)

**property.controller.js**
- Handles property filtering logic with three options:
  - `most-popular`: Returns properties from `most_popular.json`
  - `highest-price`: Returns properties from `highest_price.json`
  - `lowest-price`: Returns properties from `lowest_price.json`
- Supports optional `limit` parameter for pagination
- File I/O operations for JSON data
- Query parameter validation
- Error handling

**Frontend JS Modules**
- `datepicker.js`: Hotel datepicker integration and date validation
- `gallery.js`: Image carousel and thumbnail navigation
- `map.js`: Google Maps initialization and property location display
- `favourites.js`: Client-side favorite storage (localStorage)
- `nearby.js`: Nearby attractions and amenities display
- `showmore.js`: Content expansion and collapse functionality

## Development

### Code Style

- **Backend**: Standard Node.js conventions
- **Frontend**: ES5+ JavaScript with descriptive variable names
- **CSS**: BEM (Block Element Modifier) methodology recommended for scalability

### Adding New Features

#### Adding a New Property Filter
1. Create a new JSON data file in `backend/data/`
2. Add a new controller method in `backend/controllers/property.controller.js`
3. Add a corresponding route in `backend/routes/property.route.js`
4. Update frontend to call new endpoint

#### Adding New Frontend Functionality
1. Create new JavaScript module in `frontend/js/`
2. Include script tag in `index.html`
3. Initialize module on page load
4. Update CSS as needed in `frontend/css/styles.css`

### Debugging

**Backend**
- Check console output for server logs
- Use `console.log()` for debugging
- Monitor network requests in browser DevTools

**Frontend**
- Use browser DevTools (F12) for JavaScript debugging
- Check Console tab for errors
- Use Network tab to inspect API calls and responses

### Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot find module" error | Run `npm install` in backend directory |
| Port already in use | Change PORT in `.env` file or stop other services |
| CORS errors | Ensure CORS middleware is enabled in server.js |
| Images not loading | Check image paths and ensure images directory exists |
| Maps not showing | Verify Google Maps API key in `.env` and frontend code |

## Contributing

Contributions are welcome! To contribute:

1. **Fork the Repository** (if applicable)
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit Changes**
   ```bash
   git commit -m "Add feature: description"
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open Pull Request** with detailed description

### Coding Standards

- Use meaningful variable and function names
- Write comments for complex logic
- Maintain consistent indentation (2 spaces)
- Test changes before committing
- Update documentation for new features

## License

This project is licensed under the ISC License. See the LICENSE file in your project repository for more details.

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## Support

For issues, questions, or suggestions:
- Check existing documentation
- Review code comments
- Test in development environment first
- Contact the development team

---

**Last Updated**: May 2026
