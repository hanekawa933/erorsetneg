import { Box, useColorMode, Image, Progress } from "@chakra-ui/react";
import Head from "next/head";

function Custom401() {
  return (
    <>
      <Head>
        <title>E-ROR | 401 - Unauthorized</title>
      </Head>
      <Box
        background="gray.800"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        width="100%"
        flexDir="column"
        color="white"
      >
        <Box display="flex" alignItems="center" px={["10", "0"]}>
          <Box width="14" height="14" mx="5">
            <Image src="/assets/img/EROR.png" alt="EROR LOGO" width="100%" />
          </Box>
          <Box>
            <Box as="h2" fontWeight="bold">
              E-ROR
            </Box>
            <Box as="h3" fontWeight="bold">
              Electronic - Repair For Request
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" px={["10", "0"]} mt="5">
          <Box as="h2" fontWeight="bold">
            401
          </Box>
          <Box
            height="10"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mx="5"
            width="0.5px"
            background="gray.500"
          ></Box>
          <Box>
            <Box as="h2" fontWeight="bold">
              Unauthorized
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Custom401;
