import React from "react";
import { Box, VStack, Textarea, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";

const AnalyzerInput = ({ shloka, setShloka, handleSubmit, loading, inputBg, textColor, borderGlow }) => {
  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
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
  );
};

export default AnalyzerInput;
