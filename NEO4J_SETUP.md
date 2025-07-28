# Neo4j Integration Setup

This document explains how to set up Neo4j integration for the SS Webapp.

## Prerequisites

1. Install Neo4j Desktop or Neo4j Community Edition
2. Create a new database or use an existing one
3. Note down your database credentials

## Environment Variables

Copy the `env.example` file to `.env.local` and update the following variables:

```bash
# Neo4j Database Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_neo4j_password
```

## Database Schema

The application creates users with the following structure:

```cypher
CREATE (u:User {
  email: String,
  name: String,
  mobile: String,
  referralCode: String,
  isTrialUser: Boolean,
  createdAt: DateTime,
  emailVerified: Boolean,
  mobileVerified: Boolean
})
```

## User Creation Flow

1. **Email Signup**: When a user signs up with email, a user node is created in Neo4j
2. **Mobile OTP Signup**: When a user signs up with mobile OTP, a user node is created in Neo4j
3. **Google Signup**: When a user signs up with Google, a user node is created in Neo4j

## API Endpoints

- `POST /api/user` - Create a new user
- `GET /api/user` - Get all users (for admin purposes)

## User Data Structure

```typescript
interface User {
  email?: string;
  name: string;
  mobile?: string;
  referralCode: string;
  isTrialUser: boolean;
  createdAt: Date;
  emailVerified: boolean;
  mobileVerified: boolean;
  sdUserId: string; // Neo4j element ID
}
```

## Testing

1. Start your Neo4j database
2. Set up environment variables
3. Run the development server: `npm run dev`
4. Test user creation through the signup forms

## Troubleshooting

- Ensure Neo4j is running and accessible
- Check that environment variables are correctly set
- Verify database connection in the browser console
- Check Neo4j logs for any connection issues 