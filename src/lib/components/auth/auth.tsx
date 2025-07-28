'use client';

import {
  Box,
  Center,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { Logo } from '../Logo';
import { SignInForm } from './SignInForm';

function AuthForm(props: any) {
  const { issignup, istrialuser } = props;
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard'); // Navigate on successful auth
  };

  return (
    <Flex
      h="100vh"
      w="100vw"
      overflow="hidden"
      bgGradient="linear(to-r, purple.50, white)"
    >
      <Flex w="full" h="full">
        <Box flex="1" display={{ base: 'none', md: 'block' }}>
          <Flex
            direction="column"
            px={{ base: '4', md: '8' }}
            height="full"
            color="white"
            bg="purple.600"
          >
            <Flex align="center" h="24">
              <Logo boxSize="60px" />
            </Flex>
            <Flex flex="1" align="center">
              <Stack gap="8">
                <Stack gap="6">
                  <Heading textStyle={{ md: '4xl', xl: '6xl' }}>
                    Start on your path to Knowledge & Creativity
                  </Heading>
                  <Text
                    textStyle="lg"
                    maxW="md"
                    fontWeight="medium"
                    color="purple.100"
                  >
                    Create a profile and start sharing your stories with the
                    world !
                  </Text>
                </Stack>
              </Stack>
            </Flex>
            <Flex align="center" h="24">
              <Text color="purple.200" textStyle="sm">
                © 2024 SS Webapp. All rights reserved.
              </Text>
            </Flex>
          </Flex>
        </Box>
        <Center flex="1" w="full">
          <SignInForm
            px={{ base: '4', md: '8' }}
            py={{ base: '12', md: '48' }}
            width="full"
            maxW="md"
            issignup={issignup}
            istrialuser={istrialuser}
            onSuccess={handleSuccess}
          />
        </Center>
      </Flex>
    </Flex>
  );
}

export default AuthForm; 