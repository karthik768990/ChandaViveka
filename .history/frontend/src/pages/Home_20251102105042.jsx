import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Flex,
  useColorModeValue,
  Container,
} from "@chakra-ui/react";
import AnimatedPage from "../components/AnimationPage.jsx";
import { motion } from "framer-motion";

// Framer Motion v11+ API
const MotionVStack = motion.create(VStack);
const MotionButton = motion.create(Button);

const Home = () => {
  const { user, loginWithGoogle } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const pageBg = useColorModeValue("linear-gradient(180deg,#f8fafc, #ffffff)", "");
  return (
    <AnimatedPage>
      <Flex align="center" justify="center" minH="calc(100vh - 96px)">
        <Container maxW="container.md">
          <MotionVStack
            spacing={6}
            p={{ base: 6, md: 10 }}
            bg="white"
            rounded="xl"
            shadow="lg"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.36 }}
            align="center"
          >
            <Heading as="h1" size="xl" textAlign="center">
              Chandas AI
            </Heading>
            <Text fontSize="lg" color="gray.600" textAlign="center" maxW="lg">
              Analyze Sanskrit ślokas and automatically identify classical meters
              (chandas). Sign in with Google to save your history and preferences.
            </Text>

            <MotionButton
              onClick={loginWithGoogle}
              size="lg"
              colorScheme="blue"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign in with Google
            </MotionButton>

            <Box pt={2} fontSize="sm" color="gray.500">
              No data is shared publicly — authentication is via Supabase OAuth.
            </Box>
          </MotionVStack>
        </Container>
      </Flex>
    </AnimatedPage>
  );
};

export default Home;
