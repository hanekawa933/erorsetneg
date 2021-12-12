import Head from "next/head";
import DashboardLayout from "../layouts/dashboard";
import CardHistoryReport from "../components/CardHistoryReport";
import {
  Box,
  Grid,
  useColorMode,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  Skeleton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Icon } from "@iconify/react";
import { TempContext } from "../context/TempContext";
import instance from "../axios.default";
import { useEffect, useContext, useState } from "react";
import { ProtectedRoute } from "../HOC/withAuth";

function History() {
  const { colorMode } = useColorMode();
  const gridResponsive = [
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
  let [category, setCategory] = useState([]);
  let [status, setStatus] = useState([]);
  const [statusUsed, setStatusUsed] = useState(999);
  const [categoryUsed, setCategoryUsed] = useState(999);
  const [content, setContent] = useState({ start: 0, end: 6 });
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/profile");
      setUserLogin(result.data.data);
      setSettings({ ...settings, userLogin: result.data.data });
      setLoadingUser(true);
    } catch (error) {
      router.push("/");
    }
  };

  const fetchStatus = async () => {
    try {
      const result = await instance.get("/laporan/status");
      setStatus(result.data.data ? result.data.data : []);
      setLoadingStatus(true);
    } catch (error) {
      alert("error");
    }
  };

  const fetchReportByCategoryId = async (query) => {
    try {
      if (!userLogin) {
        return;
      }
      const result = await instance.get(`/laporan/history?query=${query}`);
      setReport(result.data.data ? result.data.data : []);
      setLoadingReport(true);
    } catch (error) {
      alert(error);
    }
  };

  const fetchCategory = async () => {
    try {
      const result = await instance.get(`/kategori`);
      setCategory(result.data.data ? result.data.data : []);
      setLoadingCategory(true);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userLogin) {
      return;
    }

    fetchUserLogin();
    fetchCategory();
    fetchStatus();
  }, []);

  useEffect(() => {
    if (!userLogin) {
      return;
    }

    if (userLogin && parseInt(userLogin.role_id) === 1) {
      fetchReportByCategoryId("user");
    } else if (userLogin && parseInt(userLogin.role_id) === 2) {
      fetchReportByCategoryId("admin");
    } else {
      fetchReportByCategoryId("teknisi");
    }
  }, [loadingReport]);

  status = [{ id: "999", nama: "Semua" }, ...status];

  const adminStatus =
    status &&
    status.filter(
      (res) =>
        parseInt(res.id) === 2 ||
        parseInt(res.id) === 3 ||
        parseInt(res.id) === 6 ||
        parseInt(res.id) === 7 ||
        parseInt(res.id) === 999
    );

  const techStatus =
    status &&
    status.filter(
      (res) =>
        parseInt(res.id) === 4 ||
        parseInt(res.id) === 5 ||
        parseInt(res.id) === 6 ||
        parseInt(res.id) === 7 ||
        parseInt(res.id) === 999
    );

  const roleStatus =
    parseInt(userLogin.role_id) === 2
      ? adminStatus
      : parseInt(userLogin.role_id) === 3
      ? techStatus
      : status;

  const listOfButton =
    roleStatus &&
    roleStatus.map((res) => {
      const parsedId = parseInt(res.id);
      return (
        <MenuItem
          key={res.id}
          px="0"
          py="0"
          background={
            (parsedId === 1 && statusUsed === 1) ||
            (parsedId === 6 && statusUsed === 6)
              ? colorMode === "dark"
                ? "green.700"
                : "green.100"
              : (parsedId === 2 && statusUsed === 2) ||
                (parsedId === 7 && statusUsed === 7)
              ? colorMode === "dark"
                ? "red.700"
                : "red.100"
              : parsedId === 3 && statusUsed === 3
              ? colorMode === "dark"
                ? "blue.700"
                : "blue.100"
              : (parsedId === 4 && statusUsed === 4) ||
                (parsedId === 5 && statusUsed === 5)
              ? colorMode === "dark"
                ? "yellow.700"
                : "yellow.100"
              : parsedId === 999 && statusUsed === 999
              ? colorMode === "dark"
                ? "orange.700"
                : "orange.100"
              : colorMode === "dark"
              ? "gray.700"
              : "gray.50"
          }
          onClick={() => setStatusUsed(parsedId)}
        >
          <Button
            colorScheme={
              (parsedId === 1 && statusUsed === 1) ||
              (parsedId === 6 && statusUsed === 6)
                ? "green"
                : (parsedId === 2 && statusUsed === 2) ||
                  (parsedId === 7 && statusUsed === 7)
                ? "red"
                : parsedId === 3 && statusUsed === 3
                ? "blue"
                : (parsedId === 4 && statusUsed === 4) ||
                  (parsedId === 5 && statusUsed === 5)
                ? "yellow"
                : parsedId === 999 && statusUsed === 999
                ? "orange"
                : "white"
            }
            isFullWidth
            variant="ghost"
          >
            {res.nama}
          </Button>
        </MenuItem>
      );
    });

  const activeStatus =
    status && status.filter((res) => parseInt(res.id) === parseInt(statusUsed));

  const activeCategory =
    category &&
    category.filter((res) => parseInt(res.id) === parseInt(categoryUsed));

  const tabs = category.map((res) => {
    return (
      <Tab key={res.id} width="100%" onClick={() => setCategoryUsed(res.id)}>
        <Box
          background={
            parseInt(categoryUsed) === parseInt(res.id)
              ? colorMode === "dark"
                ? "orange.500"
                : "orange.100"
              : colorMode === "dark"
              ? "gray.700"
              : "gray.50"
          }
          _hover={{
            background:
              parseInt(categoryUsed) === parseInt(res.id)
                ? colorMode === "dark"
                  ? "orange.300"
                  : "orange.200"
                : colorMode === "dark"
                ? "gray.600"
                : "gray.100",
          }}
          fontWeight="semibold"
          color={
            parseInt(categoryUsed) === parseInt(res.id)
              ? colorMode === "dark"
                ? "orange.100"
                : "orange.700"
              : colorMode === "dark"
              ? "gray.100"
              : "gray.700"
          }
          w="100%"
          py="1"
        >
          {res.nama}
        </Box>
      </Tab>
    );
  });

  const notFound = (kategori, semua = false) => {
    return (
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
          Ooops... tidak ada data pada
          {semua ? " semua kategori" : ` kategori ${kategori}`}
        </Text>
      </Box>
    );
  };

  const data = {};

  const tabList = category.map((cat) => {
    const filtered = report.filter((rep) => {
      return parseInt(cat.id) === parseInt(rep.kId);
    });

    data = { ...data, [cat.nama.toLowerCase()]: filtered };

    const filteredStatus = data[cat.nama.toLowerCase()].filter((stat) => {
      return parseInt(stat.status_id) === statusUsed;
    });

    if (filteredStatus < 1) {
      return (
        <TabPanel p="0">
          {data[cat.nama.toLowerCase()] < 1 ? (
            notFound(cat.nama.toLowerCase())
          ) : parseInt(statusUsed) === 999 ? (
            <Grid templateColumns={gridResponsive} gap={["3", "6"]} mt="5">
              {data[cat.nama.toLowerCase()]
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
                .slice(content.start, content.end)}
            </Grid>
          ) : (
            notFound(
              cat.nama.toLowerCase() +
                ` dengan status ${activeStatus[0].nama.toLowerCase()}`
            )
          )}
          {parseInt(data[cat.nama.toLowerCase()].length) <=
          parseInt(content.end) ? null : (
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
        </TabPanel>
      );
    } else {
      return (
        <TabPanel p="0">
          <Grid templateColumns={gridResponsive} gap={["3", "6"]} mt="5">
            {filteredStatus
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
              .slice(content.start, content.end)}
          </Grid>
          {filteredStatus.length <= parseInt(content.end) ? null : (
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
        </TabPanel>
      );
    }
  });

  const filteredStatus = report.filter((stat) => {
    return parseInt(stat.status_id) === statusUsed;
  });

  const allCategoryStatusFilter = (
    <>
      {filteredStatus
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
        .slice(content.start, content.end)}
      <Box></Box>
      {parseInt(filteredStatus.length) <= parseInt(content.end) ? null : (
        <Box mt="5" display="flex" justifyContent="center" alignItems="center">
          <Button
            colorScheme="orange"
            px="5"
            onClick={() => setContent({ ...content, end: content.end + 3 })}
          >
            Load more
          </Button>
        </Box>
      )}
    </>
  );

  const allCategoryNoFilter = (
    <>
      {report
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
        .slice(content.start, content.end)}
      <Box></Box>
      {parseInt(report.length) <= parseInt(content.end) ? null : (
        <Box mt="5" display="flex" justifyContent="center" alignItems="center">
          <Button
            colorScheme="orange"
            px="5"
            onClick={() => setContent({ ...content, end: content.end + 3 })}
          >
            Load more
          </Button>
        </Box>
      )}
    </>
  );

  const allCategory =
    parseInt(statusUsed) === 999
      ? allCategoryNoFilter
      : allCategoryStatusFilter;

  const buttonStatus =
    parseInt(activeStatus[0].id) === 1 || parseInt(activeStatus[0].id) === 6
      ? "green"
      : parseInt(activeStatus[0].id) === 2 || parseInt(activeStatus[0].id) === 7
      ? "red"
      : parseInt(activeStatus[0].id) === 3
      ? "blue"
      : parseInt(activeStatus[0].id) === 4 || parseInt(activeStatus[0].id) === 5
      ? "yellow"
      : parseInt(activeStatus[0].id) === 999
      ? "orange"
      : "gray";
  return (
    <div>
      <Head>
        <title>E-ROR | Riwayat Laporan User</title>
      </Head>
      <DashboardLayout>
        <Box px="5" pb="14">
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon />}
            fontSize="lg"
            px={["3", "3", "5"]}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink href="#" isCurrentPage>
                Riwayat
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Skeleton
            isLoaded={
              loadingCategory && loadingReport && loadingStatus && loadingUser
            }
          >
            <Box p={["3", "3", "5"]}>
              <Box display="flex" alignItems="center" fontWeight="semibold">
                <Icon
                  icon="bi:clock-history"
                  width={30}
                  height={30}
                  color={colorMode === "dark" ? "white" : "black"}
                />
                <Box as="span" fontSize={["1em", "1.5em", "2.2em"]} ml="3">
                  Riwayat Laporan
                </Box>
              </Box>
              <Tabs variant="soft-rounded" colorScheme="orange" isLazy mt="3">
                <TabList display="flex" justifyContent="right">
                  <Menu autoSelect={false}>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      colorScheme="orange"
                      mx="3"
                    >
                      Kategori
                    </MenuButton>
                    <MenuList>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDir="column"
                      >
                        <Tab width="100%" onClick={() => setCategoryUsed(999)}>
                          <Box
                            background={
                              parseInt(categoryUsed) === parseInt(999)
                                ? colorMode === "dark"
                                  ? "orange.500"
                                  : "orange.100"
                                : colorMode === "dark"
                                ? "gray.700"
                                : "gray.50"
                            }
                            _hover={{
                              background:
                                parseInt(categoryUsed) === parseInt(999)
                                  ? colorMode === "dark"
                                    ? "orange.300"
                                    : "orange.200"
                                  : colorMode === "dark"
                                  ? "gray.600"
                                  : "gray.100",
                            }}
                            fontWeight="semibold"
                            color={
                              parseInt(categoryUsed) === parseInt(999)
                                ? colorMode === "dark"
                                  ? "orange.100"
                                  : "orange.700"
                                : colorMode === "dark"
                                ? "gray.100"
                                : "gray.700"
                            }
                            w="100%"
                            py="1"
                          >
                            Semua
                          </Box>
                        </Tab>
                        {tabs}
                      </Box>
                    </MenuList>
                  </Menu>
                  <Menu autoSelect={false}>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      colorScheme="blue"
                    >
                      Status
                    </MenuButton>
                    <MenuList>
                      <Box>{listOfButton}</Box>
                    </MenuList>
                  </Menu>
                </TabList>
                <Box display="flex" justifyContent="end" my="3">
                  <Tag size="md" variant="subtle" colorScheme="orange" mx="2">
                    {activeCategory.length < 1
                      ? "Semua"
                      : activeCategory[0].nama}
                  </Tag>
                  <Tag size="md" variant="subtle" colorScheme={buttonStatus}>
                    {activeStatus[0].nama}
                  </Tag>
                </Box>
                <TabPanels>
                  <TabPanel p="0">
                    {parseInt(statusUsed) === 999 ? (
                      report.length < 1 ? (
                        notFound(activeStatus[0].nama.toLowerCase())
                      ) : (
                        <Grid
                          templateColumns={gridResponsive}
                          gap={["3", "6"]}
                          mt="5"
                        >
                          {allCategory}
                        </Grid>
                      )
                    ) : filteredStatus.length > 1 ? (
                      <Grid
                        templateColumns={gridResponsive}
                        gap={["3", "6"]}
                        mt="5"
                      >
                        {allCategory}
                      </Grid>
                    ) : (
                      notFound(activeStatus[0].nama.toLowerCase())
                    )}
                    {report.length < 1 ? notFound("", true) : ""}
                  </TabPanel>
                  {tabList}
                </TabPanels>
              </Tabs>
            </Box>
          </Skeleton>
        </Box>
      </DashboardLayout>
    </div>
  );
}

export default ProtectedRoute(History);
