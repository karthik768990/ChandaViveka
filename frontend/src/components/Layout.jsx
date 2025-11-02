import Header from "./Header.jsx";
import { Box } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Box minH="100vh" bgGradient="linear(to-b, gray.900, gray.800)">
      <Header />
      <Box as="main" p={6}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
