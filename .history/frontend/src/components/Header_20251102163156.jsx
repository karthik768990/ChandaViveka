import { Link, useNavigate } from "react-router-dom";
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
import { MoonIcon, SunIcon, SettingsIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext.jsx";

const Header = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <Box
      bg="gray.900"
      w="100vw"
      px={{ base: 4, md: 8 }}
      py={3}
      shadow="xl"
      position="sticky"
      top="0"
      zIndex="10"
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
      transition="all 0.3s ease"
    >
      <Flex
        align="center"
        justify="space-between"
        flexWrap="wrap"
        gap={{ base: 3, md: 0 }}
      >
        {/* Left Section */}
        <HStack spacing={6}>
          <Link to="/">
            <Text
              fontWeight="bold"
              fontSize={{ base: "lg", md: "xl" }}
              color="teal.200"
              transition="all 0.3s ease"
              _hover={{
                textShadow: "0 0 10px #38B2AC, 0 0 20px #319795",
                transform: "scale(1.05)",
              }}
            >
              Chandas AI
            </Text>
          </Link>

          {user && (
            <>
              <Link to="/analyzer">
                <Text
                  color="gray.300"
                  transition="all 0.3s ease"
                  _hover={{
                    color: "teal.200",
                    textShadow: "0 0 10px #38B2AC, 0 0 20px #319795",
                    transform: "scale(1.05)",
                  }}
                >
                  Analyzer
                </Text>
              </Link>
            </>
          )}
        </HStack>

        <Spacer />

        {/* Right Section */}
        <HStack spacing={{ base: 2, md: 4 }}>
          {/* Theme Toggle */}
          <IconButton
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="teal.200"
            transition="all 0.3s ease"
            _hover={{
              boxShadow: "0 0 10px #38B2AC, 0 0 20px #319795",
              transform: "scale(1.1)",
            }}
            aria-label="Toggle color mode"
          />

          {/* Settings Icon */}
          {user && (
            <IconButton
              icon={<SettingsIcon />}
              variant="ghost"
              color="teal.200"
              transition="all 0.3s ease"
              _hover={{
                boxShadow: "0 0 10px #38B2AC, 0 0 20px #319795",
                transform: "scale(1.1)",
              }}
              aria-label="Settings"
              onClick={() => navigate("/settings")}
            />
          )}

          {/* Username and Logout */}
          {user ? (
            <>
              <Text
                color="teal.100"
                fontWeight="medium"
                fontSize={{ base: "sm", md: "md" }}
                transition="all 0.3s ease"
                _hover={{
                  textShadow: "0 0 10px #38B2AC, 0 0 20px #319795",
                }}
              >
                {displayName}
              </Text>
              <Button
                colorScheme="red"
                size="sm"
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: "0 0 10px #E53E3E, 0 0 20px #C53030",
                  transform: "scale(1.05)",
                }}
                onClick={logout}
              >
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
