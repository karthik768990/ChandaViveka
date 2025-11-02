import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook
import AnimatedPage from "../components/AnimationPage.jsx";

const MotionBox = motion.create(Box);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // ✅ initialize navigation

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

          {/* ✅ Go to Analyzer */}
          <Button
            colorScheme="blue"
            mt={8}
            onClick={() => navigate("/analyzer")}
          >
            Go to Analyzer
          </Button>

          {/* ✅ Account Settings (placeholder for now) */}
          <Button
            variant="outline"
            colorScheme="gray"
            className="Account-settings-button"
            mt={3}
            onClick={() => navigate("/settings")} // or change route if you add one
          >
            Account Settings
          </Button>
        </MotionBox>
      </VStack>
    </AnimatedPage>
  );
};

export default Dashboard;
