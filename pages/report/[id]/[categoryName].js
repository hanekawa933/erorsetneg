import Head from "next/head";
import DashboardLayout from "../../../layouts/dashboard";
import { Box, Text, useColorMode } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { TempContext } from "../../../context/TempContext";
import instance from "../../../axios.default";
import "moment/locale/id";
import UserCreatePage from "../../../components/UserCreatePage";
import ValidatorPage from "../../../components/ValidatorPage";
import { ProtectedRoute } from "../../../HOC/withAuth";

function Reports() {
  const [userLogin, setUserLogin] = useState([]);
  const [settings, setSettings] = useContext(TempContext);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/profile");
      setUserLogin(result.data.data);
      setSettings({ ...settings, userLogin: result.data.data });
    } catch (error) {
      router.push("/");
    }
  };

  useEffect(() => {
    fetchUserLogin();
  }, []);

  return (
    <div>
      <Head>
        <title>E-ROR | Buat Laporan</title>
      </Head>
      <DashboardLayout>
        <Box px="4" pb="14">
          {parseInt(userLogin.role_id) === 1 ? (
            <UserCreatePage />
          ) : (
            <ValidatorPage />
          )}
        </Box>
      </DashboardLayout>
    </div>
  );
}

export default ProtectedRoute(Reports);
