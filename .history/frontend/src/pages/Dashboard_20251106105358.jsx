import { Box, Heading, Text, VStack, Button, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimationPage.jsx";

const MotionBox = motion.create(Box);
const MotionText = motion.create(Text);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Safely extract user’s name
  const userName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "User";

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
            {/* 🌈 Gradient Heading */}
            <Heading
              fontFamily="'Fira Code','Poppins', sans-serif"
              size="2xl"
              bgGradient="linear(to-r, teal.300, cyan.400)"
              bgClip="text"
              textAlign="center"
              fontWeight="extrabold"
              letterSpacing="wide"
            >
              Dashboard
            </Heading>

            {/* 💫 Animated Welcome Text */}
            <MotionText
              fontFamily="'Inter', sans-serif"
              fontSize="xl"
              color="teal.200"
              textShadow="0 0 10px rgba(56, 178, 172, 0.8)"
              fontWeight="bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Welcome back, {userName}! 👋
            </MotionText>

            {/* 🪶 Subheading */}
            <Text
              fontFamily="'Nunito Sans', sans-serif"
              fontSize="md"
              color="gray.300"
              textAlign="center"
              letterSpacing="wide"
              maxW="md"
            >
              Manage your Sanskrit verse analysis and account — all in one
              beautifully simple dashboard.
            </Text>

            {/* 💭 Extra Description */}
            <Text
              fontFamily="'Open Sans', sans-serif"
              fontSize="sm"
              color="gray.400"
              lineHeight="taller"
              textAlign="center"
              px={4}
              maxW="md"
            >
              Track your activity, explore patterns, and enhance your learning
              experience with intuitive tools crafted just for you.
            </Text>

            {/* 🧭 Buttons Section */}
            <VStack spacing={4} w="full" mt={6}>
              <Button
                fontFamily="'Rubik', sans-serif"
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
                fontFamily="'Roboto Slab', serif"
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
