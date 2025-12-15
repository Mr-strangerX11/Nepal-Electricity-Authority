# Frontend Setup & Documentation

## Overview
React.js web application for the NEA Electricity Connection System.

## Quick Start

```bash
npm install
npm start
```

App runs on `http://localhost:3000`

## Environment Variables

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=NEA Connection System
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Page components
│   ├── services/        # API service calls
│   ├── context/         # React context (auth state)
│   ├── styles/          # CSS and Tailwind
│   ├── utils/           # Utility functions
│   ├── App.js           # Root component
│   └── index.js         # Entry point
├── public/              # Static files
├── package.json
├── tailwind.config.js
└── README.md
```

## Available Pages

- `/` - Home page
- `/login` - Login
- `/register` - Registration
- `/apply` - Application form
- `/tracker` - Application tracking
- `/admin` - Admin dashboard (admin only)

## Key Features

### User Authentication
- Register and login
- JWT token storage
- Protected routes
- Role-based access

### Application Management
- Submit new application
- Upload documents
- Track application status
- Real-time updates

### Admin Dashboard
- View all applications
- Analytics and metrics
- Application approval
- Staff assignment

## Styling

Uses Tailwind CSS for styling. Main CSS files:
- `src/styles/index.css` - Global styles
- `src/styles/App.css` - App-specific styles

Tailwind configuration: `tailwind.config.js`

## Testing

```bash
npm test
npm run test:watch
```

## Building for Production

```bash
npm run build
```

Creates optimized build in `build/` directory.

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Docker
```bash
docker build -t nea-frontend .
docker run -p 3000:3000 nea-frontend
```

## API Integration

API calls are handled in `src/services/api.js`:
- AuthService - User authentication
- ApplicationService - Application CRUD
- DocumentService - Document uploads
- PaymentService - Payment integration
- AdminService - Admin operations

## State Management

Uses React Context for authentication state management.
Access auth state:
```javascript
const { user, token, login, logout } = useAuth();
```

## Error Handling

API errors are caught and displayed using react-hot-toast notifications.

## Performance

- Code splitting with React.lazy()
- Image optimization
- Minification and compression
- Caching strategies

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request
