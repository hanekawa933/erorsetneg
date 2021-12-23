import Cookie from "js-cookie";
import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Link,
  Box,
  InputRightElement,
  InputGroup,
  useToast,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  OrderedList,
  useColorMode,
} from "@chakra-ui/react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import instance from "../../axios.default";

import router, { useRouter } from "next/router";

const AuthRegister = () => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const Router = useRouter();
  const [hidden, setHidden] = useState(true);
  const [verifyHidden, setVerifyHidden] = useState(true);
  const [scrollBehavior, setScrollBehavior] = useState("inside");

  const Schema = Yup.object().shape({
    email: Yup.string()
      .required("Input tidak boleh kosong")
      .email("Email tidak valid"),
    password: Yup.string()
      .required("Input tidak boleh kosong")
      .min(8, "Password minimal 8 huruf"),
    password_verify: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords tidak sama")
      .required("Input tidak boleh kosong"),
    nama_lengkap: Yup.string().required("Input Lengkap tidak boleh kosong"),
    tna: Yup.bool().oneOf(
      [true],
      "Kamu harus menyetujui kebijakan layanan dan privasi"
    ),
  });

  const register = async (val) => {
    try {
      const body = JSON.stringify(val);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await instance.post("/user/register", body, config);

      toast({
        title: "Berhasil daftar",
        description: "Akun berhasil didaftarkan",
        status: "success",
        duration: 2000,
        position: "top",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Pendaftaran Gagal",
        description: error.response
          ? error.response.data.message
          : "Server Error!",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      nama_lengkap: "",
      password_verify: "",
      tna: false,
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      delete values.tna;
      await register(values);
      resetForm();
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    handleBlur,
    setFieldValue,
    values,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <FormControl
          id="nama_lengkap"
          isInvalid={Boolean(touched.nama_lengkap && errors.nama_lengkap)}
        >
          <FormLabel>Nama Lengkap</FormLabel>
          <Input
            type="text"
            name="nama_lengkap"
            {...getFieldProps("nama_lengkap")}
            onBlur={handleBlur}
          />
          <FormErrorMessage>
            {touched.nama_lengkap && errors.nama_lengkap}
          </FormErrorMessage>
        </FormControl>
        <FormControl
          id="email"
          isInvalid={Boolean(touched.email && errors.email)}
          pt="5"
        >
          <FormLabel>Email</FormLabel>
          <Input
            type="text"
            name="email"
            {...getFieldProps("email")}
            onBlur={handleBlur}
          />
          <FormErrorMessage>{touched.email && errors.email}</FormErrorMessage>
        </FormControl>
        <Box display="flex" flexDir={["column", "column", "row"]}>
          <FormControl
            id="password"
            pt="5"
            isInvalid={Boolean(touched.password && errors.password)}
          >
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={hidden ? "password" : "text"}
                name="password"
                {...getFieldProps("password")}
                onBlur={handleBlur}
              />
              <InputRightElement
                mx="3"
                cursor="pointer"
                onClick={() => setHidden(!hidden)}
              >
                {hidden ? (
                  <ViewIcon w={6} h={6} />
                ) : (
                  <ViewOffIcon w={6} h={6} />
                )}
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {touched.password && errors.password}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            id="password_verify"
            pt="5"
            isInvalid={Boolean(
              touched.password_verify && errors.password_verify
            )}
            ml={["0", "0", "3"]}
          >
            <FormLabel>Ulangi Password</FormLabel>
            <InputGroup>
              <Input
                type={verifyHidden ? "password" : "text"}
                name="password_verify"
                {...getFieldProps("password_verify")}
                onBlur={handleBlur}
              />
              <InputRightElement
                mx="3"
                cursor="pointer"
                onClick={() => setVerifyHidden(!verifyHidden)}
              >
                {verifyHidden ? (
                  <ViewIcon w={6} h={6} />
                ) : (
                  <ViewOffIcon w={6} h={6} />
                )}
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {touched.password_verify && errors.password_verify}
            </FormErrorMessage>
          </FormControl>
        </Box>
        <Box display="flex" alignItems="center" mt="5">
          <FormControl
            id="nama_lengkap"
            isInvalid={Boolean(touched.tna && errors.tna)}
            width="max-content"
          >
            <Checkbox name="tna" {...getFieldProps("tna")} onBlur={handleBlur}>
              <Box
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                onClick={() => {
                  setFieldValue("tna", !values.tna);
                  onOpen();
                }}
              >
                Saya setuju dengan{" "}
                <Box as="span" color="orange">
                  kebijakan layanan
                </Box>{" "}
                dan{" "}
                <Box as="span" color="orange">
                  privasi
                </Box>
              </Box>
            </Checkbox>
            <FormErrorMessage>{touched.tna && errors.tna}</FormErrorMessage>
          </FormControl>
        </Box>
        <Button
          type="submit"
          colorScheme="orange"
          w="100%"
          isLoading={isSubmitting}
          mt="5"
        >
          Daftar
        </Button>
      </Form>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={scrollBehavior}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Kebijakan layanan dan privasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrderedList>
              <ListItem mt="3">
                E-ROR adalah suatu app atau web portal{" "}
                <Link href="/">
                  <a>
                    <Box
                      color={colorMode === "dark" ? "blue.300" : "blue.400"}
                      as="span"
                    >
                      www.
                      {typeof window !== "undefined" && window.location.hostname
                        ? window.location.hostname
                        : ""}
                    </Box>
                  </a>
                </Link>
                , yakni situs atau app terkait pelaporan kerusakan
                sarana/prasarana. Selanjutnya disebut E-ROR.
              </ListItem>
              <ListItem mt="3">
                Situs pelaporan kerusakan adalah{" "}
                <Link href="/">
                  <a>
                    <Box
                      color={colorMode === "dark" ? "blue.300" : "blue.400"}
                      as="span"
                    >
                      www.
                      {typeof window !== "undefined" && window.location.hostname
                        ? window.location.hostname
                        : ""}
                    </Box>
                  </a>
                </Link>
              </ListItem>
              <ListItem mt="3">
                Pengguna dengan ini menyatakan bahwa pengguna adalah orang yang
                cakap dan mampu untuk mengikatkan dirinya dalam sebuah
                perjanjian yang sah menurut hukum.
              </ListItem>
              <ListItem mt="3">
                E-ROR memiliki kewenangan untuk menutup akun Pengguna baik
                sementara maupun permanen apabila didapati adanya tindakan
                pelanggaran terhadap Syarat dan Ketentuan E-ROR . Pengguna
                menyetujui bahwa E-ROR berhak melakukan tindakan lain yang
                diperlukan terkait hal tersebut, termasuk menolak pengajuan
                pembukaan akun yang baru apabila ditemukan kesamaan data yang
                bermasalah sebelumnya.
              </ListItem>
              <ListItem mt="3">
                E-ROR adalah suatu app atau web portal, yakni situs atau app
                terkait pelaporan kerusakan sarana/prasarana. Selanjutnya
                disebut E-ROR.
              </ListItem>
              <ListItem mt="3">
                Syarat & ketentuan adalah perjanjian antara Pengguna dan E-ROR
                yang berisikan seperangkat peraturan yang mengatur hak,
                kewajiban, tanggung jawab pengguna dan E-ROR, serta tata cara
                penggunaan sistem layanan E-ROR.
              </ListItem>
              <ListItem mt="3">
                APP E-ROR tidak memungut biaya pendaftaran kepada Pengguna.
              </ListItem>
              <ListItem mt="3">
                Pengguna mengerti untuk dan memahami atas pelaporan kerusakan
                yang dikirimkan melalui APP/ website dan dapat
                dipertanggungjawabkan
              </ListItem>
              <ListItem mt="3">
                Pengguna mengirimkan lampiran foto atau video yang sesuai,
                apabila ditemukan foto/video yang mengandung unsur SARA/tidak
                senonoh, maka pengguna akan bertanggungjawab atas pelaporannya
                dan diproses secara hukum yang berlaku.
              </ListItem>
              <ListItem mt="3">
                Dilarang memodifikasi/mengedit/meretas situs/APP.
              </ListItem>
              <ListItem mt="3">
                Proses pendaftaran mengisikan dengan data diri yang benar.
              </ListItem>
            </OrderedList>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormikProvider>
  );
};

export default AuthRegister;
