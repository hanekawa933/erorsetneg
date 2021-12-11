import { Box, useColorMode, Image, Progress } from "@chakra-ui/react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { useEffect } from "react";

function Loading() {
  const { colorMode } = useColorMode();

  return (
    <Box
      background="blackAlpha.700"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
      flexDir="column"
    >
      <Box display="flex" alignItems="center" px={["10", "0"]}>
        <Box width="14" height="14">
          <Image src="/assets/img/EROR.png" alt="EROR LOGO" width="100%" />
        </Box>
        <Box
          height="20"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mx="5"
          width="0.5px"
          background="gray.500"
        ></Box>
        <Box>
          <Box as="h2" fontWeight="bold">
            E-ROR
          </Box>
          <Box as="h3" fontWeight="bold">
            Electronic - Repair For Request
          </Box>
        </Box>
      </Box>
      <Box mt="5">
        <Box textAlign="center" fontWeight="semibold">
          Dipersembahkan oleh:
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          px="3"
          pb="3"
          borderRadius="lg"
        >
          <Image
            src="/assets/img/setneg.png"
            alt="KEMENSETNEG LOGO"
            width={[32, 48]}
            mr="10"
            mt="5"
          />
          <Image
            src="/assets/img/mandiri.png"
            alt="MANDIRI LOGO"
            width={[32, 48]}
          />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Loader
            type="ThreeDots"
            color="#FFD202"
            height={50}
            width={50}
            timeout={4500} //3 secs
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Loading;