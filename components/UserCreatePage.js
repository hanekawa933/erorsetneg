import { FormUserReport } from "../form";
import {
  Box,
  Text,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { TempContext } from "../context/TempContext";
import instance from "../axios.default";
import { useRouter } from "next/router";
import path from "../constant.default";
import { ChevronRightIcon } from "@chakra-ui/icons";

export default function UserCreatePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [category, setCategory] = useState([]);
  const [settings, setSettings] = useContext(TempContext);
  const [change, setChange] = useState(0);

  const router = useRouter();
  const { id } = router.query;

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/profile");
      setSettings({ ...settings, userLogin: result.data.data });
    } catch (error) {
      router.push("/");
    }
  };

  const fetchCategoryById = async (id) => {
    try {
      const result = await instance.get(`/kategori/item/id/${id}`);
      setCategory(result.data.data);
    } catch (error) {
      if (parseInt(error.response.status) === 404) {
        router.push("/404");
      } else {
        router.push("/500");
      }
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    fetchUserLogin();
    fetchCategoryById(id);
  }, [id, change]);

  return (
    <Box p="4">
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon />}
        fontSize="lg"
        px={["3", "3", "4"]}
        pb={["3", "3", "4"]}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href="/category">Laporan</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href="#" isCurrentPage>
            {category.nama}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
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
            letterSpacing={["0px", "0px", "2px"]}
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
      <Box>
        <FormUserReport
          id={id}
          fetchReport={!id ? null : () => setChange(change + setChange)}
        />
      </Box>
    </Box>
  );
}
