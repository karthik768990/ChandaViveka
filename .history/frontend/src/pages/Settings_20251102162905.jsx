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

  // 💡 Use more contrast-friendly values
  const bgColor = useColorModeValue("gray.900", "gray.900"); // unified dark
  const cardBg = useColorModeValue("gray.800", "gray.800");

  const labelColor = useColorModeValue("teal.300", "teal.200");
  const inputColor = useColorModeValue("gray.200", "gray.100");
  const textColor = useColorModeValue("gray.300", "gray.300");

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
          border="1px solid"
          borderColor="whiteAlpha.200"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading
            fontFamily="'Poppins', sans-serif"
            fontWeight="600"
            fontSize="3xl"
            mb={6}
            textAlign="center"
            bgGradient="linear(to-r, teal.300, blue.400)"
            bgClip="text"
          >
            Account Settings
          </Heading>

          <Text textAlign="center" color={textColor} mb={6}>
            Manage your account details and preferences below.
          </Text>

          <Divider mb={8} borderColor="whiteAlpha.300" />

          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel color={labelColor} fontFamily="'Inter', sans-serif">
                Full Name
              </FormLabel>
              <Input
                value={displayName}
                isReadOnly
                variant="filled"
                bg="gray.700"
                color={inputColor}
                _hover={{ bg: "gray.600" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={labelColor} fontFamily="'Inter', sans-serif">
                Email Address
              </FormLabel>
              <Input
                value={user?.email || ""}
                isReadOnly
                variant="filled"
                bg="gray.700"
                color={inputColor}
                _hover={{ bg: "gray.600" }}
              />
            </FormControl>

            <Divider borderColor="whiteAlpha.300" />

            <Button
              colorScheme="teal"
              variant="solid"
              size="lg"
              fontFamily="'Poppins', sans-serif"
            >
              Change Password
            </Button>

            <Button
              colorScheme="red"
              variant="outline"
              size="lg"
              fontFamily="'Poppins', sans-serif"
              _hover={{ bg: "red.500", color: "white" }}
            >
              Delete Account
            </Button>
          </VStack>
        </MotionBox>
      </Box>
    </AnimatedPage>
  );
};

export default Settings;
