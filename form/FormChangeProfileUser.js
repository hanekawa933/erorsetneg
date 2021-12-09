import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import instance from "../axios.default";
import { useEffect, useState, useContext } from "react";

const FormChangeProfileUser = ({ changed }) => {
  const toast = useToast();
  const [userLogin, setUserLogin] = useState([]);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/profile");
      setUserLogin(result.data.data);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserLogin();
  }, []);

  const Schema = Yup.object().shape({
    nama_lengkap: Yup.string().required("Input tidak boleh kosong"),
    jenis_kelamin: Yup.string().required("Input tidak boleh kosong"),
    email: Yup.string()
      .required("Input tidak boleh kosong")
      .email("Email tidak valid"),
    no_telp: Yup.number()
      .typeError("Input harus berupa angka")
      .required("Input tidak boleh kosong"),
    jabatan: Yup.string().required("Input tidak boleh kosong"),
  });

  const updateUserAccount = async (values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(values);

      const result = await instance.put(`/user/update_profile`, body, config);
      fetchUserLogin();
      changed(1);
      toast({
        title: "Berhasil Update",
        description: "Profile anda berhasil diubah!",
        status: "success",
        duration: 2000,
        position: "top",
      });
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
    }
  };

  const formik = useFormik({
    initialValues: {
      nama_lengkap: userLogin.nama_lengkap,
      jenis_kelamin: userLogin.jenis_kelamin,
      email: userLogin.email,
      no_telp: userLogin.no_telp,
      jabatan: userLogin.jabatan,
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      updateUserAccount(values);
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
  } = formik;

  const InputTypeText = (label) => {
    return (
      <FormControl
        id={label}
        pt="5"
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
              {InputTypeText("nama_lengkap")}
              <FormControl
                id="jenis_kelamin"
                pt="5"
                isInvalid={Boolean(
                  touched.jenis_kelamin && errors.jenis_kelamin
                )}
              >
                <FormLabel textTransform="capitalize">Jenis Kelamin</FormLabel>
                <Select
                  placeholder="Pilih Jenis Kelamin"
                  name="jenis_kelamin"
                  {...getFieldProps("jenis_kelamin")}
                  onBlur={handleBlur}
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </Select>
                <FormErrorMessage>
                  {touched.jenis_kelamin && errors.jenis_kelamin}
                </FormErrorMessage>
              </FormControl>
              {InputTypeText("email")}
              {InputTypeText("no_telp")}
              {InputTypeText("jabatan")}
              <Box display="flex" justifyContent="flex-end">
                <Button
                  colorScheme="orange"
                  mt="5"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Ganti Profile
                </Button>
              </Box>
            </Box>
          </Form>
        </FormikProvider>
      </Box>
    </>
  );
};

export default FormChangeProfileUser;
