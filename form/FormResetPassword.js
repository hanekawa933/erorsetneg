import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  FormErrorMessage,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { useFormik, Form, FormikProvider } from "formik";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import * as Yup from "yup";
import instance from "../axios.default";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const FormResetPassword = () => {
  const router = useRouter();
  const { email, otp } = router.query;
  const [hidden, setHidden] = useState(true);
  const [verifyHidden, setVerifyHidden] = useState(true);
  const toast = useToast();
  const Schema = Yup.object().shape({
    password: Yup.string()
      .required("Input tidak boleh kosong")
      .min(8, "Password minimal harus terdiri dari 8 karakter"),
    password_verify: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords tidak sama")
      .required("Input tidak boleh kosong"),
  });

  const checkOTP = async (mail, kode) => {
    try {
      const encoded = encodeURIComponent(mail);
      const result = await instance.get(
        `/user/expired_kode?email=${encoded}&kode=${kode}`
      );
    } catch (error) {
      router.push("/forgot_password");
    }
  };

  useEffect(() => {
    if (!otp && !email) {
      return;
    }

    checkOTP(email, otp);
  }, [email, otp]);

  const resetUserPassword = async (values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const encoded = encodeURIComponent(email);
      const body = JSON.stringify(values);
      const result = await instance.put(
        `/user/reset_password/email/${encoded}/kode/${otp}`,
        body,
        config
      );
      toast({
        title: "Berhasil Update",
        description: "Password anda berhasil diubah!",
        status: "success",
        duration: 2000,
        position: "top",
      });

      router.push("/login");
    } catch (error) {
      toast({
        title: "Gagal Update",
        description: error.response
          ? error.response.data.message
          : "Server Error",
        status: "error",
        duration: 2000,
        position: "top",
      });
      const encoded = encodeURIComponent(email);
      router.push(`/forgot_password?email=${encoded}&otp=${otp}`);
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      password_verify: "",
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      resetUserPassword(values);
      setSubmitting(false);
      resetForm({});
    },
    enableReinitialize: true,
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
    <>
      <Box>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box>
              <FormControl
                id="password"
                pt="5"
                isInvalid={Boolean(touched.password && errors.password)}
              >
                <FormLabel textTransform="capitalize">Password</FormLabel>
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
              >
                <FormLabel textTransform="capitalize">
                  Ulangi Password
                </FormLabel>
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
              <Button
                colorScheme="orange"
                mt="5"
                type="submit"
                isLoading={isSubmitting}
                width="100%"
              >
                Reset Password
              </Button>
            </Box>
          </Form>
        </FormikProvider>
      </Box>
    </>
  );
};

export default FormResetPassword;
