import { useEffect, useContext, useState } from "react";
import { ProtectedRoute } from "../../../../HOC/withAuth";
import Head from "next/head";
import DashboardLayout from "../../../../layouts/dashboard";
import StepProgress from "../../../../components/StepProgress";
import {
  TahapPengecekan,
  TahapSetelahPengecekan,
  TahapSetelahPerbaikan,
} from "../../../../form/FormTechnicianReport";
import {
  Box,
  Badge,
  useColorMode,
  Grid,
  Text,
  Image,
  Button,
  Avatar,
} from "@chakra-ui/react";
import { TempContext } from "../../../../context/TempContext";
import instance from "../../../../axios.default";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/locale/id";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import path from "../../../../constant.default";
import { FormAdminReport } from "../../../../form";
import { DownloadIcon } from "@chakra-ui/icons";
import Link from "next/link";

function DetailsReport() {
  const { colorMode } = useColorMode();
  const gridResponsive2 = [
    "repeat(1, 1fr)",
    "repeat(1, 1fr)",
    "repeat(2, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
  ];
  const [userLogin, setUserLogin] = useState([]);
  const [report, setReport] = useState([]);
  const [settings, setSettings] = useContext(TempContext);
  const [change, setChange] = useState(0);

  const router = useRouter();
  const { reportId } = router.query;

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/profile");
      setUserLogin(result.data.data);
      console.log(result.data.data);
      setSettings({ ...settings, userLogin: result.data.data });
    } catch (error) {
      router.push("/login");
    }
  };

  const fetchLaporanById = async (id) => {
    try {
      const result = await instance.get(`/laporan/item/id/${id}`);
      setReport(result.data.data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (!reportId) {
      return;
    }
    fetchUserLogin();
    fetchLaporanById(reportId);
  }, [reportId, change]);

  const listOfStep = [...Array(5)].map((_, i) => {
    return (
      <StepProgress
        index={i}
        stepNumber={i + 1}
        status_id={parseInt(report.sId)}
        key={i}
      />
    );
  });

  const badgeColor =
    parseInt(report.sId) === 1 || parseInt(report.sId) === 6
      ? "green"
      : parseInt(report.sId) === 2 || parseInt(report.sId) === 7
      ? "red"
      : parseInt(report.sId) === 4 || parseInt(report.sId) === 5
      ? "yellow"
      : "blue";

  const gambar = report && report.gambar ? report.gambar : [];
  const gambarTeknisi =
    report && report.gambarTeknisi ? report.gambarTeknisi : [];

  const forbiddenStatus = [4, 5, 6];

  const listOfImage = gambar.map((res, index) => {
    return (
      <Box key={index}>
        <Image
          src={path + res.gambar}
          alt="Lampiran 3"
          height={["52", "52", "96"]}
          w="100%"
          borderTopRadius="lg"
          objectFit="center"
        />
      </Box>
    );
  });

  const listOfImageBukti = gambarTeknisi.map((res, index) => {
    return (
      <Box key={index}>
        <Image
          src={path + res.gambar}
          alt="Lampiran 3"
          height="56"
          w="100%"
          borderRadius="lg"
          objectFit="center"
        />
      </Box>
    );
  });

  return (
    <div>
      <Head>
        <title>E-ROR | User Report Details</title>
      </Head>
      <DashboardLayout>
        <Box px="5" pb="14">
          <Box>
            <Box width="100%" borderRadius="lg">
              <Carousel
                autoPlay={true}
                infiniteLoop={true}
                interval={3000}
                showArrows={true}
              >
                {gambar.length > 0 ? (
                  listOfImage
                ) : (
                  <Image
                    src="/assets/img/no-image.png"
                    alt="No Image"
                    width="100%"
                    height={["52", "52", "96"]}
                  />
                )}
              </Carousel>
            </Box>
            {parseInt(userLogin.role_id) === 2 ? (
              <Box px="5" display="flex">
                <Link
                  href={path + `/api/laporan/cetak_pdf/id_laporan/${reportId}`}
                >
                  <a>
                    <Button rightIcon={<DownloadIcon />} colorScheme="orange">
                      Download PDF
                    </Button>
                  </a>
                </Link>
              </Box>
            ) : null}
            <Box px="5" pb="10">
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" flexDir="column" width="max-content" py="5">
                  <Text fontSize="1em" fontWeight="bold" color="gray.600">
                    {moment(report.tanggal_lapor).format("Do/MM/YYYY")}
                  </Text>
                  <Text
                    fontSize={["1em", "1em", "1.2em"]}
                    fontWeight="bold"
                    color="gray.600"
                  >
                    {report.kode_laporan}
                  </Text>
                  <Text fontSize={["1em", "1em", "1.7em"]} fontWeight="bold">
                    {report.jenis_kerusakan}
                  </Text>
                  <Badge
                    colorScheme={badgeColor}
                    py={["1", "1", "3"]}
                    px={["2", "2", "5"]}
                    textAlign="center"
                    borderRadius="full"
                    mt="3"
                    fontSize={["1em", "1em", "1.1em"]}
                  >
                    {report.status}
                  </Badge>
                </Box>
                <Box
                  as="img"
                  src={path + report.icon}
                  maxW="100%"
                  height={["24", "32", "52"]}
                  px={["0", "0", "20"]}
                ></Box>
              </Box>
              <Box display="flex" flexDir="column" mt="3">
                <Box
                  as="span"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize={["1em", "1.2em", "1.4em"]}
                >
                  Lokasi
                </Box>
                <Box
                  as="p"
                  fontWeight="semibold"
                  color="gray.500"
                  fontSize={["1em", "1em", "1.2em"]}
                >
                  {report.lokasi}
                </Box>
              </Box>
              <Box display="flex" flexDir="column" mt="3">
                <Box
                  as="span"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize={["1em", "1.2em", "1.4em"]}
                >
                  Keterangan
                </Box>
                <Box
                  as="p"
                  textAlign="justify"
                  fontWeight="semibold"
                  color="gray.500"
                  fontSize={["1em", "1em", "1.2em"]}
                >
                  {report.keterangan}
                </Box>
              </Box>

              <Box display="flex" flexDir="column" my="5">
                <Box
                  as="span"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize={["1em", "1.2em", "1.4em"]}
                >
                  Dilaporkan oleh
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  mt="5"
                  borderRadius="lg"
                  boxShadow="lg"
                  width="max-content"
                  p="5"
                >
                  <Avatar
                    src={path + report.foto_profile}
                    name={report.nama_lengkap}
                    size="2xl"
                  />
                  <Box mx="10">
                    <Box
                      as="p"
                      textAlign="justify"
                      fontWeight="semibold"
                      color={colorMode === "dark" ? "gray.300" : "gray.800"}
                      fontSize={["1em", "1em", "1.2em"]}
                    >
                      {report.nama_lengkap}
                    </Box>
                    <Box
                      as="p"
                      textAlign="justify"
                      fontWeight="semibold"
                      color="gray.500"
                      fontSize={["1em", "1em", "1.2em"]}
                    >
                      {report.jabatan}
                    </Box>
                  </Box>
                </Box>
              </Box>

              {parseInt(userLogin.role_id) === 1 ? (
                <Box py="5">
                  <Box
                    as="span"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize={["1em", "1.2em", "1.4em"]}
                  >
                    Perkembangan Laporan
                  </Box>
                  <Grid
                    templateColumns={[
                      "repeat(1, 1fr)",
                      "repeat(1, 1fr)",
                      "repeat(5, 1fr)",
                    ]}
                    grid
                    mt="5"
                  >
                    {listOfStep}
                  </Grid>
                </Box>
              ) : null}
              <Box
                display="flex"
                justifyContent="space-between"
                flexDirection={["column", "column", "row"]}
              >
                {parseInt(report.sId) !== 1 ? (
                  <Box
                    display="flex"
                    flexDir="column"
                    mt="3"
                    mx="5"
                    width={["100%", "100%", "50%"]}
                  >
                    <Box
                      as="span"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize={["1em", "1.2em", "1.4em"]}
                    >
                      Keterangan Admin
                    </Box>
                    <Box
                      as="p"
                      textAlign="justify"
                      fontWeight="semibold"
                      color="gray.500"
                      fontSize={["1em", "1em", "1.2em"]}
                    >
                      {report.keterangan_admin}
                    </Box>
                  </Box>
                ) : null}
                {parseInt(report.sId) > 4 ? (
                  <Box display="flex" flexDir="column" mt="3" flex="1">
                    <Box
                      as="span"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize={["1em", "1.2em", "1.4em"]}
                    >
                      Keterangan Teknisi
                    </Box>
                    <Box
                      as="p"
                      textAlign="justify"
                      fontWeight="semibold"
                      color="gray.500"
                      fontSize={["1em", "1em", "1.2em"]}
                    >
                      {report.keterangan_teknisi}
                    </Box>
                  </Box>
                ) : null}
              </Box>
              {parseInt(report.status_id) !== 6 &&
              parseInt(report.status_id) !==
                7 ? null : listOfImageBukti.length < 1 ? null : (
                <Box py="5">
                  <Box
                    as="span"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="1.4em"
                  >
                    Bukti Teknisi
                  </Box>
                  <Grid
                    templateColumns={gridResponsive2}
                    mt="5"
                    gap={["3", "6"]}
                  >
                    {listOfImageBukti}
                  </Grid>
                </Box>
              )}
              {parseInt(userLogin.role_id) !==
              2 ? null : forbiddenStatus.includes(
                  parseInt(report.sId)
                ) ? null : (
                <FormAdminReport
                  id={reportId}
                  statusId={report.sId}
                  fetchReport={
                    !reportId ? null : () => setChange(change + setChange)
                  }
                />
              )}
              {parseInt(userLogin.role_id) === 3 ? (
                parseInt(report.status_id) === 3 ? (
                  <TahapPengecekan
                    id={reportId}
                    fetchReport={
                      !reportId ? null : () => setChange(change + setChange)
                    }
                  />
                ) : parseInt(report.status_id) === 4 ? (
                  <TahapSetelahPengecekan
                    id={reportId}
                    fetchReport={
                      !reportId ? null : () => setChange(change + setChange)
                    }
                  />
                ) : parseInt(report.status_id) === 5 ? (
                  <TahapSetelahPerbaikan
                    id={reportId}
                    fetchReport={
                      !reportId ? null : () => setChange(change + setChange)
                    }
                  />
                ) : null
              ) : null}
            </Box>
          </Box>
        </Box>
      </DashboardLayout>
    </div>
  );
}

export default ProtectedRoute(DetailsReport);
