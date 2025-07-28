import { Box, Text } from '@chakra-ui/react';

interface LogoProps {
  boxSize?: string;
}

export const Logo = ({ boxSize = "40px" }: LogoProps) => {
  return (
    <Box
      as="a"
      href="/"
      display="flex"
      alignItems="center"
      textDecoration="none"
      _hover={{ textDecoration: 'none' }}
    >
      <Box
        width={boxSize}
        height={boxSize}
        bg="blue.500"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mr={2}
      >
        <Text color="white" fontWeight="bold" fontSize="lg">
          SS
        </Text>
      </Box>
      <Text fontSize="xl" fontWeight="bold" color="blue.500">
        SS Webapp
      </Text>
    </Box>
  );
}; 