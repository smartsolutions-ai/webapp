'use client';

import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Logo } from '../Logo';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, signInWithGoogle } from '../../../lib/firebaseConfig';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { GoogleIcon } from './ProviderIcons';
import { motion } from 'framer-motion';
import SimpleMobileOtpForm from './SimpleMobileOtpForm';

const SignInForm = (props: any) => {
  const { issignup, istrialuser } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [authMode, setAuthMode] = useState<'email' | 'firebase-mobile'>('email');

  const emailInputRef = useRef<HTMLInputElement>(null);
  const referrerCodeInputRef = useRef<HTMLInputElement>(null);
  const signup = issignup === 1;
  const trialuser = istrialuser === 1;
  const router = useRouter();
  const { onSuccess } = props;
  const MotionHeading = motion(Heading);
  const MotionText = motion(Text);

  const checkUser = async (email: string) => {
    try {
      const response = await fetch('/api/checkUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to check user existence');
      const user = await response.json();
      return user; // returns user data or false
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  };

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const enteredEmail = emailInputRef.current?.value;

    if (!enteredEmail) {
      setErrorMessage('Email is required');
      setIsLoading(false);
      return;
    }

    try {
      if (signup) {
        // Check if user already exists
        const user = await checkUser(enteredEmail);
        if (user?.exists) {
          setErrorMessage('User already exists!');
          setIsLoading(false);
          return;
        }
        const referralCode = referrerCodeInputRef.current?.value;

        const actionCodeSettings = {
          url: `${window.location.origin}/verifyEmail?email=${encodeURIComponent(
            enteredEmail
          )}&referralCode=${referralCode}&isSignup=${signup}`,
          handleCodeInApp: true,
        };

        await sendSignInLinkToEmail(auth, enteredEmail, actionCodeSettings);
        localStorage.setItem('emailForSignIn', enteredEmail);
        setSuccessMessage('A sign-up link has been sent to your email.');
      } else {
        // Handle login case
        const actionCodeSettings = {
          url: `${window.location.origin}/verifyEmail?email=${encodeURIComponent(
            enteredEmail
          )}&isSignup=${signup}`,
          handleCodeInApp: true,
        };

        const user = await checkUser(enteredEmail);
        if (!user?.exists) {
          setErrorMessage('Signup before login.');
          setIsLoading(false);
          return;
        }

        if (user.exists && !user.emailVerified) {
          setErrorMessage(
            'Email not verified. A verification link has been sent to your email.'
          );
        } else {
          setSuccessMessage('A sign-in link has been sent to your email.');
        }

        await sendSignInLinkToEmail(auth, enteredEmail, actionCodeSettings);
        localStorage.setItem('emailForSignIn', enteredEmail);
      }
    } catch (error: any) {
      setErrorMessage(
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.displayName || '',
            mobile: null,
            referrerCode: referrerCodeInputRef.current?.value || null,
            isTrialUser: istrialuser,
          }),
        });

        if (response.ok) {
          const token = await user.getIdToken(); // Get Firebase ID token
          document.cookie = `token=${token}; path=/`;
          if (onSuccess) onSuccess();
          else if (signup) router.push('/profile');
          else router.push('/');
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Failed to create user');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        setErrorMessage('Failed to create user account');
      }
    }
  };

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      minH="100vh"
      bg={{ base: 'white', md: 'linear(to-br, blue.50, purple.100)' }}
      px={4}
      py={8}
    >
      <Stack gap={6} w="full" maxW="md" align="center">
        {/* Logo */}
        <Logo />
        {/* Animated Heading */}
        <MotionHeading
          textAlign="center"
          fontSize={{ base: '2xl', md: '3xl' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {signup ? 'Sign Up' : 'Log In'} to your account
        </MotionHeading>

        {/* Trial Message */}
        {trialuser && (
          <MotionText
            textAlign="center"
            fontSize="sm"
            color="gray.600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            🚀 Start your 2-week free trial by signing up below!
          </MotionText>
        )}

        {/* Toggle Link */}
        <Text fontSize="sm" color="black.500">
          {signup ? (
            <>
              Already have an account?{' '}
              <Link href="/login" color="blue.500">
                Log in
              </Link>
            </>
          ) : (
            <>
              New here?{' '}
              <Link href="/signup" color="blue.500">
                Sign up
              </Link>
            </>
          )}
        </Text>

        {/* Auth Mode Toggle */}
        <Stack direction="row" gap={4} align="center" w="full">
          <Button
            size="sm"
            variant={authMode === 'email' ? 'solid' : 'outline'}
            onClick={() => {
              console.log('Switching to email mode');
              setAuthMode('email');
            }}
            colorScheme="blue"
            flex="1"
            _hover={{ bg: authMode === 'email' ? 'blue.600' : 'blue.50' }}
          >
            Email
          </Button>
          <Button
            size="sm"
            variant={authMode === 'firebase-mobile' ? 'solid' : 'outline'}
            onClick={() => {
              console.log('Switching to firebase-mobile mode');
              setAuthMode('firebase-mobile');
            }}
            colorScheme="green"
            flex="1"
            _hover={{ bg: authMode === 'firebase-mobile' ? 'green.600' : 'green.50' }}
          >
            Mobile OTP
          </Button>
        </Stack>

        {/* Auth Form */}
        {authMode === 'firebase-mobile' ? (
          <Box w="full">
            <SimpleMobileOtpForm
              issignup={issignup}
              istrialuser={istrialuser}
              onSuccess={onSuccess}
            />
          </Box>
        ) : (
          <>
            <Box
              as="form"
              onSubmit={submitHandler}
              bg="white"
              w="full"
            >
              <Stack>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  ref={emailInputRef}
                  required
                  _placeholder={{ color: 'gray.400' }}
                />
                {signup && (
                  <Input
                    id="referrerCode"
                    placeholder="Referrer Code (optional)"
                    ref={referrerCodeInputRef}
                  />
                )}
                {successMessage && (
                  <Text color="green.500">{successMessage}</Text>
                )}
                {errorMessage && <Text color="red.500">{errorMessage}</Text>}
              </Stack>
            </Box>
            <Button
              type="submit"
              color="white"
              bg="blue.500"
              _hover={{ bg: 'blue.600' }}
              isLoading={isLoading}
              loadingText="Sending..."
              width={'full'}
              onClick={submitHandler}
            >
              {signup ? 'Send Sign-Up Link ✨' : 'Send Login Link 🚀'}
            </Button>
          </>
        )}
        {/* Optional: Social login - only show in email mode */}
        {authMode === 'email' && (
          <Button
            variant="outline"
            colorScheme="blue"
            borderColor="blue.500"
            color="blue.500"
            _hover={{ bg: 'blue.50', borderColor: 'blue.600', color: 'blue.600' }}
            onClick={() => handleGoogleLogin()}
            width={'full'}
          >
            <GoogleIcon />
            {signup ? 'Sign up with Google' : 'Sign in with Google'}
          </Button>
        )}

        <Text fontSize="xs" color="gray.400" textAlign="center">
          💡 We respect your privacy and never spam.
        </Text>
      </Stack>
    </Flex>
  );
};

export { SignInForm }; 