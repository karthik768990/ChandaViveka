import { Box, Heading, Text, VStack, Button, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimationPage.jsx";

const MotionBox = motion.create(Box);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Safely extract user’s name from Supabase metadata
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "User";

  return (
    <AnimatedPage>
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bgGradient="linear(to-br, gray.900, teal.900)"
        p={6}
      >
        <MotionBox
          bg="whiteAlpha.100"
          backdropFilter="blur(14px)"
          p={12}
          rounded="3xl"
          shadow="2xl"
          width="90%"
          maxW="600px"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={6} align="center">
            {/* 🌀 Stylish Heading */}
            <Heading
              size="2xl"
              bgGradient="linear(to-r, teal.200, cyan.400)"
              bgClip="text"
              textAlign="center"
              fontWeight="extrabold"
              letterSpacing="wide"
            >
              Dashboard
            </Heading>

            {/* 👋 Welcome Message */}
            <Text
              fontSize="xl"
              color="gray.200"
              fontWeight="semibold"
              textAlign="center"
            >
              Welcome back,{" "}
              <Text as="span" color="teal.300" fontWeight="bold">
                {userName}
              </Text>
              👋
            </Text>

            {/* 💬 Description */}
            <Text
              textAlign="center"
              color="gray.400"
              lineHeight="tall"
              fontSize="md"
              px={4}
              maxW="md"
            >
              From here, you can analyze Sanskrit verses, manage your account,
              and view your analysis history — all in one place.
            </Text>

            {/* 🧭 Buttons Section */}
            <VStack spacing={4} w="full" mt={6}>
              <Button
                colorScheme="teal"
                width="full"
                size="lg"
                shadow="md"
                _hover={{
                  transform: "scale(1.05)",
                  shadow: "xl",
                }}
                transition="all 0.2s"
                onClick={() => navigate("/analyzer")}
              >
                🔍 Go to Analyzer
              </Button>

              <Button
                variant="outline"
                colorScheme="gray"
                width="full"
                size="lg"
                _hover={{
                  bg: "whiteAlpha.200",
                  transform: "scale(1.03)",
                }}
                transition="all 0.2s"
                onClick={() => navigate("/settings")}
              >
                ⚙️ Account Settings
              </Button>
            </VStack>
          </VStack>
        </MotionBox>
      </Flex>
    </AnimatedPage>
  );
};

export default Dashboard;
