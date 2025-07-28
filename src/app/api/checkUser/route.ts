import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // For now, we'll simulate a user check
    // In a real application, you would check against your database
    const mockUser = {
      email: email,
      exists: false, // Set to true if user exists in your database
      emailVerified: false,
    };

    return NextResponse.json(mockUser);
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 