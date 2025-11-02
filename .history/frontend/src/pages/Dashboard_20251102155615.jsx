import { Box, Heading, Text, VStack, Button, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimationPage.jsx";

const MotionBox = motion.create(Box);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Extract name safely from Supabase user metadata
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "User";

  return (
    <AnimatedPage>
      {/* Background Container */}
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bgGradient="linear(to-br, gray.900, teal.900)"
        p={6}
      >
        <MotionBox
          bg="whiteAlpha.100"
          backdropFilter="blur(10px)"
          p={10}
          rounded="2xl"
          shadow="2xl"
          width="90%"
          maxW="600px"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={6} align="center">
            <Heading color="teal.200">Dashboard</Heading>

            <Text fontSize="lg" color="gray.300">
              Welcome, {userName}!
            </Text>

            <Text textAlign="center" color="gray.400" px={4}>
              From here, you can analyze Sanskrit verses and view your account
              settings.
            </Text>

            {/* ✅ Buttons vertically aligned */}
            <VStack spacing={4} w="full" mt={6}>
              <Button
                colorScheme="blue"
                width="full"
                onClick={() => navigate("/analyzer")}
              >
                Go to Analyzer
              </Button>

              <Button
                variant="outline"
                colorScheme="gray"
                width="full"
                onClick={() => navigate("/settings")}
              >
                Account Settings
              </Button>
            </VStack>
          </VStack>
        </MotionBox>
      </Flex>
    </AnimatedPage>
  );
};

export default Dashboard;
