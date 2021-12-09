import Head from "next/head";
import DashboardLayout from "../layouts/dashboard";
import CardCategory from "../components/CardCategory";
import { Box, Grid, useColorMode } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useEffect, useContext, useState } from "react";
import { ProtectedRoute } from "../HOC/withAuth";
import { TempContext } from "../context/TempContext";
import instance from "../axios.default";

export default function CategoryList() {
  const gridResponsive = [
    "repeat(3, 1fr)",
    "repeat(1, 1fr)",
    "repeat(2, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
    "repeat(3, 1fr)",
  ];
  const [userLogin, setUserLogin] = useState([]);
  const [category, setCategory] = useState([]);
  const [settings, setSettings] = useContext(TempContext);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/profile");
      setUserLogin(result.data.data);
      setSettings({ ...settings, userLogin: result.data.data });
    } catch (error) {
      alert(error);
    }
  };

  const fetchCategory = async () => {
    try {
      const result = await instance.get("/kategori");
      setCategory(result.data.data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchUserLogin();
    fetchCategory();
  }, []);

  const listCategory = category.map((res) => {
    return (
      <CardCategory
        key={res.id}
        icon={res.icon}
        category={res.nama}
        id={res.id}
        role={userLogin.role_id}
      />
    );
  });

  return (
    <div>
      <Head>
        <title>E-ROR | SuperAdmin Create Account</title>
      </Head>
      <DashboardLayout>
        <Box px="5" pb="14">
          <Box p={["3", "5", "10"]}>
            <Box display="flex" alignItems="center" fontWeight="semibold">
              <Icon
                icon="bi:clock-history"
                width={30}
                height={30}
                color={useColorMode().colorMode === "dark" ? "white" : "black"}
              />
              <Box
                as="span"
                textTransform="capitalize"
                fontSize={["1em", "1.5em", "2.2em"]}
                ml="3"
              >
                daftar kategori
              </Box>
            </Box>
            <Box>
              <Grid templateColumns={gridResponsive} gap={[3, 6]} mt="5">
                {listCategory}
              </Grid>
            </Box>
          </Box>
        </Box>
      </DashboardLayout>
    </div>
  );
}
