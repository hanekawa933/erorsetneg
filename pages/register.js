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
} from "@chakra-ui/react";
import AuthRegister from "../components/Auth/AuthRegister";
import Link from "next/link";

function Register() {
  return (
    <div>
      <Head>
        <title>E-ROR | Halaman Daftar</title>
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
              <Heading fontSize="1.5em" color="gray.900">
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
              Hello, daftar dulu yuk!
            </Heading>
            <Divider mt="5" mb="10" />
            <AuthRegister />
            <Divider mt="5" mb="5" />
            <Box textAlign="center">
              <Box as="span">Sudah punya akun?</Box>
              <ChakraLink px="2" color="#E67503" href="/" fontWeight="700">
                Masuk
              </ChakraLink>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default ProtectedRoute(Register);
