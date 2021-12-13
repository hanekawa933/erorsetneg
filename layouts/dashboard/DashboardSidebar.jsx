import { useContext, useEffect, useState } from "react";
import { TempContext } from "../../context/TempContext";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  useColorMode,
  Switch,
  Button,
  Image,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import NavSection from "./NavSection";
import path from "../../constant.default";
import instance from "../../axios.default";

const DashboardSidebar = () => {
  const { colorMode } = useColorMode();
  const [settings, setSettings] = useContext(TempContext);
  const [experience, setExperience] = useState([]);
  const toggleChange = () => {
    setSettings({ ...settings, bigMode: !settings.bigMode });
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toggleSidebar = () => {
    setSettings({ ...settings, active: !settings.active });
  };

  const fetchExp = async () => {
    try {
      const result = await instance.get("/exp");
      setExperience(result.data.data);
    } catch (error) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    fetchExp();
  }, []);

  const exp =
    settings && settings.userLogin && parseInt(settings.userLogin.current_exp);

  const nextLevel =
    exp <= 100
      ? 100
      : exp >= 101 && exp <= 200
      ? 201
      : exp >= 201 && exp <= 400
      ? 401
      : exp >= 401 && exp <= 800
      ? 801
      : exp >= 801 && exp <= 1600
      ? 1601
      : exp >= 1601 && exp <= 3200
      ? 3201
      : 9999;

  const expNeeded =
    exp <= 100
      ? 100 - exp
      : exp >= 101 && exp <= 200
      ? 201 - exp
      : exp >= 201 && exp <= 400
      ? 401 - exp
      : exp >= 401 && exp <= 800
      ? 801 - exp
      : exp >= 801 && exp <= 1600
      ? 1601 - exp
      : exp >= 1601 && exp <= 3200
      ? 3201 - exp
      : "Kamu sudah berada pada level maksimal";
  const currentPercentage = Math.round((exp / nextLevel) * 100);

  const modalExp = (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" flexDirection="column">
          <Box fontWeight="bold">Level</Box>
          <Box
            background="#FFD202"
            px="3"
            borderRadius="lg"
            width="max-content"
            mt="3"
            color="black"
          >
            {exp} EXP
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box fontWeight="semibold" mb="3">
            {exp < 3201
              ? `Kamu butuh ${expNeeded} exp untuk mencapai level berikutnya`
              : "Kamu sudah mencapai level maximal"}
          </Box>
          <Progress
            hasStripe
            value={exp < 3201 ? currentPercentage : 100}
            colorScheme="orange"
            isAnimated
          />
          <Box
            display="flex"
            // justifyContent="space-between"
            fontWeight="semibold"
            justifyContent="end"
            width={`${currentPercentage}%`}
          >
            <Box>{currentPercentage}%</Box>
          </Box>
          {experience.map((res) => {
            const expe = parseInt(res.exp);
            let a = "";

            if (parseInt(res.id) === 1) {
              a += exp <= expe ? "3px solid #FFD202" : null;
            } else if (parseInt(res.id) !== 7) {
              a +=
                exp >= expe / 2 + 1 && exp <= expe ? "3px solid #FFD202" : null;
            } else {
              a += exp > expe ? "3px solid #FFD202" : null;
            }
            return (
              <Box
                key={res.id}
                display="flex"
                background={colorMode === "dark" ? "gray.900" : "gray.100"}
                my="5"
                p="3"
                borderRadius="xl"
                border={a}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="20%"
                >
                  <Box
                    as="object"
                    data={`/assets/svg/${
                      expe <= 100
                        ? "bronze"
                        : expe >= 101 && expe <= 200
                        ? "silver"
                        : expe >= 201 && expe <= 400
                        ? "gold"
                        : expe >= 401 && expe <= 800
                        ? "diamond"
                        : expe >= 801 && expe <= 1600
                        ? "ruby"
                        : expe >= 1601 && expe <= 3200
                        ? "Sapphire"
                        : "emerald"
                    }.svg`}
                    type="image/svg+xml"
                    maxW="100%"
                    height={["14"]}
                    pointerEvents="none"
                  ></Box>
                </Box>
                <Box>
                  <Box fontWeight="bold" fontSize="1.2em">
                    {res.nama}
                  </Box>
                  <Box>
                    {parseInt(res.id) === 1
                      ? "0"
                      : parseInt(res.id) === 7
                      ? ""
                      : expe / 2 + 1}
                    {parseInt(res.id) === 7 ? "" : " - "}
                    {expe}
                    {parseInt(res.id) === 7 ? "++" : null}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <Box
      w={[
        "280px",
        "280px",
        "280px",
        settings.bigMode === true ? "90px" : "280px",
        settings.bigMode === true ? "90px" : "280px",
        settings.bigMode === true ? "90px" : "280px",
      ]}
      role="group"
      minHeight="100%"
      borderRight="2px"
      borderColor="gray.200"
      display={[
        settings.active === true ? "inline" : "none",
        settings.active === true ? "inline" : "none",
        settings.active === true ? "inline" : "none",
        "inline",
        "inline",
        "inline",
      ]}
      bg={useColorMode().colorMode === "dark" ? "gray.800" : "white"}
      transform={[
        settings.active === true ? "translateX(0)" : "translateX(-100%)",
        settings.active === true ? "translateX(0)" : "translateX(-100%)",
        settings.active === true ? "translateX(0)" : "translateX(-100%)",
        settings.active === true ? "translateX(0)" : "translateX(-100%)",
        "translateX(0)",
        "translateX(0)",
      ]}
      pb="10"
      _hover={{
        width: settings.bigMode === true ? "280px" : "280px",
        opacity: [
          "1",
          "1",
          "1",
          "1",
          settings.bigMode === true ? "0.97" : "1",
          settings.bigMode === true ? "0.97" : "1",
        ],
        overflowY: "auto",
      }}
      position="fixed"
      zIndex={999}
      overflowY={settings.userLogin.role_id ? "auto" : "hidden"}
      overflowX="hidden"
      top="0"
      bottom="45px"
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "var(--chakra-colors-gray-200)",
          borderRadius: "24px",
        },
      }}
    >
      <Flex
        pt="5"
        px="5"
        justifyContent={[
          "space-between",
          "space-between",
          "space-between",
          "space-between",
          settings.bigMode === true ? "center" : "space-between",
          settings.bigMode === true ? "center" : "space-between",
        ]}
        alignItems="center"
        _groupHover={{ justifyContent: "space-between" }}
      >
        <Link href="/" passHref={true}>
          <a>
            <Image boxSize="50px" src="/assets/img/EROR.png" alt="E-ROR" />
          </a>
        </Link>
        <Tooltip label="Toggle Big Mode" zIndex={1000}>
          <Box>
            <Switch
              size="md"
              display={[
                "none",
                "none",
                "none",
                "none",
                settings.bigMode === true ? "none" : "inline",
                settings.bigMode === true ? "none" : "inline",
              ]}
              _groupHover={{
                display: ["none", "none", "none", "none", "inline", "inline"],
              }}
              onChange={() => toggleChange()}
            />
          </Box>
        </Tooltip>
        <Button
          display={["inline", "inline", "inline", "inline", "none", "none"]}
          onClick={() => toggleSidebar()}
        >
          <Icon icon="eva:close-fill" width={24} height={24} />
        </Button>
      </Flex>
      <Box
        my={[
          "7",
          "7",
          "7",
          "7",
          settings.bigMode === true ? "4" : "7",
          settings.bigMode === true ? "4" : "7",
        ]}
        borderRadius="md"
        py={settings.bigMode === true ? "2" : "4"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        boxShadow={[
          "xl",
          "xl",
          "xl",
          "xl",
          settings.bigMode === true ? "none" : "xl",
          settings.bigMode === true ? "none" : "xl",
        ]}
        mx={settings.bigMode === true ? "3" : "3"}
        _groupHover={{ boxShadow: "xl", mx: "3", my: "7", py: "4" }}
        background={colorMode === "dark" ? "gray.900" : "gray.50"}
      >
        <Link href="/profile" passHref>
          <a>
            <Avatar
              size="md"
              name={settings.userLogin.nama_lengkap}
              background={colorMode === "dark" ? "white" : "orange"}
              color={colorMode === "dark" ? "black" : "white"}
              border={`2px solid ${colorMode === "dark" ? "white" : "black"}`}
              src={path + settings.userLogin.foto_profile}
            />
          </a>
        </Link>
        <Box
          mx="3"
          display={[
            "inline",
            "inline",
            "inline",
            "inline",
            settings.bigMode === true ? "none" : "inline",
            settings.bigMode === true ? "none" : "inline",
          ]}
          _groupHover={{ display: "inline" }}
          cursor="pointer"
          onClick={() => onOpen()}
        >
          <Heading fontSize="md">
            {settings.userLogin &&
              settings.userLogin.nama_lengkap &&
              settings.userLogin.nama_lengkap.split(" ")[0]}
          </Heading>
          {parseInt(settings.userLogin.role_id) === 1 ? (
            <Box display="flex" justifyContent="space-between" mt="1">
              <Box
                background="#FFD202"
                borderRadius="md"
                width="max-content"
                py="1"
                px="2"
              >
                <Text fontSize="small" color="black" fontWeight="semibold">
                  {exp}
                  <Box as="span" textTransform="uppercase" ml="1">
                    exp
                  </Box>
                </Text>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                ml="1"
              >
                <Box
                  as="object"
                  data={`/assets/svg/${
                    exp <= 100
                      ? "bronze"
                      : exp >= 101 && exp <= 200
                      ? "silver"
                      : exp >= 201 && exp <= 400
                      ? "gold"
                      : exp >= 401 && exp <= 800
                      ? "diamond"
                      : exp >= 801 && exp <= 1600
                      ? "ruby"
                      : exp >= 1601 && exp <= 3200
                      ? "Sapphire"
                      : "emerald"
                  }.svg`}
                  type="image/svg+xml"
                  maxW="100%"
                  height={["7"]}
                  pointerEvents="none"
                ></Box>
                <Text fontWeight="semibold">{settings.userLogin.level}</Text>
              </Box>
            </Box>
          ) : (
            <Text>{settings.userLogin.role_name}</Text>
          )}
        </Box>
      </Box>
      {modalExp}
      <NavSection />
    </Box>
  );
};

export default DashboardSidebar;
