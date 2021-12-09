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
} from "@chakra-ui/react";
import CardHistoryReport from "../components/CardHistoryReport";
import { TempContext } from "../context/TempContext";
import instance from "../axios.default";
import Link from "next/link";
import { useRouter } from "next/router";

const UserHomepage = () => {
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

  const router = useRouter();
  const [userLogin, setUserLogin] = useState([]);
  const [faq, setFaq] = useState([]);
  const [report, setReport] = useState([]);
  const [settings, setSettings] = useContext(TempContext);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/profile");
      setUserLogin(result.data.data);
      setSettings({ ...settings, userLogin: result.data.data });
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const fetchFaq = async () => {
    try {
      const result = await instance.get("/faq");
      setFaq(result.data.data);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserLogin();
    fetchFaq();
  }, []);

  const notFound = (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius="lg"
      p="5"
      boxShadow="md"
      mt="5"
    >
      <Box
        as="object"
        data="/assets/svg/not-found.svg"
        type="image/svg+xml"
        maxW="100%"
        height={["32", "44", "44", "44", "48", "52"]}
        mt={["3", "5"]}
        pointerEvents="none"
      ></Box>
      <Text as="h1" fontWeight="semibold" fontSize={["0.8em", "1em"]}>
        Ooops... Kamu belum pernah buat laporan.
      </Text>
    </Box>
  );

  const listFaq = faq.map((res) => {
    return (
      <Box key={res.id} pb="5" mb="5" borderRadius="lg" boxShadow="lg">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box
                flex="1"
                textAlign="left"
                fontSize={["1em", "1.2em", "1.4em"]}
                fontWeight="bold"
              >
                {res.pertanyaan}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            textAlign="justify"
            fontSize={["1em", "1em", "1.2em"]}
          >
            {res.jawaban}
          </AccordionPanel>
        </AccordionItem>
      </Box>
    );
  });
  const showReport = report.length < 1 ? notFound : gridReport;
  return (
    <div>
      <Head>
        <title>E-ROR | SuperAdmin Create Account</title>
      </Head>
      <DashboardLayout>
        <Box px={["3", "5"]} pb="7">
          <Box
            px={["5%", "10%"]}
            py="5"
            borderRadius="lg"
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
                Frequently Asked Question
              </Heading>
              <Text
                color="rgba(0,0,0,0.55)"
                fontSize={["0.8em", "1em", "1em", "1.2em", "1.4em", "1.6em"]}
                fontWeight="semibold"
                textAlign={alignResponsive}
              >
                Kebingungan? Coba cari jawaban kamu disini!
              </Text>
            </Box>
            <Box
              as="img"
              src="/assets/svg/question.svg"
              maxW="100%"
              height={["32", "56", "60", "48", "64", "72"]}
              mt={["5", "5", "5", "0", "0", "0"]}
            ></Box>
          </Box>
          <Box
            borderRadius="lg"
            mt="10"
            pr={["0", "10", "10", "10", "96"]}
            pl="5"
          >
            <Heading fontSize={headingResponsive} textTransform="capitalize">
              FAQ
            </Heading>
            <Box mt="4">
              <Accordion allowMultiple>{listFaq}</Accordion>
            </Box>
          </Box>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default ProtectedRoute(UserHomepage);
