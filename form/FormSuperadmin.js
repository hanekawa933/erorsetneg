import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Text,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Select,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, Field } from "formik";
import instance from "../axios.default";

const FormSuperadmin = () => {
  const [create, setCreate] = useState([]);

  const Schema = Yup.object().shape({
    username: Yup.string().required("Input tidak boleh kosong"),
    nama_lengkap: Yup.string().required("Input tidak boleh kosong"),
    password: Yup.string()
      .required("Input tidak boleh kosong")
      .min(8, "Password minimal harus terdiri dari 8 karakter"),
    password_verify: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords tidak sama")
      .required(),
  });

  const createSuperadmin = async (data) => {
    const body = JSON.stringify(data);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const result = await instance.post("/superadmin", body, config);
      setCreate(result.data.data);
    } catch (error) {
      alert(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      nama_lengkap: "",
      password: "",
      password_verify: "",
    },
    validationSchema: Schema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      createSuperadmin(values);
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
    handleChange,
    setFieldValue,
    values,
  } = formik;

  const InputTypeText = (label) => {
    return (
      <FormControl
        id={label}
        pt="5"
        isInvalid={Boolean(touched[label] && errors[label])}
      >
        <FormLabel textTransform="capitalize">{label}</FormLabel>
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
    <Box mt="5">
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          {InputTypeText("username")}
          {InputTypeText("nama_lengkap")}
          <Box display="flex">
            <FormControl
              id="password"
              pt="5"
              isInvalid={Boolean(touched.password && errors.password)}
            >
              <FormLabel textTransform="capitalize">password</FormLabel>
              <Input
                type="password"
                name="password"
                {...getFieldProps("password")}
                onBlur={handleBlur}
              />
              <FormErrorMessage>
                {touched.password && errors.password}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="password_verify"
              pt="5"
              ml="5"
              isInvalid={Boolean(
                touched.password_verify && errors.password_verify
              )}
            >
              <FormLabel textTransform="capitalize">
                Verifikasi Password
              </FormLabel>
              <Input
                type="password"
                name="password_verify"
                {...getFieldProps("password_verify")}
                onBlur={handleBlur}
              />
              <FormErrorMessage>
                {touched.password_verify && errors.password_verify}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="end">
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              mt="5"
            >
              Masukan Data
            </Button>
          </Box>
        </Form>
      </FormikProvider>
    </Box>
  );
};

export default FormSuperadmin;
