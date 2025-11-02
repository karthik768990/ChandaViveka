import React, { useState, useEffect } from 'react';
import api from '../services/api';

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
} from '@chakra-ui/react';

import AnimatedPage from '../components/AnimationPage';
import { motion, AnimatePresence } from 'framer-motion';

// Framer Motion v11+ requires motion.create()
const MotionCard = motion.create(Card);

const ChandasAnalyzer = () => {
  const [shloka, setShloka] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [chandasList, setChandasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available meters from DB
  useEffect(() => {
    const fetchChandas = async () => {
      try {
        const { data } = await api.get('/chandas');
        if (data.success) {
          setChandasList(data.data);
        }
      } catch (err) {
        console.error('Error fetching chandas list', err);
      }
    };
    fetchChandas();
  }, []);

  // Analyze the shloka
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const { data } = await api.post('/chandas/analyze', { shloka });
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <AnimatedPage>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} p={8}>
        {/* LEFT COLUMN — Analyzer */}
        <VStack spacing={6} align="stretch">
          <Heading as="h2">Chandas Analyzer</Heading>

          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Textarea
                rows={8}
                value={shloka}
                onChange={(e) => setShloka(e.target.value)}
                placeholder="Enter your śloka here (Devanagari or IAST)."
                shadow="sm"
                bg="white"
              />
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Analyzing..."
                isFullWidth
                as={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Analyze
              </Button>
            </VStack>
          </Box>

          {/* Display errors or results */}
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
                variant="outline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CardHeader>
                  <Heading size="md">Analysis Result</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Text>
                      <strong>Identified Chandas:</strong>{' '}
                      <Badge colorScheme="green" fontSize="md" px={2} py={1}>
                        {analysis.identifiedChandas || 'Unknown'}
                      </Badge>
                    </Text>

                    {/* ✅ FIXED: Safely display the pattern */}
                    {analysis.pattern && (
                      <Box>
                        <Text fontWeight="semibold">Laghu/Guru Pattern:</Text>
                        {typeof analysis.pattern === 'object' ? (
                          <VStack align="start" spacing={2} mt={2}>
                            {analysis.pattern.combined && (
                              <Code
                                p={2}
                                rounded="md"
                                display="block"
                                whiteSpace="pre-wrap"
                                letterSpacing="2px"
                              >
                                {analysis.pattern.combined}
                              </Code>
                            )}
                            {analysis.pattern.byPada && (
                              <Code
                                p={2}
                                rounded="md"
                                display="block"
                                whiteSpace="pre-wrap"
                                fontSize="sm"
                                bg="gray.50"
                              >
                                {analysis.pattern.byPada.join(' | ')}
                              </Code>
                            )}
                          </VStack>
                        ) : (
                          <Code
                            p={2}
                            rounded="md"
                            display="block"
                            whiteSpace="pre-wrap"
                          >
                            {analysis.pattern}
                          </Code>
                        )}
                      </Box>
                    )}

                    <Text>
                      <strong>Explanation:</strong> {analysis.explanation || '—'}
                    </Text>
                  </VStack>
                </CardBody>
              </MotionCard>
            )}
          </AnimatePresence>
        </VStack>

        {/* RIGHT COLUMN — Available Meters */}
        <VStack spacing={6} align="stretch">
          <Heading as="h3" size="lg">
            Available Meters
          </Heading>
          <Box bg="gray.50" p={4} rounded="md" shadow="sm" h="100%">
            {chandasList.length > 0 ? (
              <List spacing={3}>
                {chandasList.map((c) => (
                  <ListItem key={c.id || c.name} fontSize="sm">
                    <Text as="strong" color="blue.600" mr={2}>
                      {c.name}
                    </Text>
                    <Text as="span" color="gray.600">
                      {typeof c.pattern === 'string'
                        ? c.pattern
                        : JSON.stringify(c.pattern)}
                    </Text>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Spinner size="sm" color="blue.500" />
            )}
          </Box>
        </VStack>
      </SimpleGrid>
    </AnimatedPage>
  );
};

export default ChandasAnalyzer;
