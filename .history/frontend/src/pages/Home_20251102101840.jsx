import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Flex,
} from "@chakra-ui/react"; // ✅ All Chakra components imported from one place
import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimationPage.jsx";

// ✅ Create motion-enabled Chakra components
const MotionVStack = motion(VStack);
const MotionButton = motion(Button);

const Home = () => {
  const { user, loginWithGoogle } = useAuth();

  // ✅ Redirect to dashboard if user already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AnimatedPage>
      <Flex
        height="calc(100vh - 80px)"
        align="center"
        justify="center"
        bg="gray.100"
      >
        <MotionVStack
          spacing={6}
          p={8}
          bg="white"
          rounded="xl"
          shadow="lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Heading as="h2" size="xl" textAlign="center">
            Welcome to Chandas AI
          </Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center">
            Please log in to use the application.
          </Text>
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
