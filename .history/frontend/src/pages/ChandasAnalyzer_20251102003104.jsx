import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box,
  Heading,
  Textarea,
  Button,
  Alert, // <-- Note: AlertIcon is GONE from this list
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
} from '@chakra-ui/react';

// --- ADD THIS NEW LINE ---
import { AlertIcon } from '@chakra-ui/alert';
// --- END NEW LINE ---
import AnimatedPage from '../components/AnimationPage';
import { motion, AnimatePresence } from 'framer-motion'; // 2. Import

// 3. Create a motion-enabled component
const MotionCard = motion(Card);

const ChandasAnalyzer = () => {
  const [shloka, setShloka] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [chandasList, setChandasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // (useEffect hook is unchanged)
  useEffect(() => {
    const fetchChandas = async () => {
      try {
        const { data } = await api.get('/chandas');
        if (data.success) {
          setChandasList(data.data);
        }
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
    <AnimatedPage> {/* 4. Wrap the whole page */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} p={8}>
        
        {/* LEFT COLUMN: INPUT */}
        <VStack spacing={6} align="stretch">
          <Heading as="h2">Chandas Analyzer</Heading>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Textarea
                rows={8}
                value={shloka}
                onChange={(e) => setShloka(e.target.value)}
                placeholder="Enter your śloka here (Devanagari or IAST). Try a full verse!"
                shadow="sm"
                bg="white"
              />
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Analyzing..."
                isFullWidth
                // 5. Add microinteractions to button
                as={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Analyze
              </Button>
            </VStack>
          </Box>

          {/* 6. Animate the Error/Analysis results */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert status="error" rounded="md">
                  <AlertIcon />
                  {error}
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
                        {analysis.identifiedChandas}
                      </Badge>
                    </Text>
                    <Box>
                      <Text><strong>Laghu/Guru Pattern:</strong></Text>
                      <Code p={2} rounded="md" display="block" whiteSpace="pre-wrap" letterSpacing="2px">
                        {analysis.pattern || 'N/A'}
                      </Code>
                    </Box>
                    <Text>
                      <strong>Explanation:</strong> {analysis.explanation}
                    </Text>
                  </VStack>
                </CardBody>
              </MotionCard>
            )}
          </AnimatePresence>

        </VStack>

        {/* RIGHT COLUMN: DB LIST */}
        <VStack spacing={6} align="stretch">
          <Heading as="h3" size="lg">Available Meters</Heading>
          <Box bg="gray.50" p={4} rounded="md" shadow="sm" h="100%">
            <List spacing={3}>
              {chandasList.length > 0 ? (
                chandasList.map((c) => (
                  <ListItem key={c.id || c.name} fontSize="sm">
                    <Text as="strong" color="blue.600" mr={2}>{c.name}</Text>
                    <Text as="span" color="gray.600">{c.pattern}</Text>
                  </ListItem>
                ))
              ) : (
                <Text>Loading chandas list...</Text>
              )}
            </List>
          </Box>
        </VStack>

      </SimpleGrid>
    </AnimatedPage>
  );
};

export default ChandasAnalyzer;