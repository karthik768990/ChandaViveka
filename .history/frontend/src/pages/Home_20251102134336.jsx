import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimationPage';

const Home = () => {
  return (
    <AnimatedPage>
      <VStack spacing={6} align="center" mt="100px">
        <Heading size="2xl" bgGradient="linear(to-r, teal.300, blue.300)" bgClip="text">
          Welcome to Chandas Analyzer
        </Heading>
        <Text fontSize="lg" color="gray.300">
          Analyze Sanskrit meters intelligently with pattern-based detection.
        </Text>
        <Link to="/dashboard">
          <Button colorScheme="teal" size="lg" variant="solid">
            Go to Dashboard
          </Button>
        </Link>
      </VStack>
    </AnimatedPage>
  );
};

export default Home;
