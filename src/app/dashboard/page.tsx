'use client';

import { Flex, Box, Heading, Text, Button, Stack } from '@chakra-ui/react';
import { useAuth } from '~/app/providers';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '~/lib/firebaseConfig';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Handle navigation when user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text>Redirecting to login...</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" p={6} bg="white" shadow="sm">
        <Heading size="lg" color="blue.600">Dashboard</Heading>
        <Stack direction="row" gap={4}>
          <Text>Welcome, {user.email}</Text>
          <Button
            onClick={handleSignOut}
            variant="outline"
            colorScheme="red"
          >
            Sign Out
          </Button>
        </Stack>
      </Flex>

      {/* Main Content */}
      <Flex flex="1" p={6} bg="gray.50">
        <Box maxW="4xl" mx="auto" w="full">
          <Stack gap={6}>
            <Box bg="white" p={6} borderRadius="lg" shadow="sm">
              <Heading size="md" mb={4}>Welcome to Your Dashboard</Heading>
              <Text color="gray.600">
                You are now authenticated and can access all the features of the application.
                This is where you would typically see your personalized content, settings, and other features.
              </Text>
            </Box>

            <Box bg="white" p={6} borderRadius="lg" shadow="sm">
              <Heading size="md" mb={4}>User Information</Heading>
              <Stack gap={2}>
                <Text><strong>Email:</strong> {user.email}</Text>
                <Text><strong>User ID:</strong> {user.uid}</Text>
                <Text><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</Text>
                <Text><strong>Account Created:</strong> {user.metadata.creationTime}</Text>
              </Stack>
            </Box>

            <Box bg="white" p={6} borderRadius="lg" shadow="sm">
              <Heading size="md" mb={4}>Quick Actions</Heading>
              <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                <Button colorScheme="blue">View Profile</Button>
                <Button colorScheme="green">Settings</Button>
                <Button colorScheme="purple">Help</Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </Flex>
  );
} 