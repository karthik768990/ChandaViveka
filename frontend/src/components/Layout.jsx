import React from "react";
import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import Header from "./Header";

const Layout = ({ children }) => {
  const bg = useColorModeValue("gray.50", "gray.900");
  return (
    <Box minH="100vh" bg={bg}>
      <Header />
      <Container maxW="1200px" pt={6} pb={12}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
