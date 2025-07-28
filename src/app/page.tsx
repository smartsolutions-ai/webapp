'use client';

import { Flex, Box, Heading, Text, Button, Stack } from '@chakra-ui/react';
import { Logo } from '~/lib/components/Logo';
import { useAuth } from '~/app/providers';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" h="100vh" overflow="hidden">
      {/* Header */}
      <Flex justify="space-between" align="center" p={6} bg="white" shadow="sm" flexShrink={0}>
        <Logo />
        <Stack direction="row" gap={4}>
          {user ? (
            <>
              <Text>Welcome, {user.email}</Text>
              <Button
                onClick={() => router.push('/dashboard')}
                colorScheme="blue"
              >
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => router.push('/login')}
                variant="outline"
                colorScheme="blue"
              >
                Login
              </Button>
              <Button
                onClick={() => router.push('/signup')}
                colorScheme="blue"
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      {/* Hero Section */}
      <Flex
        flex="1"
        direction="column"
        justify="center"
        align="center"
        textAlign="center"
        px={6}
        py={12}
        bgGradient="linear(to-br, blue.50, purple.50)"
        overflow="auto"
      >
        <Box maxW="2xl" w="full">
          <Heading
            size="2xl"
            mb={6}
            bgGradient="linear(to-r, blue.600, purple.600)"
            bgClip="text"
          >
            Welcome to SS Webapp
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={8}>
            A modern web application with authentication built with Next.js, 
            Firebase, and Chakra UI. Start your journey today!
          </Text>
          {!user && (
            <Stack direction={{ base: 'column', md: 'row' }} gap={4} justify="center">
              <Button
                size="lg"
                colorScheme="blue"
                onClick={() => router.push('/signup')}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                colorScheme="blue"
                onClick={() => router.push('/login')}
              >
                Learn More
              </Button>
            </Stack>
          )}
        </Box>
      </Flex>

      {/* Footer */}
      <Box p={6} bg="gray.50" textAlign="center" flexShrink={0}>
        <Text color="gray.600">
          © 2024 SS Webapp. All rights reserved.
        </Text>
      </Box>
    </Flex>
  );
}
