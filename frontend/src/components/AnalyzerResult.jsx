import React from "react";
import { Box, VStack, HStack, Text, Badge, Code, Card, CardHeader, CardBody, Heading, Wrap, WrapItem } from "@chakra-ui/react";
import { motion } from "framer-motion";

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

const AnalyzerResult = ({ analysis, cardBg, textColor, borderGlow }) => {
  if (!analysis) return null;

  return (
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
                            <Box mt={1}>
                              {renderPatternStringAsChips(p)}
                            </Box>
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
  );
};

export default AnalyzerResult;
