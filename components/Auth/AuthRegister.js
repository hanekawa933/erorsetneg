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
} from "@chakra-ui/react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import instance from "../../axios.default";

import { useRouter } from "next/router";

const AuthRegister = () => {
  const toast = useToast();
  const Router = useRouter();
  const [hidden, setHidden] = useState(true);
  const [verifyHidden, setVerifyHidden] = useState(true);

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

      setTimeout(() => {
        Router.push("/login");
      }, 2000);
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
    },
    validationSchema: Schema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      register(values);
      setTimeout(() => {
        resetForm({});
        setSubmitting(false);
      }, 2000);
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    handleBlur,
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
        <Box display="flex" flexDir={["column", "row"]}>
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
            ml={["0", "3"]}
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
    </FormikProvider>
  );
};

export default AuthRegister;
