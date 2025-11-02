import React from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Link,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorModeValue,
  Text,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext.jsx";
import { HamburgerIcon } from "@chakra-ui/icons";

const Header = () => {
  const { user, logout } = useAuth();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg={bg}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      boxShadow="sm"
    >
      <Flex maxW="1200px" mx="auto" align="center" px={{ base: 4, md: 6 }} py={3}>
        <HStack spacing={4} align="center">
          <Link as={RouterLink} to="/" _hover={{ textDecor: "none" }}>
            <Text fontWeight="700" fontSize="lg" color={textColor}>
              Chandas AI
            </Text>
          </Link>
        </HStack>

        <HStack as="nav" spacing={4} ml={6} display={{ base: "none", md: "flex" }}>
          <Link as={NavLink} to="/" _hover={{ textDecor: "none" }}>
            Home
          </Link>
          {user && (
            <Link as={NavLink} to="/analyzer" _hover={{ textDecor: "none" }}>
              Chandas Analyzer
            </Link>
          )}
          {user && (
            <Link as={NavLink} to="/dashboard" _hover={{ textDecor: "none" }}>
              Dashboard
            </Link>
          )}
        </HStack>

        <Spacer />

        <HStack spacing={3}>
          {!user ? (
            <Text color="gray.500" display={{ base: "none", md: "block" }}>
              Please log in
            </Text>
          ) : (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                px={2}
                _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
              >
                <HStack spacing={3}>
                  <Avatar size="sm" src={user?.user_metadata?.picture || user?.avatar_url} />
                  <Box textAlign="left" display={{ base: "none", md: "block" }}>
                    <Text fontSize="sm" fontWeight="600" color={textColor}>
                      {user?.user_metadata?.full_name || user?.email}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {user?.email}
                    </Text>
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/dashboard">
                  Profile
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}

          {/* Mobile menu button (non-functional toggle — keeps simple UX) */}
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            display={{ base: "inline-flex", md: "none" }}
            variant="ghost"
            onClick={() => window.scrollTo({ top: 0 })}
          />
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
