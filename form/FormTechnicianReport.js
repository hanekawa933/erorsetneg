import {
  Box,
  FormControl,
  FormLabel,
  Button,
  FormErrorMessage,
  Textarea,
  useToast,
  Input,
  Grid,
  Image,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import instance from "../axios.default";
import { useState, useRef } from "react";
import { useRouter } from "next/router";

export const TahapPengecekan = ({ id, fetchReport }) => {
  const toast = useToast();
  const checkTech = async (data) => {
    const body = JSON.stringify(data);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const result = await instance.post(
        `/notifikasi/teknisi_cek/id/${id}`,
        body,
        config
      );
      fetchReport(1);
      toast({
        title: "Berhasil",
        description: "Laporan berhasil proses!",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Gagal",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values, { resetForm, setSubmitting }) => {
      checkTech();
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
    <Box mt="5">
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box display="flex" justifyContent="end">
            <Button
              colorScheme="yellow"
              isLoading={isSubmitting}
              mt="5"
              type="submit"
            >
              Konfirmasi Cek
            </Button>
          </Box>
        </Form>
      </FormikProvider>
    </Box>
  );
};

export const TahapSetelahPengecekan = ({ id, fetchReport }) => {
  const toast = useToast();
  const router = useRouter();
  const [reject, setReject] = useState(false);
  const [preview, setPreview] = useState([]);
  const [status, setStatus] = useState();

  const SchemaAccepted = Yup.object().shape({
    ket_teknisi: Yup.string().required("Input tidak boleh kosong"),
  });

  const SchemaRejected = Yup.object().shape({
    ket_teknisi: Yup.string().required("Input tidak boleh kosong"),
    gambar: Yup.string().required("File tidak boleh kosong"),
  });

  const initValuesAccepted = { ket_teknisi: "" };
  const initValuesRejected = { ket_teknisi: "", gambar: "" };

  const Schema = reject ? SchemaRejected : SchemaAccepted;
  const initValues = reject ? initValuesRejected : initValuesAccepted;

  const fixTech = async (data) => {
    const body = JSON.stringify(data);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const result = await instance.post(
        `/notifikasi/teknisi_perbaikan/id/${id}`,
        body,
        config
      );
      fetchReport(1);
      toast({
        title: "Berhasil",
        description: "Laporan berhasil proses!",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Gagal",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  const btaTech = async (data) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const result = await instance.post(
        `/notifikasi/tolak/id/${id}`,
        data,
        config
      );
      fetchReport(1);
      toast({
        title: "Berhasil",
        description: "Laporan berhasil proses!",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
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
    initialValues: initValues,
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const formData = new FormData();
      if (reject) {
        const formData = new FormData();
        formData.append("ket_teknisi", values.ket_teknisi);
        for (let i = 0; i < values.gambar.length; i++) {
          formData.append("gambar[]", values.gambar[i]);
        }
      }

      const stats = parseInt(status);
      stats === 5 && !reject ? await fixTech(values) : await btaTech(formData);
      resetForm({});
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
    values,
    submitForm,
    setFieldValue,
  } = formik;

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
          <FormControl
            id="ket_teknisi"
            pt="5"
            isInvalid={Boolean(touched.ket_teknisi && errors.ket_teknisi)}
          >
            <FormLabel textTransform="capitalize">Keterangan Teknisi</FormLabel>
            <Textarea
              type="text"
              name="ket_teknisi"
              {...getFieldProps("ket_teknisi")}
              onBlur={handleBlur}
              rows="5"
            />
            <FormErrorMessage>
              {touched.ket_teknisi && errors.ket_teknisi}
            </FormErrorMessage>
          </FormControl>
          {reject ? (
            <>
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
            </>
          ) : null}
          <Box display="flex" justifyContent="end">
            {reject ? null : (
              <Button
                colorScheme="red"
                isLoading={isSubmitting}
                mt="5"
                mx="3"
                onClick={() => {
                  setReject(true);
                }}
              >
                Tolak
              </Button>
            )}
            {reject ? (
              <>
                <Button
                  colorScheme="orange"
                  isLoading={isSubmitting}
                  mt="5"
                  onClick={() => {
                    setReject(!reject);
                  }}
                >
                  Batal
                </Button>
                <Button
                  colorScheme="red"
                  isLoading={isSubmitting}
                  mt="5"
                  mx="3"
                  onClick={() => {
                    setStatus(7);
                    submitForm();
                  }}
                >
                  Tolak
                </Button>
              </>
            ) : null}
            {reject ? null : (
              <Button
                colorScheme="yellow"
                isLoading={isSubmitting}
                mt="5"
                onClick={() => {
                  setStatus(5);
                  submitForm();
                }}
              >
                Perbaikan
              </Button>
            )}
          </Box>
        </Form>
      </FormikProvider>
    </Box>
  );
};

export const TahapSetelahPerbaikan = ({ id, fetchReport }) => {
  const toast = useToast();
  const router = useRouter();
  const [preview, setPreview] = useState([]);
  const Schema = Yup.object().shape({
    ket_teknisi: Yup.string().required("Input tidak boleh kosong"),
    gambar: Yup.string().required("File tidak boleh kosong"),
  });

  const finishTech = async (data) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const result = await instance.post(
        `/notifikasi/finish/id/${id}`,
        data,
        config
      );
      fetchReport(1);
      toast({
        title: "Berhasil",
        description: "Laporan berhasil proses!",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Gagal",
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

  const gambarRef = useRef();

  const handleReset = () => {
    gambarRef.current.value = null; //THIS RESETS THE FILE FIELD
  };

  const formik = useFormik({
    initialValues: {
      ket_teknisi: "",
      gambar: "",
    },
    validationSchema: Schema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      const formData = new FormData();
      formData.append("ket_teknisi", values.ket_teknisi);
      for (let i = 0; i < values.gambar.length; i++) {
        formData.append("gambar[]", values.gambar[i]);
      }
      finishTech(formData);
      setSubmitting(false);
      handleReset();
      setPreview([]);
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
    values,
    submitForm,
    setFieldValue,
  } = formik;

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
          <FormControl
            id="ket_teknisi"
            pt="5"
            isInvalid={Boolean(touched.ket_teknisi && errors.ket_teknisi)}
          >
            <FormLabel textTransform="capitalize">Keterangan Teknisi</FormLabel>
            <Textarea
              type="text"
              name="ket_teknisi"
              {...getFieldProps("ket_teknisi")}
              onBlur={handleBlur}
              rows="5"
            />
            <FormErrorMessage>
              {touched.ket_teknisi && errors.ket_teknisi}
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
              colorScheme="green"
              isLoading={isSubmitting}
              mt="5"
              type="submit"
            >
              Selesai
            </Button>
          </Box>
        </Form>
      </FormikProvider>
    </Box>
  );
};
