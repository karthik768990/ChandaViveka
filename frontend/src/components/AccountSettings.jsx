import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimationPage';

const AccountSettings = () => {
  const { user, logout } = useAuth();

  return (
    <AnimatedPage>
      <VStack spacing={5} mt="50px">
        <Heading>Account Settings</Heading>
        <Box bg="gray.800" p={5} rounded="md" w="sm">
          <Text>Email: {user?.email}</Text>
          <Button mt={4} colorScheme="red" onClick={logout}>
            Logout
          </Button>
        </Box>
      </VStack>
    </AnimatedPage>
  );
};

export default AccountSettings;
