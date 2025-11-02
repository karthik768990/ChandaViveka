import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Avatar,
  HStack,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";
import AnimatedPage from "../components/AnimationPage";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/auth/profile");
        if (data.success) {
          // some APIs return profile in data.user or data.profile — adapt safely
          setProfile(data.user || data.profile || data);
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <AnimatedPage>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Dashboard</Heading>

        {loading ? (
          <Spinner />
        ) : error ? (
          <Box color="red.500">{error}</Box>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card bg={cardBg} shadow="sm">
                <CardHeader>
                  <HStack spacing={4}>
                    <Avatar
                      size="lg"
                      src={
                        profile?.user_metadata?.picture ||
                        profile?.avatar_url ||
                        user?.user_metadata?.picture
                      }
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="700">
                        {profile?.user_metadata?.full_name || profile?.email || user?.email}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {profile?.email}
                      </Text>
                    </VStack>
                    <Badge ml="auto" colorScheme="green" px={3} py={1}>
                      {profile?.role || "authenticated"}
                    </Badge>
                  </HStack>
                </CardHeader>
                <Divider />
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Text fontSize="sm" color="gray.600">
                      Last sign in:{" "}
                      <Text as="span" fontWeight="600" color="gray.700">
                        {profile?.last_sign_in_at
                          ? new Date(profile.last_sign_in_at).toLocaleString()
                          : "—"}
                      </Text>
                    </Text>

                    <Text fontSize="sm" color="gray.600">
                      Created at:{" "}
                      <Text as="span" fontWeight="600" color="gray.700">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleString() : "—"}
                      </Text>
                    </Text>

                    <Button
                      size="sm"
                      as="a"
                      href="/"
                      variant="ghost"
                      colorScheme="blue"
                    >
                      Open app home
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} shadow="sm">
                <CardHeader>
                  <Heading size="sm">Account</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Text fontSize="sm">
                      Provider:{" "}
                      <Text as="span" fontWeight="600">
                        {profile?.app_metadata?.provider || "google"}
                      </Text>
                    </Text>

                    <Text fontSize="sm">
                      Email confirmed:{" "}
                      <Text as="span" fontWeight="600">
                        {profile?.email_confirmed_at ? "Yes" : "No"}
                      </Text>
                    </Text>

                    <Button size="sm" variant="outline" colorScheme="blue">
                      Account settings
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Raw JSON accordion — collapsible so it doesn't dominate the UI */}
            <Accordion allowToggle mt={4}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      View raw profile JSON
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Box as="pre" bg="gray.50" p={4} rounded="md" overflowX="auto">
                    {JSON.stringify(profile, null, 2)}
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </VStack>
    </AnimatedPage>
  );
};

export default Dashboard;
