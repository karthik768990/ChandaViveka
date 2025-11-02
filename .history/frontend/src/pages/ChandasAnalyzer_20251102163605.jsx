import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Box,
  Heading,
  Textarea,
  Button,
  Alert,
  Code,
  List,
  ListItem,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Spinner,
  HStack,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import AnimatedPage from "../components/AnimationPage";
import { motion, AnimatePresence } from "framer-motion";

const MotionCard = motion.create(Card);

const PatternChip = ({ char }) => {
  const bg = char === "L" || char === "l" ? "teal.50" : "purple.50";
  const color = char === "L" || char === "l" ? "teal.700" : "purple.700";
  return (
    <Badge px={2} py={1} rounded="sm" bg={bg} color={color} fontWeight="600" fontSize="sm" mr={1}>
      {char.toUpperCase()}
    </Badge>
  );
};

const renderPatternStringAsChips = (str = "") => (
  <Wrap spacing={2}>
    {str.split("").map((c, i) => (
      <WrapItem key={i}>
        <PatternChip char={c} />
      </WrapItem>
    ))}
  </Wrap>
);

const ChandasAnalyzer = () => {
  const [shloka, setShloka] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [chandasList, setChandasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const borderGlow = useColorModeValue("teal.300", "teal.400");

  useEffect(() => {
    const fetchChandas = async () => {
      try {
        const { data } = await api.get("/chandas");
        if (data.success) setChandasList(data.data);
        else setChandasList([]);
      } catch (err) {
        console.error("Error fetching chandas list", err);
      }
    };
    fetchChandas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const { data } = await api.post("/chandas/analyze", { shloka });
      if (data.success) setAnalysis(data.analysis);
      else setError(data.message || "Unable to analyze");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} p={2}>
        {/* LEFT SIDE */}
        <VStack spacing={6} align="stretch">
          <Heading as="h2" size="lg">
            Chandas Analyzer
          </Heading>

          <Card
            bg={cardBg}
            shadow="md"
            _hover={{
              boxShadow: `0 0 8px ${borderGlow}`,
              transition: "box-shadow 0.3s ease-in-out",
            }}
          >
            <CardBody>
              <Box as="form" onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <Textarea
                    rows={8}
                    value={shloka}
                    onChange={(e) => setShloka(e.target.value)}
                    placeholder="Enter your śloka here (Devanagari or IAST)"
                    bg={inputBg}
                    borderColor="transparent"
                    _hover={{
                      borderColor: borderGlow,
                      boxShadow: `0 0 6px ${borderGlow}`,
                      transition: "box-shadow 0.3s ease-in-out",
                    }}
                    _focus={{
                      borderColor: borderGlow,
                      boxShadow: `0 0 10px ${borderGlow}`,
                    }}
                  />

                  <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={loading}
                    loadingText="Analyzing..."
                    width="100%"
                    as={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Analyze
                  </Button>
                </VStack>
              </Box>
            </CardBody>
          </Card>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert status="error" rounded="md">
                  ⚠️ {error}
                </Alert>
              </motion.div>
            )}

            {analysis && (
              <MotionCard
                bg={cardBg}
                variant="outline"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                _hover={{
                  boxShadow: `0 0 8px ${borderGlow}`,
                }}
              >
                <CardHeader>
                  <Heading size="md">Analysis Result</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <Text fontWeight="semibold">Identified Chandas:</Text>
                      <Badge colorScheme="green">
                        {analysis.identifiedChandas || "Unknown"}
                      </Badge>
                    </HStack>

                    <Box>
                      <Text fontWeight="semibold">Laghu/Guru Pattern:</Text>
                      <Box mt={2}>
                        {analysis.pattern ? (
                          typeof analysis.pattern === "object" ? (
                            <>
                              {analysis.pattern.combined && (
                                <Box mb={2}>
                                  {renderPatternStringAsChips(analysis.pattern.combined)}
                                </Box>
                              )}
                              {analysis.pattern.byPada && (
                                <VStack align="start" spacing={2}>
                                  {analysis.pattern.byPada.map((p, idx) => (
                                    <Box key={idx}>
                                      <Text fontSize="sm" color="gray.500">
                                        Pada {idx + 1}:
                                      </Text>
                                      <Box mt={1}>{renderPatternStringAsChips(p)}</Box>
                                    </Box>
                                  ))}
                                </VStack>
                              )}
                            </>
                          ) : (
                            <Code p={2} rounded="md" display="block" whiteSpace="pre-wrap">
                              {analysis.pattern}
                            </Code>
                          )
                        ) : (
                          <Text color="gray.500">N/A</Text>
                        )}
                      </Box>
                    </Box>

                    <Box>
                      <Text fontWeight="semibold">Explanation:</Text>
                      <Text mt={1} color="gray.600">
                        {analysis.explanation || "—"}
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </MotionCard>
            )}
          </AnimatePresence>
        </VStack>

        {/* RIGHT SIDE: Available Meters */}
        <VStack spacing={6} align="stretch">
          <Heading as="h3" size="lg">
            Available Meters
          </Heading>
          <Card
            bg={cardBg}
            shadow="md"
            _hover={{
              boxShadow: `0 0 8px ${borderGlow}`,
              transition: "box-shadow 0.3s ease-in-out",
            }}
          >
            <CardBody>
              {chandasList.length > 0 ? (
                <List spacing={3}>
                  {chandasList.map((c) => (
                    <ListItem key={c.id || c.name}>
                      <HStack justify="space-between">
                        <Text fontWeight="600">{c.name}</Text>
                        <Text color="gray.500" fontSize="sm">
                          {typeof c.pattern === "string"
                            ? c.pattern
                            : c.pattern.combined || "—"}
                        </Text>
                      </HStack>
                      {c.description && (
                        <Text mt={1} fontSize="sm" color="gray.500">
                          {c.description.length > 120
                            ? `${c.description.slice(0, 117)}...`
                            : c.description}
                        </Text>
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Spinner />
              )}
            </CardBody>
          </Card>
        </VStack>
      </SimpleGrid>
    </AnimatedPage>
  );
};

export default ChandasAnalyzer;
