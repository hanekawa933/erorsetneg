import { useContext, useEffect } from "react";
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
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import NavSection from "./NavSection";
import path from "../../constant.default";

const DashboardSidebar = () => {
  const { colorMode } = useColorMode();
  const [settings, setSettings] = useContext(TempContext);

  const toggleChange = () => {
    setSettings({ ...settings, bigMode: !settings.bigMode });
  };

  const toggleSidebar = () => {
    setSettings({ ...settings, active: !settings.active });
  };

  const exp =
    settings && settings.userLogin && parseInt(settings.userLogin.current_exp);

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
        <Link href="/dashboard/home" passHref={true}>
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
        <Avatar
          size="md"
          name={settings.userLogin.nama_lengkap}
          background={colorMode === "dark" ? "white" : "orange"}
          color={colorMode === "dark" ? "black" : "white"}
          border={`2px solid ${colorMode === "dark" ? "white" : "black"}`}
          src={path + settings.userLogin.foto_profile}
        />
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
      <NavSection />
    </Box>
  );
};

export default DashboardSidebar;
