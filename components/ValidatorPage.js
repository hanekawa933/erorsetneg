import CardHistoryReport from "../components/CardHistoryReport";
import {
  Box,
  Grid,
  useColorMode,
  Text,
  Button,
  Skeleton,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { TempContext } from "../context/TempContext";
import instance from "../axios.default";
import { useEffect, useContext, useState } from "react";
import { ProtectedRoute } from "../HOC/withAuth";

import { useRouter } from "next/router";
import path from "../constant.default";

function ValidatorPage() {
  const [userLogin, setUserLogin] = useState([]);
  const [report, setReport] = useState([]);
  const [settings, setSettings] = useContext(TempContext);
  const [category, setCategory] = useState([]);
  const [content, setContent] = useState({ start: 0, end: 6 });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/profile");
      setUserLogin(result.data.data);
      setSettings({ ...settings, userLogin: result.data.data });
      setLoading(true);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const fetchReportByCategoryId = async (id, query) => {
    try {
      const result = await instance.get(
        `/laporan/kategori?category=${id}&query=${query}`
      );
      setReport(result.data.data ? result.data.data : []);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const fetchCategoryById = async (id) => {
    try {
      if (!id) {
        return;
      }

      const result = await instance.get(`/kategori/item/id/${id}`);
      setCategory(result.data.data ? result.data.data : []);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserLogin();
    if (!router.isReady && !userLogin) {
      return;
    }

    const queryUsed = parseInt(userLogin.role_id) === 2 ? "admin" : "teknisi";
    fetchCategoryById(id);
    fetchReportByCategoryId(id, queryUsed);
  }, [router.isReady, loading]);

  const gridResponsive = [
    "repeat(1, 1fr)",
    "repeat(1, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
  ];

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
        height={["32", "36", "40", "44", "48", "52"]}
        mt={["5", "5", "5", "5", "5", "5"]}
        pointerEvents="none"
      ></Box>
      <Text as="h1" fontWeight="semibold">
        Ooops... Belum ada laporan masuk nih.
      </Text>
    </Box>
  );

  const listReport = report
    .map((res) => {
      return (
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
          key={res.lId}
        />
      );
    })
    .slice(content.start, content.end);

  return (
    <Box>
      <Skeleton isLoaded={loading}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          w="100%"
          bg={useColorMode().colorMode === "dark" ? "gray.700" : "gray.100"}
          borderRadius="lg"
          px={["5", "5", "10"]}
          pt={["10", "10", "0"]}
        >
          <Box>
            <Text
              fontSize={["1em", "1em", "1.6em"]}
              color={
                useColorMode().colorMode === "dark" ? "gray.400" : "gray.600"
              }
              fontWeight="semibold"
              letterSpacing={["0px", "0px", "1px"]}
            >
              Request for repair:
            </Text>
            <Text
              fontSize={["1em", "1.2em", "2em"]}
              fontWeight="bold"
              textTransform="capitalize"
              letterSpacing={["0px", "0.7px", "2px"]}
            >
              {category.nama}
            </Text>
          </Box>
          <Box
            as="img"
            src={path + category.icon}
            maxW="100%"
            height={["24", "28", "52"]}
          ></Box>
        </Box>
        <Box display="flex" alignItems="center" fontWeight="semibold" mt="5">
          <Icon
            icon="bi:clock-history"
            width={30}
            height={30}
            color={useColorMode().colorMode === "dark" ? "white" : "black"}
          />
          <Box as="span" fontSize={["1em", "1.4em", "2.2em"]} ml="3">
            Laporan Masuk
          </Box>
        </Box>
        <Box>
          {report.length < 1 ? (
            notFound
          ) : (
            <Grid templateColumns={gridResponsive} gap={["3", "6"]} mt="5">
              {listReport}
            </Grid>
          )}
          {report.length <= parseInt(content.end) ? null : (
            <Box
              mt="5"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                colorScheme="orange"
                px="5"
                onClick={() => setContent({ ...content, end: content.end + 3 })}
              >
                Load more
              </Button>
            </Box>
          )}
        </Box>
      </Skeleton>
    </Box>
  );
}

export default ValidatorPage;
