import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Box, Button, Heading, Text, VStack, Flex } from '@chakra-ui/react';
import AnimatedPage from '../components/AnimationPage.jsx';
import { motion } from 'framer-motion';

// ✅ For Framer Motion v11+
const MotionVStack = motion.create(VStack);
const MotionButton = motion.create(Button);

const Home = () => {
  const { user, loginWithGoogle } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AnimatedPage>
      <Flex height="calc(100vh - 80px)" align="center" justify="center">
        <MotionVStack
          spacing={6}
          p={8}
          bg="gray.50"
          rounded="lg"
          shadow="md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Heading as="h2" size="xl">
            Welcome to Chandas AI
          </Heading>
          <Text fontSize="lg">Please log in to use the application.</Text>
          <MotionButton
            colorScheme="blue"
            size="lg"
            onClick={loginWithGoogle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login with Google
          </MotionButton>
        </MotionVStack>
      </Flex>
    </AnimatedPage>
  );
};

export default Home;
