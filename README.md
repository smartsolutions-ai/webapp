# SS Webapp

A modern web application with authentication built with Next.js, Firebase, and Chakra UI.

## Features

- 🔐 Firebase Authentication (Email/Password and Google Sign-in)
- 📧 Email verification with magic links
- 🎨 Modern UI with Chakra UI
- 📱 Responsive design
- 🚀 Next.js 15 with App Router
- 🔄 Real-time authentication state management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ss/webapp
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and add Email/Password and Google providers
   - Get your Firebase configuration

4. Create environment variables:
   Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkUser/
│   │   │   └── route.ts          # API to check if user exists
│   │   └── user/
│   │       └── route.ts          # API for user management
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard for authenticated users
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── signup/
│   │   └── page.tsx              # Signup page
│   ├── verifyEmail/
│   │   └── page.tsx              # Email verification page
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   └── providers.tsx             # Authentication providers
├── lib/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── auth.tsx          # Main auth form component
│   │   │   ├── SignInForm.tsx    # Sign in/up form
│   │   │   └── ProviderIcons.tsx # Social login icons
│   │   └── Logo.tsx              # Logo component
│   └── firebaseConfig.ts         # Firebase configuration
```

## Authentication Flow

1. **Sign Up**: Users can sign up with email or Google
2. **Email Verification**: Magic links are sent for email verification
3. **Sign In**: Users can sign in with email or Google
4. **Dashboard**: Authenticated users are redirected to dashboard
5. **Sign Out**: Users can sign out from the dashboard

## API Routes

- `POST /api/checkUser` - Check if a user exists
- `POST /api/user` - Create a new user
- `GET /api/user?email=<email>` - Get user by email

## Customization

### Styling
The app uses Chakra UI for styling. You can customize the theme in the `ChakraProvider` in `layout.tsx`.

### Database Integration
Currently, the app uses mock data for user management. To integrate with a real database:

1. Update the API routes in `src/app/api/` to connect to your database
2. Modify the user creation and retrieval logic
3. Add proper error handling and validation

### Firebase Configuration
The Firebase configuration is in `src/lib/firebaseConfig.ts`. You can add more authentication providers or modify the existing ones.

## Deployment

The app can be deployed to Vercel, Netlify, or any other Next.js hosting platform. Make sure to:

1. Set up environment variables in your hosting platform
2. Configure Firebase Authentication settings for your domain
3. Update the action code settings in the authentication flow

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
