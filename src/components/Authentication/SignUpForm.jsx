import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";

function SignUpForm() {
  const initialValues = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
    location: "",
    avatar: "",
  };

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    gender: Yup.string().required("Gender is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    dateOfBirth: Yup.date()
      .max(moment().format("YYYY-MM-DD"), "Date of birth cannot be in the future")
      .required("Date of Birth is required"),
    avatar: Yup.mixed().required("Avatar is definitely required"),
  });

  const uploadAvatar = async (values, { resetForm }) => {
    try {
      const avatarFile = values.avatar;
      if (!avatarFile) {
        throw new Error("Avatar file not found");
      }

      const s3 = new AWS.S3({
        secretAccessKey: "YOUR_AWS_SECRET_ACCESS_KEY",
        accessKeyId: "YOUR_AWS_ACCESS_KEY_ID",
        region: "YOUR_AWS_REGION",
      });

      const fileName = `${Date.now()}-${avatarFile.name}`;
      const params = {
        Bucket: "YOUR_AWS_BUCKET_NAME",
        Key: fileName,
        ACL: "public-read",
        Body: avatarFile,
      };

      const uploadResult = await s3.upload(params).promise();
      const avatarURL = uploadResult.Location;

      const formData = {
        ...values,
        avatar: avatarURL,
      };

      const response = await axios.post(
        "http://localhost:3001/auth/register",
        formData
      );

      console.log("Response:", response.data); // Check the response received from the server

      resetForm();
      navigate("/home");
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={uploadAvatar}
    >
      <Form encType="multipart/form-data">
        <div>
          <label htmlFor="username">Username:</label>
          <Field type="text" name="username" />
          <ErrorMessage name="username" component="div" />
        </div>

        <div>
          <label htmlFor="firstName">First Name:</label>
          <Field type="text" name="firstName" />
          <ErrorMessage name="firstName" component="div" />
        </div>

        <div>
          <label htmlFor="lastName">Last Name:</label>
          <Field type="text" name="lastName" />
          <ErrorMessage name="lastName" component="div" />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <Field type="email" name="email" />
          <ErrorMessage name="email" component="div" />
        </div>

        <div>
          <label htmlFor="gender">Gender:</label>
          <Field as="select" name="gender" id="gender">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Field>
          <ErrorMessage name="gender" component="div" />
        </div>

        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <Field type="text" name="phoneNumber" />
          <ErrorMessage name="phoneNumber" component="div" />
        </div>

        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <Field type="date" name="dateOfBirth" />
          <ErrorMessage name="dateOfBirth" component="div" />
        </div>

        <div>
          <label htmlFor="avatar">Upload your image:</label>
          <Field type="file" name="avatar" />
          <ErrorMessage name="avatar" component="div" />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <Field type="password" name="password" />
          <ErrorMessage name="password" component="div" />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Register"}
        </button>
      </Form>
    </Formik>
  );
}

export default SignUpForm;
