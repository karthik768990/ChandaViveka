import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import AnimatedPage from '../components/AnimatedPage.jsx'; // 1. Import
import { motion } from 'framer-motion'; // 2. Import motion

// 3. Create motion-enabled Chakra components
const MotionVStack = motion(VStack);
const MotionButton = motion(Button);

const Home = () => {
  const { user, loginWithGoogle } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AnimatedPage> {/* 4. Wrap the page */}
      <Flex height="calc(100vh - 80px)" align="center" justify="center">
        {/* 5. Add "pop-in" animation to the card */}
        <MotionVStack
          spacing={6}
          p={8}
          bg="gray.50"
          rounded="lg"
          shadow="md"
          // Animation properties
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Heading as="h2" size="xl">
            Welcome to Chandas AI
          </Heading>
          <Text fontSize="lg">
            Please log in to use the application.
          </Text>
          {/* 6. Add microinteractions to the button */}
          <MotionButton
            colorScheme="blue"
            size="lg"
            onClick={loginWithGoogle}
            // Animation properties
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