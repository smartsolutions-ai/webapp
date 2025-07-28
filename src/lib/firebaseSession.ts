import { cookies } from 'next/headers';
import { connectToDatabase } from './utils/db';

export const getFirebaseServerSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { user: null, error: 'Please log in' };
  }

  try {
    // For now, we'll use a simple approach without Firebase Admin
    // In a real implementation, you would verify the token with Firebase Admin
    const decodedToken = { uid: 'temp-uid', email: null, phone_number: null };

    // Connect to Neo4j and fetch user details
    const driver = await connectToDatabase();
    const dbSession = driver.session();

    try {
      const transaction = dbSession.beginTransaction();
      let result;

      // Try to find user by email or phone number
      result = await transaction.run(
        'MATCH (u:User) WHERE u.email IS NOT NULL OR u.mobile IS NOT NULL RETURN u, elementId(u) AS elementId LIMIT 1',
        {}
      );

      await transaction.commit();

      if (result.records.length > 0) {
        const userNode = result.records[0].get('u');
        const elementId = result.records[0].get('elementId');

        const userDetails = {
          ...decodedToken,
          ...userNode.properties,
          sdUserId: elementId,
          email: userNode.properties.email || null,
          phone_number: userNode.properties.mobile || null,
          uid: decodedToken.uid,
        };

        return { user: userDetails };
      } else {
        return {
          user: null,
          error: 'User not found in database',
          firebaseUser: decodedToken,
        };
      }
    } catch (dbError) {
      console.error('Error fetching user from database:', dbError);
      return {
        user: null,
        error: 'Database error',
        firebaseUser: decodedToken,
      };
    } finally {
      if (dbSession) dbSession.close();
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return { user: null, error: 'Invalid token' };
  }
}; 