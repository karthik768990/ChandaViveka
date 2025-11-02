import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

const Callback = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      // small delay for UX, then navigate
      const t = setTimeout(() => navigate("/dashboard"), 300);
      return () => clearTimeout(t);
    }
  }, [session, navigate]);

  return (
    <Center minH="60vh">
      <VStack spacing={3}>
        <Spinner size="lg" />
        <Text>Processing login... Please wait.</Text>
      </VStack>
    </Center>
  );
};

export default Callback;
