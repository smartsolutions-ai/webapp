'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Flex, Box, Heading, Text, Button, Spinner } from '@chakra-ui/react';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '~/lib/firebaseConfig';

export default function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          const email = localStorage.getItem('emailForSignIn');
          if (!email) {
            setError('Email not found. Please try signing in again.');
            setLoading(false);
            return;
          }

          const result = await signInWithEmailLink(auth, email, window.location.href);
          localStorage.removeItem('emailForSignIn');
          
          // Create user in your database
          const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail: result.user.email,
              userName: result.user.displayName || '',
              emailVerified: true,
            }),
          });

          if (response.ok) {
            setSuccess(true);
            setTimeout(() => {
              router.push('/dashboard');
            }, 2000);
          } else {
            setError('Failed to create user account.');
          }
        } else {
          setError('Invalid email verification link.');
        }
      } catch (error: any) {
        setError(error.message || 'An error occurred during verification.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [router]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Box textAlign="center">
          <Spinner size="xl" mb={4} />
          <Text>Verifying your email...</Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex justify="center" align="center" minH="100vh" bg="gray.50">
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        shadow="lg"
        maxW="md"
        w="full"
        textAlign="center"
      >
        {success ? (
          <>
            <Heading size="lg" color="green.500" mb={4}>
              Email Verified Successfully!
            </Heading>
            <Text color="gray.600" mb={6}>
              Your email has been verified and your account has been created.
              Redirecting to dashboard...
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </>
        ) : (
          <>
            <Heading size="lg" color="red.500" mb={4}>
              Verification Failed
            </Heading>
            <Text color="gray.600" mb={6}>
              {error}
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => router.push('/login')}
            >
              Back to Login
            </Button>
          </>
        )}
      </Box>
    </Flex>
  );
} 