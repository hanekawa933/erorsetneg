import { useState, useEffect, useRef, useContext } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { TempContext } from "../context/TempContext";
import instance from "../axios.default";
import { useRouter } from "next/router";
import Link from "next/link";

const FormUserReport = ({ id, fetchReport }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [settings, setSettings] = useContext(TempContext);
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);

  const toast = useToast();
  const [preview, setPreview] = useState([]);

  const Schema = Yup.object().shape({
    jenis_kerusakan: Yup.string().required("Input tidak boleh kosong"),
    lokasi: Yup.string().required("Input tidak boleh kosong"),
    keterangan: Yup.string().required(),
    kategori_id: Yup.number().required("Input tidak boleh kosong"),
    gambar: Yup.array().nullable(),
    // .required("File tidak boleh kosong")
  });

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/profile");
      setSettings({ ...settings, userLogin: result.data.data });
      setUser(result.data.data);

      setLoad(true);
    } catch (error) {
      alert("TEST");
      console.log(error.response);
    }
  };

  const createReport = async (data) => {
    // const body = JSON.stringify(data);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const result = await instance.post("/laporan/user", data, config);
      fetchReport(1);
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

  useEffect(() => {
    fetchUserLogin();
  }, []);

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
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const formData = new FormData();
      formData.append("jenis_kerusakan", values.jenis_kerusakan);
      formData.append("lokasi", values.lokasi);
      formData.append("keterangan", values.keterangan);
      for (let i = 0; i < values.gambar.length; i++) {
        formData.append("gambar[]", values.gambar[i]);
      }
      formData.append("kategori_id", values.kategori_id);
      await createReport(formData);
      resetForm({});
      handleReset();
      setPreview([]);
    },
    enableReinitialize: true,
  });

  const showToast = () => {
    toast({
      title: "Gagal",
      description: "Profile anda belum lengkap",
      status: "error",
      duration: 2000,
      position: "top",
    });
  };

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    handleBlur,
    setFieldValue,
    values,
    submitForm,
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
          isDisabled={
            !user.jenis_kelamin && !user.no_telp && !user.jabatan ? true : false
          }
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

  const modalAlert = (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Peringatan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box textAlign="center" fontWeight="700">
            Ooops... mohon maaf, profil anda tidak lengkap.
          </Box>
          <Box
            as="object"
            type="image/svg+xml"
            data="/assets/svg/locked.svg"
            maxW="100%"
            height="96"
          ></Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Tutup
          </Button>
          <Link href="/profile" passHref>
            <Button colorScheme="orange">Lengkapi Data Diri</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  if (load) {
    if (parseInt(user.role_id) === 1) {
      if (!user.jenis_kelamin || !user.no_telp || !user.jabatan) {
        if (!open) {
          onOpen();
          setOpen(true);
        }
      }
    }
  }

  console.log(!user.jenis_kelamin);

  return (
    <Box mt="5">
      {modalAlert}
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
              isDisabled={
                !user.jenis_kelamin && !user.no_telp && !user.jabatan
                  ? true
                  : false
              }
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
              isDisabled={
                !user.jenis_kelamin && !user.no_telp && !user.jabatan
                  ? true
                  : false
              }
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
                <Box key={index} height="80">
                  <Image src={url} alt="..." width="100%" height="100%" />
                </Box>
              ))}
            </Grid>
          </Box>
          <Box display="flex" justifyContent="end">
            <Button
              colorScheme="orange"
              isLoading={isSubmitting}
              mt="5"
              // isDisabled={
              //   !user.jenis_kelamin && !user.no_telp && !user.jabatan
              //     ? true
              //     : false
              // }
              onClick={() =>
                !user.jenis_kelamin && !user.no_telp && !user.jabatan
                  ? showToast()
                  : submitForm()
              }
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
