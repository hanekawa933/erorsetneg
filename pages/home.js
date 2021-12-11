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
  Skeleton,
} from "@chakra-ui/react";
import CardHistoryReport from "../components/CardHistoryReport";
import { TempContext } from "../context/TempContext";
import instance from "../axios.default";
import Link from "next/link";
import { useRouter } from "next/router";

const UserHomepage = () => {
  const { colorMode } = useColorMode();

  const headingResponsive = ["1em", "1em", "1.3em", "1.3em", "1.3em", "1.3em"];
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
  const [category, setCategory] = useState([]);
  const [report, setReport] = useState([]);
  const [settings, setSettings] = useContext(TempContext);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/profile");
      setUserLogin(result.data.data);
      setSettings({ ...settings, userLogin: result.data.data });
      setLoadingUser(true);
    } catch (error) {
      router.push("/login");
    }
  };

  const fetchCategory = async (query) => {
    try {
      if (!settings.userLogin && !settings.userLogin.role_id) {
        return;
      }

      const result = await instance.get(query);
      setCategory(result.data.data);
      setLoadingCategory(true);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const fetchReportByUserLogin = async () => {
    try {
      const result = await instance.get("/laporan/user");
      setReport(result.data.data ? result.data.data : []);
      setLoadingReport(true);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserLogin();
  }, []);

  useEffect(() => {
    if (!userLogin) {
      return;
    }

    if (settings.userLogin && parseInt(settings.userLogin.role_id) === 1) {
      fetchCategory("/kategori");
    } else if (
      settings.userLogin &&
      parseInt(settings.userLogin.role_id) === 2
    ) {
      fetchCategory("/kategori/notif?query=admin");
    } else {
      fetchCategory("/kategori/notif?query=teknisi");
    }

    fetchReportByUserLogin();
  }, [loadingCategory, loadingReport]);

  const listCategory = category
    .map((res) => {
      return (
        <CardCategory
          icon={res.icon}
          category={res.nama}
          id={res.id}
          role={userLogin.role_id}
          notification={
            userLogin && parseInt(userLogin.role_id) !== 1
              ? res.notifikasi
              : null
          }
          key={res.id}
        />
      );
    })
    .slice(0, 3);

  const listReport = report
    .map((res, index) => {
      return (
        <Box
          key={res.lId}
          gridColumn={[
            "auto",
            "auto",
            parseInt(index) === 2 ? "1/3" : null,
            "auto",
          ]}
          display={[index === 0 ? "inline" : "none", "inline"]}
        >
          <CardHistoryReport
            lokasi={res.lokasi}
            laporan={res.jenis_kerusakan}
            waktu={res.date_diff}
            status={res.status}
            image={
              res.gambar[0] && res.gambar[0].gambar
                ? res.gambar[0].gambar
                : "/assets/img/no-image.png"
            }
            id={res.lId}
            role={userLogin.role_id}
            status_id={res.sId}
          />
        </Box>
      );
    })
    .slice(0, 3);

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

  const gridReport = (
    <Grid templateColumns={gridResponsive2} gap={[3, 6]} mt="5">
      {listReport}
    </Grid>
  );
  const showReport = report.length < 1 ? notFound : gridReport;

  return (
    <div>
      <Head>
        <title>E-ROR | SuperAdmin Create Account</title>
      </Head>
      <DashboardLayout>
        <Box px={["3", "5"]} pb="7">
          <Skeleton isLoaded={loadingUser && loadingCategory && loadingReport}>
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
                  fontSize={[
                    "0.8em",
                    "1.4em",
                    "1.6em",
                    "1.8em",
                    "2em",
                    "2.2em",
                  ]}
                  color="black"
                  pb={["1", "2"]}
                  textAlign={alignResponsive}
                >
                  <Box as="span" display="block" color="rgba(0,0,0,0.55)">
                    Selamat datang,
                  </Box>
                  {userLogin.nama_lengkap}!
                </Heading>
                <Text
                  color="rgba(0,0,0,0.55)"
                  fontSize={["0.8em", "1em", "1em", "1.2em", "1.4em", "1.6em"]}
                  fontWeight="semibold"
                  textAlign={alignResponsive}
                >
                  {parseInt(userLogin.role_id) === 1
                    ? "Punya keluhan? Laporin langsung yuk!"
                    : parseInt(userLogin.role_id) === 2
                    ? "Periksa laporan masuk yuk!"
                    : "Cek laporan masuk yuk!"}
                </Text>
              </Box>
              <Box
                as="img"
                src="/assets/svg/amico.svg"
                maxW="100%"
                height={["32", "56", "60", "48", "64", "72"]}
                mt={["5", "5", "5", "0", "0", "0"]}
              ></Box>
            </Box>
          </Skeleton>
          <Skeleton
            isLoaded={loadingUser && loadingCategory && loadingReport}
            height={
              !loadingUser && !loadingCategory && !loadingReport
                ? "80"
                : "initial"
            }
          >
            <Box borderRadius="lg" mt="10">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt="10"
              >
                <Heading
                  fontSize={headingResponsive}
                  textTransform="capitalize"
                >
                  Request For Repair
                </Heading>
                <Link href="/category">
                  <a>
                    <Button
                      colorScheme="orange"
                      textTransform="capitalize"
                      size="sm"
                    >
                      semua kategori
                    </Button>
                  </a>
                </Link>
              </Box>
              <Grid templateColumns={gridResponsive} gap={[2, 6]} mt="5">
                {listCategory}
              </Grid>
            </Box>
          </Skeleton>
          <Skeleton
            isLoaded={loadingUser && loadingCategory && loadingReport}
            height={
              !loadingUser && !loadingCategory && !loadingReport
                ? "80"
                : "initial"
            }
          >
            {parseInt(userLogin.role_id) === 1 ? (
              <Box mt={["5", "10"]} borderRadius="lg">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={["5", "10"]}
                >
                  <Heading fontSize={headingResponsive}>
                    Laporan Terakhir
                  </Heading>
                  {report.length > 0 ? (
                    <Link href="/history">
                      <a>
                        <Button
                          colorScheme="orange"
                          size="sm"
                          textTransform="capitalize"
                        >
                          semua laporan
                        </Button>
                      </a>
                    </Link>
                  ) : null}
                </Box>
                {showReport}
              </Box>
            ) : null}
          </Skeleton>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default ProtectedRoute(UserHomepage);
