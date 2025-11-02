// src/pages/Settings.jsx
import {
  Box,
  Heading,
  VStack,
  Text,
  Input,
  Button,
  Divider,
  useColorModeValue,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import AnimatedPage from "../components/AnimationPage.jsx";

const MotionBox = motion.create(Box);

const Settings = () => {
  const { user } = useAuth();

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <AnimatedPage>
      <Box minH="100vh" bg={bgColor} py={16} px={6}>
        <MotionBox
          maxW="600px"
          mx="auto"
          p={8}
          rounded="2xl"
          bg={cardBg}
          shadow="2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading
            fontSize="3xl"
            mb={6}
            textAlign="center"
            bgGradient="linear(to-r, teal.300, blue.400)"
            bgClip="text"
          >
            Account Settings
          </Heading>

          <Text textAlign="center" color="gray.400" mb={6}>
            Manage your account details and preferences below.
          </Text>

          <Divider mb={8} />

          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel color="teal.300">Full Name</FormLabel>
              <Input
                value={displayName}
                isReadOnly
                variant="filled"
                color="gray.300"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="teal.300">Email Address</FormLabel>
              <Input
                value={user?.email || ""}
                isReadOnly
                variant="filled"
                color="gray.300"
              />
            </FormControl>

            <Divider />

            <Button colorScheme="teal" variant="outline" size="lg">
              Change Password
            </Button>

            <Button colorScheme="red" variant="solid" size="lg">
              Delete Account
            </Button>
          </VStack>
        </MotionBox>
      </Box>
    </AnimatedPage>
  );
};

export default Settings;
