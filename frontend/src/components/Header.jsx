import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Button,
  useColorMode,
  IconButton,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext.jsx";

const Header = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  // Try to get user's name from metadata
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <Box
      bg="gray.800"
      w="100vw"
      px={{ base: 4, md: 8 }}
      py={3}
      shadow="md"
      position="sticky"
      top="0"
      zIndex="10"
    >
      <Flex
        align="center"
        justify="space-between"
        flexWrap="wrap"
        gap={{ base: 3, md: 0 }}
      >
        {/* Left Section */}
        <HStack spacing={6}>
          <Link to="/dashboard">
            <Text
              fontWeight="bold"
              fontSize={{ base: "lg", md: "xl" }}
              color="teal.200"
            >
              Chandas AI
            </Text>
          </Link>
          {user && (
            <>
              <Link to="/dashboard">
                <Text color="gray.300" _hover={{ color: "teal.200" }}>
                  Dashboard
                </Text>
              </Link>
              <Link to="/analyzer">
                <Text color="gray.300" _hover={{ color: "teal.200" }}>
                  Analyzer
                </Text>
              </Link>
            </>
          )}
        </HStack>

        <Spacer />

        {/* Right Section */}
        <HStack spacing={{ base: 2, md: 4 }}>
          <IconButton
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="teal.200"
            aria-label="Toggle color mode"
          />
          {user ? (
            <>
              <Text
                color="teal.100"
                fontWeight="medium"
                fontSize={{ base: "sm", md: "md" }}
              >
                {displayName}
              </Text>
              <Button colorScheme="red" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Text color="gray.400">Not logged in</Text>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
