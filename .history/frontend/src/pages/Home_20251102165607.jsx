import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Box, Button, Heading, Text, VStack, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimationPage.jsx";
import { supabase } from "../services/supabaseClient.js";

const MotionVStack = motion.create(VStack);
const MotionButton = motion.create(Button);

const Home = () => {
  const { user } = useAuth();

  // ✅ If already logged in, send directly to Analyzer
  if (user) {
    return <Navigate to="/analyzer" replace />;
  }

  // ✅ Clean Google Login logic
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/auth/callback", // must match your Supabase setting
      },
    });
  };

  return (
    <AnimatedPage>
      <Flex
        align="center"
        justify="center"
        height="calc(100vh - 80px)"
        bgGradient="linear(to-b, blue.900, gray.900)"
      >
        <MotionVStack
          spacing={6}
          p={10}
          bg="whiteAlpha.100"
          rounded="2xl"
          shadow="2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Heading as="h2" size="xl" color="teal.200" fontFamily="Poppins, sans-serif">
            Welcome to Chandas AI
          </Heading>

          <Text
            fontSize="lg"
            color="gray.300"
            textAlign="center"
            fontFamily="Inter, sans-serif"
          >
            Identify Sanskrit meters effortlessly with AI assistance.
          </Text>

          <MotionButton
            colorScheme="teal"
            size="lg"
            onClick={handleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            shadow="md"
          >
            Login with Google
          </MotionButton>
        </MotionVStack>
      </Flex>
    </AnimatedPage>
  );
};

export default Home;
