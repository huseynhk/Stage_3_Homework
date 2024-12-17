import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  PDFDownloadLink,
  Page,
  Text,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const validateEmail = (value) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!value) {
    return "Email is required!";
  }
  if (!emailRegex.test(value)) {
    return "Invalid email address!";
  }
  return null;
};

const validatePhone = (value) => {
  const phoneRegex = /^(\+994|0)(50|51|55|70|77|99)([0-9]{7})$/;
  if (!value) {
    return "Phone number is required!";
  }
  if (!phoneRegex.test(value)) {
    return "Invalid phone number. Use format +994(50|51|55|70|77|99)XXXXXXX or 0(50|51|55|70|77|99)XXXXXXX";
  }
  return null;
};

const validateName = (value) => {
  if (!value) {
    return "This field is required!";
  }
  if (value.length < 5 || value.length > 20) {
    return "Name must be between 5 and 20 characters!";
  }
  return null;
};

const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 14, marginBottom: 4 },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

function Home() {
  const [cvList, setCvList] = useState(() => {
    const savedCvs = JSON.parse(localStorage.getItem("cvs"));
    return savedCvs || [];
  });
  const [selectedCv, setSelectedCv] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cvToDelete, setCvToDelete] = useState(null);

  const handleRowClick = (cv) => {
    setSelectedCv(cv);
  };

  const handleDelete = (cvToDelete) => {
    setCvToDelete(cvToDelete);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const updatedCvList = cvList.filter((cv) => cv !== cvToDelete);
    setCvList(updatedCvList);
    localStorage.setItem("cvs", JSON.stringify(updatedCvList));
    setIsDeleteModalOpen(false);
    setCvToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCvToDelete(null);
  };

  const MyDocument = ({ cvData }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        {cvData.image ? (
          <Image src={cvData.image} style={styles.image} />
        ) : (
          <Image
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
            style={styles.image}
          />
        )}
        <Text style={styles.title}>{cvData.fullName || "Your Name"}</Text>
        <Text style={styles.text}>
          Email: {cvData.email || "your-email@example.com"}
        </Text>
        <Text style={styles.text}>
          Phone: {cvData.phone || "+994 55 555 55 55"}
        </Text>
        <Text style={styles.text}>Experience:</Text>
        <Text style={styles.text}>
          {cvData.experience || "Describe your experience..."}
        </Text>
      </Page>
    </Document>
  );

  return (
    <div className="myBg flex flex-col items-center md:justify-between py-6 px-6 md:px-16 min-h-screen">
      <div className="w-full flex flex-col md:flex-row gap-6 md:gap-20 items-center">
        <div className="w-full md:w-7/12 bg-gray-50 p-4 shadow-md rounded-md h-[72vh]">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">CV Form</h2>

          <Formik
            initialValues={{
              fullName: "",
              email: "",
              phone: "",
              image: "",
              experience: "",
            }}
            validate={(values) => {
              const errors = {};
              errors.fullName = validateName(values.fullName);
              errors.email = validateEmail(values.email);
              errors.phone = validatePhone(values.phone);
              if (!values.image) {
                errors.image = "Image is required!";
              }
              if (!values.experience)
                errors.experience = "Experience is required!";
              return Object.fromEntries(
                Object.entries(errors).filter(([_, v]) => v)
              );
            }}
            onSubmit={(values, { resetForm }) => {
              const newCvList = [...cvList, values];
              setCvList(newCvList);
              localStorage.setItem("cvs", JSON.stringify(newCvList));
              setSelectedCv(values);
              resetForm();
            }}
          >
            {() => (
              <Form className="space-y-7">
                <div className="relative">
                  <Field
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className="w-full border p-2 rounded"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-sm absolute top-10"
                  />
                </div>

                <div className="relative">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm absolute top-10"
                  />
                </div>

                <div className="relative">
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    className="w-full border p-2 rounded"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm absolute top-10"
                  />
                </div>

                <div className="relative">
                  <Field
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    className="w-full border p-2 rounded"
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500 text-sm absolute top-10"
                  />
                </div>

                <div className="relative">
                  <Field
                    as="textarea"
                    name="experience"
                    placeholder="Experience"
                    className="w-full border p-2 rounded h-24 resize-none"
                  />
                  <ErrorMessage
                    name="experience"
                    component="div"
                    className="text-red-500 text-sm absolute top-24"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="w-full md:w-4/12 p-4 shadow-md rounded-md bg-blue-50 h-[65vh] relative">
          {selectedCv ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
                    {selectedCv.fullName || "Your Name"}
                  </h2>
                  <p className="text-gray-600">
                    Email: {selectedCv.email || "your-email@example.com"}
                  </p>
                  <p className="text-gray-600">
                    Phone: {selectedCv.phone || "+994 55 555 55 55"}
                  </p>
                </div>
                {selectedCv.image && (
                  <img
                    className="w-24 h-24  md:w-28 md:h-28  object-cover rounded-xl"
                    src={selectedCv.image}
                    alt="Profile"
                  />
                )}
              </div>
              <p className="mt-4 text-gray-700 font-medium">Experience:</p>
              <div className="text-gray-600 max-h-[50%] md:max-h-[55%]  overflow-y-auto p-2 rounded-md custom-scrollbar">
                {selectedCv.experience || "Describe your experience..."}
              </div>

              <PDFDownloadLink
                document={<MyDocument cvData={selectedCv} />}
                fileName="my-cv.pdf"
              >
                <button className="px-4 py-2 absolute top-[89%] bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition">
                  Download CV
                </button>
              </PDFDownloadLink>
            </>
          ) : (
            <p className="text-gray-600 text-center mt-20">
              Submit the form to preview your CV here.
            </p>
          )}
        </div>
      </div>
      {cvList?.length > 0 && (
        <div className="overflow-x-auto w-full md:w-10/12 mt-4 rounded-xl">
          <table className="min-w-full table-auto border-collapse bg-slate-100 ">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cvList.map((cv, index) => (
                <tr key={index} className="cursor-pointer hover:bg-gray-100">
                  <td className="border p-2">{cv.fullName}</td>
                  <td className="border p-2">{cv.email}</td>
                  <td className="border p-2">{cv.phone}</td>
                  <td className="border p-2">
                    <img
                      src={cv.image}
                      alt="Profile"
                      className="w-10 h-10 object-cover rounded-lg mx-auto"
                    />
                  </td>

                  <td className="border p-2 flex gap-3 justify-center">
                    <button
                      onClick={() => handleRowClick(cv)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                      Show CV
                    </button>
                    <button
                      onClick={() => handleDelete(cv)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                    >
                      Delete CV
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={cancelDelete}
        className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex justify-center items-center"
      >
        <Dialog.Panel className="bg-white p-6 rounded-lg w-96">
          <Dialog.Title className="text-xl font-semibold">
            Confirm Delete
          </Dialog.Title>
          <Dialog.Description className="mt-2">
            Are you sure you want to delete this CV?
          </Dialog.Description>
          <div className="mt-4 flex justify-end">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

export default Home;
