import { Link } from 'react-router-dom';
import { Flex, Box, Button, HStack, Text } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <Flex
      justify="space-between"
      align="center"
      px="6"
      py="4"
      bg="brand.800"
      boxShadow="md"
    >
      <HStack spacing={6}>
        <Link to="/">
          <Text fontWeight="bold" fontSize="xl" color="teal.200">Chandas</Text>
        </Link>
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/analyzer">Analyzer</Link>
          </>
        )}
      </HStack>

      <HStack spacing={4}>
        {user ? (
          <>
            <Text color="teal.100">{user.email}</Text>
            <Link to="/settings">
              <Button leftIcon={<SettingsIcon />} colorScheme="teal" variant="outline" size="sm">
                Settings
              </Button>
            </Link>
          </>
        ) : (
          <Text color="gray.300">Not logged in</Text>
        )}
      </HStack>
    </Flex>
  );
};

export default Header;
