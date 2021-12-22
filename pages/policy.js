import { useEffect, useContext, useState } from "react";
import { ProtectedRoute } from "../HOC/withAuth";
import Head from "next/head";
import DashboardLayout from "../layouts/dashboard";
import CardCategory from "../components/CardCategory";
import {
  Box,
  Heading,
  Text,
  Grid,
  useColorMode,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ListItem,
  OrderedList,
} from "@chakra-ui/react";
import { TempContext } from "../context/TempContext";
import { ChevronRightIcon } from "@chakra-ui/icons";
import instance from "../axios.default";
import { useRouter } from "next/router";

const TnAGeneral = () => {
  const { colorMode } = useColorMode();

  const headingResponsive = ["1em", "1em", "1.3em", "1.3em", "1.3em", "1.6em"];
  const gridResponsive = [
    "repeat(3, 1fr)",
    "repeat(1, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
  ];
  const gridResponsive2 = [
    "repeat(1, 1fr)",
    "repeat(1, 1fr)",
    "repeat(2, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
  ];

  const bgTheme = colorMode === "dark" ? "gray.700" : "gray.50";
  const colorTheme = colorMode === "dark" ? "white" : "black";
  const jfyContentResponsive = [
    "space-between",
    "center",
    "center",
    "space-between",
    "space-between",
    "space-between",
  ];
  const alItemsResponsive = [
    "center",
    "center",
    "center",
    "center",
    "center",
    "center",
  ];
  const jfyDirResponsive = ["row", "column", "column", "row", "row", "row"];
  const alignResponsive = ["left", "center", "center", "left", "left", "left"];

  return (
    <div>
      <Head>
        <title>E-ROR | SuperAdmin Create Account</title>
      </Head>
      <Box
        px={["5%", "10%"]}
        py="5"
        boxShadow="lg"
        display="flex"
        background={bgTheme}
        justifyContent={jfyContentResponsive}
        flexDir={jfyDirResponsive}
        alignItems={alItemsResponsive}
        bg="#FFD202"
      >
        <Box>
          <Heading
            fontSize={["0.8em", "1.4em", "1.6em", "1.8em", "2em", "2.2em"]}
            color="black"
            pb={["1", "2"]}
            textAlign={alignResponsive}
          >
            Kebijakan Layanan dan Privasi
          </Heading>
          <Text
            color="rgba(0,0,0,0.55)"
            fontSize={["0.8em", "1em", "1em", "1.2em", "1.4em", "1.6em"]}
            fontWeight="semibold"
            textAlign={alignResponsive}
          >
            Pelajari kebijakan layanan dan privasi E-ROR
          </Text>
        </Box>
        <Box
          as="img"
          src="/assets/svg/term.svg"
          maxW="100%"
          height={["32", "56", "60", "48", "64", "72"]}
          mt={["5", "5", "5", "0", "0", "0"]}
        ></Box>
      </Box>
      <Box
        mt="10"
        pr={["0", "10", "10", "10", "96"]}
        px={["5%", "10%"]}
        boxShadow="lg"
        pb="5%"
      >
        <Heading fontSize={headingResponsive} textTransform="capitalize">
          Kebijakan layanan dan privasi
        </Heading>
        <Box mt="4">
          <OrderedList>
            <ListItem>
              Pengguna dengan ini menyatakan bahwa pengguna adalah orang yang
              cakap dan mampu untuk mengikatkan dirinya dalam sebuah perjanjian
              yang sah menurut hukum.
            </ListItem>
            <ListItem mt="3">
              E-ROR memiliki kewenangan untuk menutup akun Pengguna baik
              sementara maupun permanen apabila didapati adanya tindakan
              pelanggaran terhadap Syarat dan Ketentuan E-ROR . Pengguna
              menyetujui bahwa E-ROR berhak melakukan tindakan lain yang
              diperlukan terkait hal tersebut, termasuk menolak pengajuan
              pembukaan akun yang baru apabila ditemukan kesamaan data yang
              bermasalah sebelumnya.
            </ListItem>
            <ListItem mt="3">
              E-ROR adalah suatu app atau web portal, yakni situs atau app
              terkait pelaporan kerusakan sarana/prasarana. Selanjutnya disebut
              E-ROR.
            </ListItem>
            <ListItem mt="3">
              Syarat & ketentuan adalah perjanjian antara Pengguna dan E-ROR
              yang berisikan seperangkat peraturan yang mengatur hak, kewajiban,
              tanggung jawab pengguna dan E-ROR, serta tata cara penggunaan
              sistem layanan E-ROR.
            </ListItem>
            <ListItem mt="3">
              APP E-ROR tidak memungut biaya pendaftaran kepada Pengguna.
            </ListItem>
            <ListItem mt="3">
              Pengguna mengerti untuk dan memahami atas pelaporan kerusakan yang
              dikirimkan melalui APP/ website dan dapat dipertanggungjawabkan
            </ListItem>
            <ListItem mt="3">
              Pengguna mengirimkan lampiran foto atau video yang sesuai, apabila
              ditemukan foto/video yang mengandung unsur SARA/tidak senonoh,
              maka pengguna akan bertanggungjawab atas pelaporannya dan diproses
              secara hukum yang berlaku.
            </ListItem>
            <ListItem mt="3">
              Dilarang memodifikasi/mengedit/meretas situs/APP.
            </ListItem>
            <ListItem mt="3">
              Proses pendaftaran mengisikan dengan data diri yang benar.
            </ListItem>
          </OrderedList>
        </Box>
      </Box>
    </div>
  );
};

export default TnAGeneral;
