import { useState, useEffect, useRef, createRef } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Textarea,
  Grid,
  useToast,
  Image,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import instance from "../axios.default";

const FormUserReport = ({ id }) => {
  const toast = useToast();
  const [preview, setPreview] = useState([]);

  function checkIfFilesAreTooBig(gambar) {
    let valid = true;
    if (gambar) {
      gambar.map((file) => {
        const size = file.size / 1024 / 1024;
        if (size > 10) {
          valid = false;
        }
      });
    }
    return valid;
  }

  function checkIfFilesAreCorrectType(gambar) {
    let valid = true;
    if (gambar) {
      gambar.map((file) => {
        if (
          !["application/pdf", "image/jpeg", "image/png"].includes(file.type)
        ) {
          valid = false;
        }
      });
    }
    return valid;
  }

  const Schema = Yup.object().shape({
    jenis_kerusakan: Yup.string().required("Input tidak boleh kosong"),
    lokasi: Yup.string().required("Input tidak boleh kosong"),
    keterangan: Yup.string().required(),
    kategori_id: Yup.number().required("Input tidak boleh kosong"),
    gambar: Yup.array().nullable(),
    // .required("File tidak boleh kosong")
  });

  const createReport = async (data) => {
    // const body = JSON.stringify(data);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const result = await instance.post("/laporan/user", data, config);
      toast({
        title: "Berhasil",
        description: "Laporan berhasil dibuat.",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      console.log(error.response);
      toast({
        title: "Gagal",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  const gambarRef = useRef();

  const handleReset = () => {
    gambarRef.current.value = null; //THIS RESETS THE FILE FIELD
  };

  const formik = useFormik({
    initialValues: {
      gambar: [],
      jenis_kerusakan: "",
      lokasi: "",
      keterangan: "",
      kategori_id: id,
    },
    validationSchema: Schema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      const formData = new FormData();
      formData.append("jenis_kerusakan", values.jenis_kerusakan);
      formData.append("lokasi", values.lokasi);
      formData.append("keterangan", values.keterangan);
      for (let i = 0; i < values.gambar.length; i++) {
        formData.append("gambar[]", values.gambar[i]);
      }
      formData.append("kategori_id", values.kategori_id);
      createReport(formData);
      resetForm({});
      setSubmitting(false);
      handleReset();
      setPreview([]);
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

  const fileobj = [];

  // console.log(values);

  // console.log(values.gambar);
  const changedHandler = (event) => {
    let files = event.target.files;
    fileobj.push(files);
    let reader;
    setFieldValue("gambar", event.currentTarget.files);

    preview = [];

    for (var i = 0; i < fileobj[0].length; i++) {
      reader = new FileReader();
      reader.readAsDataURL(fileobj[0][i]);
      reader.onload = (event) => {
        preview.push(event.target.result); // update the array instead of replacing the entire value of preview
        setPreview([...preview]); // spread into a new array to trigger rerender
      };
    }
  };

  return (
    <Box mt="5">
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          {InputTypeText("jenis_kerusakan")}
          {InputTypeText("lokasi")}
          <FormControl
            id="keterangan"
            pt="5"
            isInvalid={Boolean(touched.keterangan && errors.keterangan)}
          >
            <FormLabel textTransform="capitalize">Keterangan</FormLabel>
            <Textarea
              type="text"
              name="keterangan"
              {...getFieldProps("keterangan")}
              onBlur={handleBlur}
            />
            <FormErrorMessage>
              {touched.keterangan && errors.keterangan}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            id="gambar"
            isInvalid={Boolean(touched.gambar && errors.gambar)}
            mt="5"
          >
            <FormLabel>Bukti Laporan</FormLabel>
            <Input
              variant="flushed"
              type="file"
              name="gambar[]"
              onBlur={handleBlur}
              onChange={(event) => changedHandler(event)}
              multiple
              ref={gambarRef}
              accept=".png, .jpg, jpeg, .gif, .bmp"
            />
            <FormErrorMessage>
              {touched.gambar && errors.gambar}
            </FormErrorMessage>
          </FormControl>
          <Box display="flex" flexDir="column" mt="3">
            <Box
              as="span"
              fontWeight="semibold"
              textTransform="capitalize"
            ></Box>
            <Grid templateColumns="repeat(3,1fr)" gap={6} mt="3">
              {(preview || []).map((url, index) => (
                <Image
                  src={url}
                  alt="..."
                  key={index}
                  style={{ height: "200px", width: "200px" }}
                />
              ))}
            </Grid>
          </Box>
          <Box display="flex" justifyContent="end">
            <Button
              type="submit"
              colorScheme="orange"
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

export default FormUserReport;
