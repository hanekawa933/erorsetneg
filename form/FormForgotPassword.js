import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import instance from "../axios.default";
import { useRouter } from "next/router";
import Link from "next/link";

const FormForgotPassword = () => {
  const router = useRouter();
  const toast = useToast();

  const Schema = Yup.object().shape({
    email: Yup.string()
      .required("Input tidak boleh kosong")
      .email("Email tidak valid"),
  });

  const forgotPassword = async (values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(values);
      const result = await instance.post(`/user/forgot`, body, config);

      toast({
        title: "Berhasil Terkirim",
        description: "Kode OTP telah dikirim ke email anda!",
        status: "success",
        duration: 2000,
        position: "top",
      });
      const decoded = decodeURIComponent(values.email);
      router.push(`/forgot_password?email=${decoded}`);
    } catch (error) {
      toast({
        title: "Gagal Terkirim",
        description: error.response
          ? error.response.data.message
          : "Server Error",
        status: "error",
        duration: 2000,
        position: "top",
      });
      router.push(`/forgot_password`);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Schema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      forgotPassword(values);

      setTimeout(() => {
        setSubmitting(false);
        resetForm({});
      }, 5000);
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

  const InputTypeText = (label) => {
    return (
      <FormControl
        id={label}
        isInvalid={Boolean(touched[label] && errors[label])}
      >
        <FormLabel textTransform="capitalize">
          {label.split("_").join(" ")}
        </FormLabel>
        <Input
          type="text"
          name={label}
          {...getFieldProps(label)}
          onBlur={handleBlur}
        />
        <FormErrorMessage>{touched[label] && errors[label]}</FormErrorMessage>
      </FormControl>
    );
  };

  return (
    <>
      <Box>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box>
              {InputTypeText("email")}
              <Button
                colorScheme="orange"
                mt="5"
                type="submit"
                width="100%"
                isLoading={isSubmitting}
              >
                Kirim
              </Button>
              <Link href="/login">
                <a>
                  <Button
                    colorScheme="gray"
                    mt="3"
                    type="submit"
                    width="100%"
                    isLoading={isSubmitting}
                  >
                    Batal
                  </Button>
                </a>
              </Link>
            </Box>
          </Form>
        </FormikProvider>
      </Box>
    </>
  );
};

export default FormForgotPassword;
