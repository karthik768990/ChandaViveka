import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Button,
  useColorMode,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext.jsx";

const Header = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg="gray.800" px={8} py={3} shadow="md" position="sticky" top="0" zIndex="10">
      <Flex justify="space-between" align="center">
        <HStack spacing={6}>
          <Link to="/">
            <Text fontWeight="bold" fontSize="xl" color="teal.200">
              Chandas AI
            </Text>
          </Link>
          {user && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/analyzer">Analyzer</Link>
            </>
          )}
        </HStack>

        <HStack spacing={4}>
          <IconButton
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="teal.200"
          />
          {user ? (
            <>
              <Text color="gray.300">{user.email}</Text>
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
