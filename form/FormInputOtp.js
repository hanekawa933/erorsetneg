import { useRef } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  PinInput,
  PinInputField,
  Grid,
  Link,
} from "@chakra-ui/react";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import instance from "../axios.default";
import { useRouter } from "next/router";

const FormInputOtp = () => {
  const router = useRouter();
  const toast = useToast();

  const { email } = router.query;

  const Schema = Yup.object().shape({
    kode: Yup.number()
      .typeError("Input harus berupa angka")
      .required("Input tidak boleh kosong"),
  });

  const authResetOtp = async (values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(values);
      const encoded = encodeURIComponent(email);
      const result = await instance.post(
        `/user/auth_reset/email/${encoded}`,
        body,
        config
      );
      toast({
        title: "Berhasil Terkirim",
        description: "Autentikasi berhasil! Silahkan reset password anda.",
        status: "success",
        duration: 2000,
        position: "top",
      });
      router.push(`/forgot_password?email=${encoded}&otp=${values.kode}`);
    } catch (error) {
      toast({
        title: "Gagal Verifikasi",
        description: error.response
          ? error.response.data.message
          : "Server Error",
        status: "error",
        duration: 2000,
        position: "top",
      });
      const encoded = encodeURIComponent(email);
      router.push(`/forgot_password?email=${encoded}`);
      console.log(error.response);
    }
  };

  const formik = useFormik({
    initialValues: {
      kode: "",
    },
    validationSchema: Schema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      authResetOtp(values);
      setSubmitting(false);
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
    values,
    handleChange,
    setFieldValue,
  } = formik;

  const handleInput = (val) => {
    setFieldValue("kode", val);
  };

  const handleComplete = (val) => {
    setFieldValue("kode", val);
  };

  const forgotPassword = async (values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(values);

      const result = await instance.post(`/user/forgot`, body, config);
      toast.closeAll();
      toast({
        title: "Berhasil Terkirim",
        description: "Kode OTP telah dikirim ke email anda!",
        status: "success",
        duration: 2000,
        position: "top",
      });
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
      console.log(error.response);
    }
  };

  return (
    <>
      <Box>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box>
              <Box>
                <FormControl
                  id="kode"
                  isInvalid={Boolean(touched.kode && errors.kode)}
                >
                  <FormLabel textTransform="capitalize">Kode OTP</FormLabel>
                  <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                    <PinInput
                      size="lg"
                      name="kode"
                      onChange={handleInput}
                      onComplete={handleComplete}
                    >
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </Grid>
                  <FormErrorMessage>
                    {touched.kode && errors.kode}
                  </FormErrorMessage>
                </FormControl>
              </Box>
              <Box textAlign="center" mt="5">
                <Box as="span" fontWeight="semibold" color="gray.500">
                  Tidak menerima kode?
                </Box>
                <Link
                  px="2"
                  color="#E67503"
                  href="#"
                  fontWeight="700"
                  textTransform="uppercase"
                  onClick={() => {
                    toast({
                      title: "Mohon tunggu",
                      description: "Pengiriman email sedang diproses",
                      background: "blue",
                      position: "top",
                    });
                    forgotPassword({ email });
                    return false;
                  }}
                  display={["block", "inline"]}
                >
                  Kirim ulang
                </Link>
              </Box>
              <Button
                colorScheme="orange"
                mt="5"
                type="submit"
                width="100%"
                isLoading={isSubmitting}
                isDisabled={values.kode.length < 4 ? true : false}
              >
                Verifikasi
              </Button>
            </Box>
          </Form>
        </FormikProvider>
      </Box>
    </>
  );
};

export default FormInputOtp;
