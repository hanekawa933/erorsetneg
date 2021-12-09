import { useState, useContext, useEffect } from "react";
import { TempContext } from "../../context/TempContext";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  Button,
  Divider,
  useColorMode,
  Text,
  Link,
} from "@chakra-ui/react";
import { SettingsIcon, SunIcon, MoonIcon, BellIcon } from "@chakra-ui/icons";
import { Icon } from "@iconify/react";
import instance from "../../axios.default";
import moment from "moment";
import "moment/locale/id";

const DashboardNavbar = () => {
  const NavbarMobile = "64px";
  const NavbarDesktop = "92px";
  const { colorMode, toggleColorMode } = useColorMode();
  const [notif, setNotif] = useState([]);
  const [notifCount, setNotifCount] = useState(null);

  const [settings, setSettings] = useContext(TempContext);

  const toggleSidebar = () => {
    setSettings({ ...settings, active: !settings.active });
  };

  const fetchUserNotif = async () => {
    try {
      const result = await instance.get("/notifikasi/user");
      setNotif(result.data.data);
    } catch (error) {
      alert("Error");
      console.log(result);
    }
  };

  useEffect(() => {
    fetchUserNotif();
    setNotifCount(localStorage.getItem("notification"));
  }, []);

  let dateNow = 0;

  const notifikasi =
    notif &&
    notif.map((res) => {
      const today = moment().format("YYYY-MM-DD");
      const notifDate = moment(res.created_at).format("YYYY-MM-DD");
      const checkDate = moment(today).isSame(notifDate);
      checkDate ? (dateNow += 1) : (dateNow += 0);
      return (
        <Box
          key={res.id}
          _hover={{
            background: colorMode === "dark" ? "gray.800" : "gray.100",
          }}
          width="100%"
        >
          <Link
            href={`/report/${res.lId}/${res.jenis_kerusakan}`}
            _hover={{ textDecor: "none" }}
          >
            <Box display="flex" alignItems="center" p="5">
              <Box
                background="#FFD202"
                borderRadius="full"
                p="2"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <BellIcon fontSize="20px" color="orange.500" />
              </Box>
              <Box ml="5">
                <Box display="flex">
                  <Box width="70%">
                    <Text fontWeight="semibold">{res.pesan}</Text>
                  </Box>
                  <Box
                    flex="1"
                    fontSize="0.7em"
                    display="flex"
                    justifyContent="end"
                  >
                    <Box as="span">
                      {moment(res.created_at).format("Do MMM, H:mm")}
                    </Box>
                  </Box>
                </Box>
                <Box>
                  {res.keterangan.substr(0, 100)}
                  {res.keterangan.length > 100 ? "..." : null}
                </Box>
              </Box>
            </Box>
          </Link>
          <Divider />
        </Box>
      );
    });

  const setLocalStorage = () =>
    localStorage.setItem("notification", `${dateNow}`);
  return (
    <Box
      sx={{
        "--my-calculation":
          settings.bigMode === false
            ? "calc(100% - 280px)"
            : "calc(100% - 90px)",
      }}
      w={[
        "100%",
        "100%",
        "100%",
        "100%",
        "var(--my-calculation)",
        "var(--my-calculation)",
      ]}
      justifyContent="space-between"
      alignItems="center"
      height={[
        NavbarMobile,
        NavbarMobile,
        NavbarMobile,
        NavbarMobile,
        NavbarDesktop,
        NavbarDesktop,
      ]}
      bg={useColorMode().colorMode === "dark" ? "gray.800" : "white"}
      position="fixed"
      top="0"
      right="0"
      px="6"
      display="flex"
      zIndex="500"
    >
      <Button
        visibility={[
          "visible",
          "visible",
          "visible",
          "visible",
          "hidden",
          "hidden",
        ]}
        onClick={() => toggleSidebar()}
        zIndex="5000"
      >
        <Icon icon="ci:list-ul" width={24} height={24} />
      </Button>
      <Box display="flex">
        {parseInt(settings.userLogin.role_id) === 1 ? (
          <Menu>
            <MenuButton
              as={Button}
              mx="3"
              onClick={() => {
                setLocalStorage();
                setNotifCount(localStorage.getItem("notification"));
              }}
            >
              <BellIcon />
              {!notifCount || dateNow > parseInt(notifCount) ? (
                <Box
                  position="absolute"
                  top="-3"
                  right="-2"
                  bg="red"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="full"
                  width="25px"
                  height="25px"
                  color="white"
                >
                  {dateNow - notifCount}
                </Box>
              ) : null}
            </MenuButton>
            <MenuList width={["xs", "md"]} pb="5">
              <Box px="5" fontSize="1.1em" fontWeight="bold">
                <Text>Notifikasi</Text>
              </Box>
              <Divider pb="3" />
              <Box
                width="100%"
                height={["100vh", "70vh"]}
                overflowY="auto"
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
                {notifikasi}
              </Box>
            </MenuList>
          </Menu>
        ) : null}
        <Menu>
          <MenuButton as={Button}>
            <SettingsIcon />
          </MenuButton>
          <MenuList>
            <Box as="span" px="5" fontSize="1.1em" fontWeight="bold">
              Settings
            </Box>
            <Divider pb="3" />
            <Box display="flex" flexDirection="column" px="5">
              <Box as="span" py="3" fontWeight="semibold">
                App Theme
              </Box>
              <Box display="flex" justifyContent="space-around">
                <Box
                  cursor="pointer"
                  width="20"
                  height="20"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  background="yellow.100"
                  borderRadius="md"
                  _hover={{ background: "yellow.200" }}
                  onClick={colorMode === "dark" ? toggleColorMode : () => null}
                >
                  <SunIcon color="gray.900" />
                </Box>
                <Box
                  cursor="pointer"
                  width="20"
                  height="20"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  background="gray.800"
                  borderRadius="md"
                  _hover={{ background: "gray.900" }}
                  onClick={colorMode === "light" ? toggleColorMode : () => null}
                >
                  <MoonIcon color="gray.100" />
                </Box>
              </Box>
            </Box>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

export default DashboardNavbar;
