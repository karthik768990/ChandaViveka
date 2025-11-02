import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react';
import AnimatedPage from '../components/AnimationPage';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <AnimatedPage>
      <VStack spacing={5} align="start" maxW="600px" mx="auto" mt="50px">
        <Heading size="xl" color="teal.200">
          Dashboard
        </Heading>
        <Text fontSize="lg">Welcome, {user?.email}</Text>
        <Text color="gray.400">You can now start analyzing Chandas.</Text>

        <Button colorScheme="teal" variant="outline">
          Analyze a new Shloka
        </Button>
      </VStack>
    </AnimatedPage>
  );
};

export default Dashboard;
