import React from "react";
import {
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Skeleton,
  Input,
  Avatar,
  useColorMode,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import DashboardLayout from "../layouts/dashboard";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Head from "next/head";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import instance from "../axios.default";
import { useEffect, useState, useContext } from "react";
import { TempContext } from "../context/TempContext";
import { FormChangeProfileUser, FormChangePassword } from "../form";
import { ProtectedRoute } from "../HOC/withAuth";
import { Icon } from "@iconify/react";
import path from "../constant.default";
import { useRouter } from "next/router";

const ProfileApp = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  const [userLogin, setUserLogin] = useState([]);
  const [settings, setSettings] = useContext(TempContext);
  const [change, setChange] = useState(0);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/profile");
      setUserLogin(result.data.data);
      setSettings({ ...settings, userLogin: result.data.data });
      setLoading(true);
    } catch (error) {
      router.push("/");
    }
  };

  useEffect(() => {
    fetchUserLogin();
  }, [change]);

  const handleChange = (e) => {
    const files = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    setFile(files);
    onOpen();
  };

  const uploadProfile = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const formData = new FormData();
    formData.append("foto_profile", file);
    try {
      const result = await instance.post(
        "/user/update_pic_profile",
        formData,
        config
      );
      toast({
        title: "Berhasil",
        description: "Foto profil berhasil diganti!",
        status: "success",
        duration: 2000,
        position: "top",
      });
      setUploaded(false);
      setChange(change + 1);
      onClose();
    } catch (error) {
      toast({
        title: "Gagal",
        description: error.response
          ? error.response.data.message
          : "Server Error",
        status: "error",
        duration: 2000,
        position: "top",
      });
      onClose();
    }
  };

  const modalUpdateProfile = (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ganti Foto Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDir="column"
        >
          <Avatar src={preview} alt="..." size="2xl" />
          <Box mt="3">Apakah anda yakin ingin mengganti foto profile?</Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Batal
          </Button>
          <Button
            colorScheme="orange"
            onClick={() => {
              setUploaded(true);
              uploadProfile();
            }}
            isLoading={uploaded}
          >
            Ganti
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <>
      <Head>
        <title>E-ROR | Ubah Profil</title>
      </Head>
      <DashboardLayout>
        {modalUpdateProfile}
        <Box px={["2", "6"]} pb="10">
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon />}
            fontSize="lg"
            px={["3", "3", "5"]}
            pb={["3", "3", "5"]}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink href="#" isCurrentPage>
                Profil
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Box>
            <Skeleton isLoaded={loading}>
              <Box
                borderRadius="xl"
                pt="64"
                pb="3"
                bg="orange"
                position="relative"
              >
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Avatar
                    background={colorMode === "dark" ? "white" : "orange"}
                    color={colorMode === "dark" ? "black" : "white"}
                    name={userLogin.nama_lengkap}
                    position="absolute"
                    boxShadow="lg"
                    size="2xl"
                    border={`4px solid ${
                      colorMode === "dark" ? "black" : "white"
                    }`}
                    src={path + userLogin.foto_profile}
                    onClick={
                      !userLogin.foto_profile ? null : () => onOpenDrawer()
                    }
                    cursor={!userLogin.foto_profile ? "auto" : "pointer"}
                  />
                  <Box
                    position="absolute"
                    // ml="20"
                    // mt="24"
                    background={colorMode === "dark" ? "gray.50" : "gray.700"}
                    borderRadius="full"
                    p="1"
                    cursor="pointer"
                    onClick={() => {
                      document.querySelector("#foto_profile").click();
                    }}
                    top="100%"
                    transform="translate(40px,20px)"
                  >
                    <Icon
                      icon="ic:baseline-add-a-photo"
                      color={colorMode === "dark" ? "black" : "white"}
                    />
                    <Input
                      name="foto_profile"
                      type="file"
                      display="none"
                      id="foto_profile"
                      onChange={(e) => handleChange(e)}
                    />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    position="absolute"
                    mt="56"
                  >
                    <Heading fontSize="xl">{userLogin.nama_lengkap}</Heading>
                    <Text fontSize="lg">{userLogin.jabatan}</Text>
                  </Box>
                </Box>
              </Box>
            </Skeleton>
            <Skeleton isLoaded={loading}>
              <Box mt="28" px={["0", "8", "20"]} py="10">
                <Tabs isFitted>
                  <TabList>
                    <Tab>Ganti Data Diri</Tab>
                    <Tab>Ganti Password</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <FormChangeProfileUser
                        changed={() => setChange(change + setChange)}
                      />
                    </TabPanel>
                    <TabPanel>
                      <FormChangePassword />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Skeleton>
          </Box>
        </Box>
        <Drawer onClose={onCloseDrawer} isOpen={isOpenDrawer} size="full">
          <DrawerOverlay />
          <DrawerContent
            bg={colorMode === "dark" ? "blackAlpha.700" : "whiteAlpha.700"}
          >
            <DrawerCloseButton />
            <DrawerBody
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Avatar
                background={colorMode === "dark" ? "white" : "orange"}
                color={colorMode === "dark" ? "black" : "white"}
                name={userLogin.nama_lengkap}
                position="absolute"
                boxShadow="lg"
                width="80"
                height="80"
                border={`4px solid ${colorMode === "dark" ? "black" : "white"}`}
                src={path + userLogin.foto_profile}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </DashboardLayout>
    </>
  );
};

export default ProtectedRoute(ProfileApp);
