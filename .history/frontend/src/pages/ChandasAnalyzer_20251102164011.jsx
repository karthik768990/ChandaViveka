// src/pages/ChandasAnalyzer.jsx
import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Textarea,
  Button,
  Text,
  Divider,
  useToast,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimationPage.jsx";

const MotionBox = motion.create(Box);

const ChandasAnalyzer = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const toast = useToast();

  const handleAnalyze = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a Sanskrit verse or shloka.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      toast({
        title: "Error analyzing verse",
        description: "Please check your backend connection.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <AnimatedPage>
      <Box minH="100vh" py={16} px={8} bgGradient="linear(to-br, gray.900, gray.800)">
        <MotionBox
          maxW="900px"
          mx="auto"
          p={8}
          rounded="2xl"
          bg="gray.800"
          shadow="2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 🕉️ Title */}
          <Heading
            as="h1"
            size="2xl"
            textAlign="center"
            mb={10}
            color="white"
            fontFamily="Cinzel, serif"
            letterSpacing="wide"
          >
            Chandas Analyzer
          </Heading>

          {/* 🪷 Input Area */}
          <VStack spacing={6} align="stretch">
            <Textarea
              placeholder="Enter your Sanskrit shloka here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              bg="gray.700"
              color="white"
              borderColor="gray.600"
              _focus={{ borderColor: "teal.400", boxShadow: "0 0 10px teal" }}
              rows={5}
            />
            <Button
              onClick={handleAnalyze}
              size="lg"
              colorScheme="teal"
              variant="solid"
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "0 0 20px teal",
              }}
              transition="all 0.3s ease"
            >
              Analyze
            </Button>
          </VStack>

          <Divider my={10} borderColor="gray.600" />

          {/* 🧭 Results Section */}
          {result && (
            <Box>
              <Heading
                size="lg"
                mb={6}
                color="white"
                fontFamily="Poppins, sans-serif"
                textAlign="center"
              >
                Available Meters
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {result.possibleMeters?.length > 0 ? (
                  result.possibleMeters.map((meter, idx) => (
                    <Card key={idx} bg="gray.700" border="1px solid" borderColor="teal.500">
                      <CardHeader>
                        <Text fontWeight="bold" color="teal.300">
                          {meter.name}
                        </Text>
                      </CardHeader>
                      <CardBody color="gray.300">
                        <Text>{meter.description}</Text>
                        <Text mt={2} fontSize="sm" color="gray.400">
                          Pattern: {meter.pattern}
                        </Text>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <Text textAlign="center" color="gray.400">
                    No matching Chandas found.
                  </Text>
                )}
              </SimpleGrid>
            </Box>
          )}
        </MotionBox>
      </Box>
    </AnimatedPage>
  );
};

export default ChandasAnalyzer;
