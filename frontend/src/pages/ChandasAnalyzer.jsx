import React from "react";
import {
  Heading,
  Alert,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import AnimatedPage from "../components/AnimationPage";
import { motion, AnimatePresence } from "framer-motion";
import { useChandasAnalyzer } from "../hooks/useChandasAnalyzer";
import AnalyzerInput from "../components/AnalyzerInput";
import AnalyzerResult from "../components/AnalyzerResult";
import ChandasList from "../components/ChandasList";

const ChandasAnalyzer = () => {
  const {
    shloka,
    setShloka,
    analysis,
    chandasList,
    loading,
    listLoading,
    error,
    handleSubmit,
  } = useChandasAnalyzer();

  // theme-controlled colors
  const cardBg = useColorModeValue("whiteAlpha.900", "gray.900");
  const inputBg = useColorModeValue("gray.50", "gray.800");
  const borderGlow = useColorModeValue("#63B3ED", "#81E6D9");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <AnimatedPage>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} p={4}>
        {/* LEFT PANEL */}
        <VStack spacing={6} align="stretch">
          <Heading as="h2" size="lg" color="white">
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
              <AnalyzerInput
                shloka={shloka}
                setShloka={setShloka}
                handleSubmit={handleSubmit}
                loading={loading}
                inputBg={inputBg}
                textColor={textColor}
                borderGlow={borderGlow}
              />
            </CardBody>
          </Card>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Alert status="error" rounded="md">
                  ⚠️ {error}
                </Alert>
              </motion.div>
            )}

            {analysis && (
              <AnalyzerResult
                analysis={analysis}
                cardBg={cardBg}
                textColor={textColor}
                borderGlow={borderGlow}
              />
            )}
          </AnimatePresence>
        </VStack>

        {/* RIGHT PANEL */}
        <VStack spacing={6} align="stretch">
          <Heading as="h3" size="lg" color="white">
            Available Meters
          </Heading>
          
          <ChandasList
            chandasList={chandasList}
            loading={listLoading}
            cardBg={cardBg}
            textColor={textColor}
            borderGlow={borderGlow}
          />
        </VStack>
      </SimpleGrid>
    </AnimatedPage>
  );
};

export default ChandasAnalyzer;
