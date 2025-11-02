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
  const isLaghu = char === "L" || char === "l";
  const bg = isLaghu ? "rgba(56, 178, 172, 0.15)" : "rgba(128, 90, 213, 0.15)";
  const color = isLaghu ? "teal.300" : "purple.300";
  return (
    <Badge
      px={2}
      py={1}
      rounded="md"
      bg={bg}
      color={color}
      fontWeight="600"
      fontSize="sm"
      borderWidth="1px"
      borderColor={isLaghu ? "teal.400" : "purple.400"}
    >
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

  // theme-controlled colors
  const cardBg = useColorModeValue("whiteAlpha.900", "gray.900");
  const inputBg = useColorModeValue("gray.50", "gray.800");
  const borderGlow = useColorModeValue("#63B3ED", "#81E6D9");
  const textColor = useColorModeValue("gray.700", "gray.200");

  useEffect(() => {
    const fetchChandas = async () => {
      try {
        const { data } = await api.get("/chandas");
        if (data.success) setChandasList(data.data);
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
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} p={4}>
        {/* LEFT PANEL */}
        <VStack spacing={6} align="stretch">
          <Heading as="h2" size="lg" color={textColor}>
            Chandas Analyzer
          </Heading>

          <Card
            bg={cardBg}
            shadow="lg"
            borderWidth="1px"
            borderColor="transparent"
            transition="all 0.3s ease"
            _hover={{
              borderColor: borderGlow,
              boxShadow: `0 0 15px ${borderGlow}`,
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
                    color={textColor}
                    borderColor="transparent"
                    borderWidth="1px"
                    rounded="lg"
                    transition="all 0.3s ease"
                    _hover={{
                      borderColor: borderGlow,
                      boxShadow: `0 0 10px ${borderGlow}`,
                    }}
                    _focus={{
                      borderColor: borderGlow,
                      boxShadow: `0 0 15px ${borderGlow}`,
                    }}
                  />

                  <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={loading}
                    loadingText="Analyzing..."
                    width="100%"
                    as={motion.button}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
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
                borderColor="transparent"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                _hover={{
                  borderColor: borderGlow,
                  boxShadow: `0 0 15px ${borderGlow}`,
                }}
              >
                <CardHeader>
                  <Heading size="md" color={textColor}>
                    Analysis Result
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <Text fontWeight="semibold" color={textColor}>
                        Identified Chandas:
                      </Text>
                      <Badge colorScheme="green">
                        {analysis.identifiedChandas || "Unknown"}
                      </Badge>
                    </HStack>

                    <Box>
                      <Text fontWeight="semibold" color={textColor}>
                        Laghu/Guru Pattern:
                      </Text>
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
                                      <Text fontSize="sm" color="gray.400">
                                        Pada {idx + 1}:
                                      </Text>
                                      <Box mt={1}>{renderPatternStringAsChips(p)}</Box>
                                    </Box>
                                  ))}
                                </VStack>
                              )}
                            </>
                          ) : (
                            <Code
                              p={2}
                              rounded="md"
                              display="block"
                              whiteSpace="pre-wrap"
                              color={textColor}
                            >
                              {analysis.pattern}
                            </Code>
                          )
                        ) : (
                          <Text color="gray.500">N/A</Text>
                        )}
                      </Box>
                    </Box>

                    <Box>
                      <Text fontWeight="semibold" color={textColor}>
                        Explanation:
                      </Text>
                      <Text mt={1} color="gray.400">
                        {analysis.explanation || "—"}
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </MotionCard>
            )}
          </AnimatePresence>
        </VStack>

        {/* RIGHT PANEL */}
        <VStack spacing={6} align="stretch">
          <Heading as="h3" size="lg" color={textColor}>
            Available Meters
          </Heading>
          <Card
            bg={cardBg}
            shadow="lg"
            borderWidth="1px"
            borderColor="transparent"
            transition="all 0.3s ease"
            _hover={{
              borderColor: borderGlow,
              boxShadow: `0 0 15px ${borderGlow}`,
            }}
          >
            <CardBody>
              {chandasList.length > 0 ? (
                <List spacing={4}>
                  {chandasList.map((c) => (
                    <ListItem key={c.id || c.name}>
                      <HStack justify="space-between">
                        <Text fontWeight="600" color={textColor}>
                          {c.name}
                        </Text>
                        <Text color="gray.400" fontSize="sm">
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
