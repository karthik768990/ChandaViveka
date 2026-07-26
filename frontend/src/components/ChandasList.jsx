import React from "react";
import { List, ListItem, HStack, Text, Spinner, Center, Card, CardBody } from "@chakra-ui/react";

const ChandasList = ({ chandasList, loading, cardBg, textColor, borderGlow }) => {
  return (
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
        {loading ? (
          <Center py={8}>
            <Spinner color="teal.500" size="xl" />
          </Center>
        ) : chandasList && chandasList.length > 0 ? (
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
                      : c.pattern?.combined || "—"}
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
          <Center py={8}>
            <Text color="gray.500">No meters found.</Text>
          </Center>
        )}
      </CardBody>
    </Card>
  );
};

export default ChandasList;
