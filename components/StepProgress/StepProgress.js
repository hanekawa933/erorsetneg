import { Box, useColorMode, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

const StepProgress = ({ index, stepNumber, status_id }) => {
  const iconStatus =
    status_id === 2
      ? "bx:bx-duplicate"
      : status_id === 7
      ? "fontisto:close-a"
      : "icon-park-outline:loading-two";

  const icon = [
    "ant-design:file-done-outlined",
    iconStatus,
    "akar-icons:check-in",
    "fluent:wrench-screwdriver-24-regular",
    "ic:round-done-outline",
  ];

  const boxColorStatus =
    status_id === 2 || status_id === 7 ? "red.200" : "blue.200";

  const boxColor = [
    "green.200",
    boxColorStatus,
    "yellow.200",
    "yellow.200",
    "green.200",
  ];

  const circleColorStatus =
    status_id === 2 || status_id === 7 ? "red.800" : "blue.800";

  const circleColor = [
    "green.800",
    circleColorStatus,
    "yellow.800",
    "yellow.800",
    "green.800",
  ];

  const validationStatus =
    status_id === 2 ? "Duplikat" : status_id === 7 ? "Ditolak" : "Validasi";
  const status = [
    "Terkirim",
    validationStatus,
    "Pengecekan",
    "Diperbaiki",
    "Selesai",
  ];

  const borderRadius = stepNumber === 1 ? "lg" : "none";
  const borderRadiusRight =
    stepNumber === 1 ? "none" : stepNumber === 5 ? "lg" : "none";

  let step1 = false;
  let step2 = false;
  let step3 = false;
  let step4 = false;
  let step5 = false;

  status_id === 1
    ? (step1 = true)
    : status_id === 2 || status_id === 3 || status_id === 7
    ? (step2 = true)
    : status_id === 4
    ? (step3 = true)
    : status_id === 5
    ? (step4 = true)
    : (step5 = true);

  const step = [step1, step2, step3, step4, step5];

  const setColorBox =
    useColorMode().colorMode === "dark" ? "gray.700" : "gray.200";

  const activeBoxColor =
    step[stepNumber - 1] === true ? boxColor[index] : setColorBox;
  const activeCircleColor =
    step[stepNumber - 1] === true ? circleColor[index] : setColorBox;

  return (
    <Box
      display="flex"
      flexDir="column"
      justifyContent="space-around"
      alignItems="center"
      bg={activeBoxColor}
      borderRadius={borderRadius}
      borderRightRadius={borderRadiusRight}
      p="3"
      px="5"
      borderRight={`2px solid ${
        useColorMode().colorMode === "dark"
          ? "var(--chakra-colors-gray-800)"
          : "white"
      }`}
      borderBottom={[`5px solid white`, `5px solid white`, "none"]}
    >
      <Box
        bg={activeCircleColor}
        width="50%"
        height="50%"
        borderRadius="50%"
        justifyContent="center"
        alignItems="center"
        border={`5px solid white`}
        p="3"
        display={["none", "none", "flex"]}
      >
        <Icon
          icon={icon[index]}
          width="100%"
          height="100%"
          color={useColorMode().colorMode === "dark" ? "white" : "white"}
        />
      </Box>
      <Box
        mt="3"
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Box
          as="span"
          fontWeight="semibold"
          color={useColorMode().colorMode === "dark" ? "white" : "black"}
        >
          Langkah {stepNumber}
        </Box>
        <Box
          as="span"
          fontSize="1em"
          color={useColorMode().colorMode === "dark" ? "white" : "black"}
        >
          {status[index]}
        </Box>
      </Box>
    </Box>
  );
};

export default StepProgress;
