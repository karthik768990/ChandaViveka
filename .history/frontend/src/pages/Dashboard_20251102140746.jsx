import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import AnimatedPage from "../components/AnimationPage.jsx";

const MotionBox = motion.create(Box);

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <AnimatedPage>
      <VStack spacing={8} align="center" mt={16}>
        <MotionBox
          bg="whiteAlpha.100"
          p={8}
          rounded="2xl"
          shadow="2xl"
          width="80%"
          maxW="600px"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Heading color="teal.200" mb={4}>
            Dashboard
          </Heading>
          <Text fontSize="lg" color="gray.300">
            Welcome, {user?.email || "user"}!
          </Text>
          <Text mt={4} color="gray.400">
            From here, you can analyze Sanskrit verses and view your account settings.
          </Text>

          <Button colorScheme="blue" mt={8} >
            Go to Analyzer
          </Button>

          <Button variant="outline" colorScheme="gray" mt={3}>
            Account Settings
          </Button>
        </MotionBox>
      </VStack>
    </AnimatedPage>
  );
};

export default Dashboard;
