import Head from "next/head";
import Image from "next/image";

import {
  Box,
  Container,
  Heading,
  Text,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import { FormForgotPassword, FormInputOtp, FormResetPassword } from "../form";
import { useRouter } from "next/router";

export default function Forgot() {
  const router = useRouter();
  const { email, otp } = router.query;
  return (
    <div>
      <Head>
        <title>E-ROR | Lupa Password</title>
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
          alignItems="center"
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
              data={
                !email && !otp
                  ? "/assets/svg/forget.svg"
                  : !otp
                  ? "/assets/svg/otp.svg"
                  : "assets/svg/password.svg"
              }
              maxW="100%"
              height="96"
            ></Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDir="column"
              textAlign="center"
            >
              <Heading
                fontSize="1.7em"
                color={
                  useColorMode().colorMode === "dark" ? "gray.100" : "gray.900"
                }
                fontWeight="bold"
              >
                {!email && !otp
                  ? "Lupa password?"
                  : !otp
                  ? "Cek email anda!"
                  : "Ubah password"}
              </Heading>
              <Text mt="3" color="gray.600" fontWeight="semibold">
                {!email && !otp
                  ? "Jangan khawatir! Anda dapat me-reset password anda dengan memasukan email akun pada."
                  : !otp
                  ? "Kode OTP telah terkirim. Mohon cek email anda dan masukan kode nya kesini."
                  : "Pastikan password anda telah benar dan telah diingat agar tidak terulang lagi."}
              </Text>
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
              {!email && !otp
                ? "Konfirmasi email."
                : !otp
                ? "Verifikasi kode OTP"
                : "Reset password"}
            </Heading>
            <Divider mt="5" mb="5" />
            {!email && !otp ? (
              <FormForgotPassword />
            ) : !otp ? (
              <FormInputOtp />
            ) : (
              <FormResetPassword />
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
}
