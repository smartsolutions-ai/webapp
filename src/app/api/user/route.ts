import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '~/lib/utils/db';
import neo4j from 'neo4j-driver';

export async function POST(req: NextRequest): Promise<NextResponse> {
  let driver;
  let dbSession;
  let transaction;
  try {
    const userData = await req.json();
    const { email, name, mobile, referrerCode, isTrialUser = false } = userData;

    if (!email && !mobile) {
      return NextResponse.json(
        { error: 'Email or mobile number is required' },
        { status: 400 }
      );
    }

    driver = await connectToDatabase();
    dbSession = driver.session();

    try {
      transaction = dbSession.beginTransaction();

      // Check if user already exists
      let existingUserQuery = '';
      let existingUserParams = {};

      if (email && mobile) {
        existingUserQuery = 'MATCH (u:User) WHERE u.email = $email OR u.mobile = $mobile RETURN u';
        existingUserParams = { email, mobile };
      } else if (email) {
        existingUserQuery = 'MATCH (u:User {email: $email}) RETURN u';
        existingUserParams = { email };
      } else {
        existingUserQuery = 'MATCH (u:User {mobile: $mobile}) RETURN u';
        existingUserParams = { mobile };
      }

      let { records } = await transaction.run(existingUserQuery, existingUserParams);
      
      if (records.length > 0) {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        );
      }

      // Generate referral code
      let referralCode = null;
      if (!referrerCode) {
        let rString = randomString(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        while (true) {
          let { records } = await transaction.run(
            'MATCH(u:User WHERE u.referralCode = $referralCode) RETURN u',
            { referralCode: rString }
          );
          if (records.length === 0) {
            break;
          }
          rString = randomString(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        }
        referralCode = rString;
      }

      // Create user
      const createUserQuery = `
        CREATE (u:User {
          email: $email,
          name: $name,
          mobile: $mobile,
          referralCode: $referralCode,
          isTrialUser: $isTrialUser,
          createdAt: datetime(),
          emailVerified: false,
          mobileVerified: false
        })
        RETURN u, elementId(u) AS elementId
      `;

      const result = await transaction.run(createUserQuery, {
        email: email || null,
        name: name || '',
        mobile: mobile || null,
        referralCode,
        isTrialUser,
      });

      await transaction.commit();

      const userNode = result.records[0].get('u');
      const elementId = result.records[0].get('elementId');

      return NextResponse.json({
        status: 201,
        message: 'User created successfully',
        user: {
          ...userNode.properties,
          sdUserId: elementId,
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      if (transaction) await transaction.rollback();
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    } finally {
      if (dbSession) dbSession.close();
      if (driver) await driver.close();
    }
  } catch (error) {
    console.error('Error in user creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  let driver;
  let dbSession;
  let transaction;
  try {
    driver = await connectToDatabase();
    dbSession = driver.session();

    transaction = dbSession.beginTransaction();
    const { records } = await transaction.run(
      'MATCH (u:User) RETURN u.name AS name, u.email AS email, u.mobile AS mobile, elementId(u) AS id'
    );
    await transaction.commit();

    const users = records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      email: record.get('email'),
      mobile: record.get('mobile'),
    }));

    return NextResponse.json({
      status: 200,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { status: 500, error: 'Failed to fetch users' },
      { status: 500 }
    );
  } finally {
    if (dbSession) await dbSession.close();
    if (driver) await driver.close();
  }
}

function randomString(length: number, chars: string) {
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
} 