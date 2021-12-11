import Head from "next/head";
import Image from "next/image";
import { ProtectedRoute } from "../HOC/checkAuth";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Divider,
  Span,
  Link as ChakraLink,
  useColorMode,
} from "@chakra-ui/react";
import AuthLogin from "../components/Auth/AuthLogin";
import Link from "next/link";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";

function Login() {
  const { colorMode } = useColorMode();
  const [load, setLoad] = useState(true);

  if (load) {
    setTimeout(() => {
      setLoad(false);
    }, 4500);

    return <Loading />;
  }
  return (
    <div>
      <Head>
        <title>E-ROR | Login Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        maxWidth="100%"
        py="8"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          display="flex"
          borderRadius="md"
          boxShadow={["none", "none", "none", "xl"]}
          h="100%"
          w={["100%", "100%", "100%", "95%", "80%"]}
          position="relative"
        >
          <Box
            width="50%"
            height="100%"
            position="absolute"
            zIndex="200"
            display={["none", "none", "none", "inline", "inline", "inline"]}
          >
            <Box
              as="img"
              src="/assets/img/yellow-bg.png"
              alt="Yellow Background"
              width="100%"
              height="50%"
            />
          </Box>
          <Box
            width="50%"
            height="100%"
            position="absolute"
            zIndex="100"
            display={["none", "none", "none", "inline", "inline", "inline"]}
          >
            <Box
              as="img"
              src="/assets/img/yellow.png"
              alt="Yellow Background"
              width="100%"
              height="75%"
            />
          </Box>
          <Box
            height="100%"
            borderRadius="md"
            width="50%"
            display={["none", "none", "none", "inline", "inline", "inline"]}
            p="12"
            position="relative"
            zIndex="500"
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              <Box w="5em">
                <Image
                  src="/assets/img/EROR.png"
                  alt="Logo"
                  width="100%"
                  height="100%"
                />
              </Box>
              <Box px="7">
                <Heading fontSize="2em" color="gray.800">
                  E-ROR
                </Heading>
              </Box>
            </Box>
            <Box
              as="object"
              type="image/svg+xml"
              data="/assets/svg/amico.svg"
              maxW="100%"
              height="96"
            ></Box>
            <Box>
              <Text fontSize="1.2em" color="gray.400" fontWeight="semibold">
                Electronic - Request For Repair
              </Text>
              <Heading
                fontSize="1.5em"
                color={colorMode === "dark" ? "gray.100" : "gray.900"}
              >
                Solusi untuk penanganan kerusakan sarana dan prasarana secara
                elektronik.
              </Heading>
            </Box>
          </Box>
          <Box
            w={["100%", "100%", "100%", "50%"]}
            px="10"
            display="flex"
            flexDir="column"
            justifyContent="center"
            my={["20", "20", "20", "0"]}
          >
            <Heading as="h1" size="lg">
              Selamat datang kembali!
            </Heading>
            <Divider mt="5" mb="10" />
            <AuthLogin />
            <Divider mt="5" mb="5" />
            <Box textAlign="center">
              <Box as="span">Belum punya akun?</Box>
              <ChakraLink
                px="2"
                color="#E67503"
                href="/register"
                fontWeight="700"
              >
                Daftar
              </ChakraLink>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default ProtectedRoute(Login);
