import React from 'react';
import Layout from "../../components/Layout";
import { Box } from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../state";
import { useEffect, useState } from "react";

const PhoneSetting = ({userId}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const editUserSchema = yup.object().shape({
    phoneNumber: yup
      .string()
      .matches(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number")
      .required("Required"),
  });

  console.log({ phoneNumber: user && user.phoneNumber });

  const initialValuesEdit = user ? { phoneNumber: user.phoneNumber } : {};

  const updateEmail = async (phoneNumber) => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/settings`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({phoneNumber}),
      }
    );
    const data = await response.json();
    dispatch(setUserDetails({ userDetails: data }));
    navigate("/settings");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (userId) {
      getUser();
    }
  }, [token, userId]);

  const handleFormSubmit = async (values) => {
    await updateEmail(values.phoneNumber);
  };

  return (
    <Layout>
      <div className="settings-container">
        <h2 className="settings-title">Account information</h2>
      </div>
      <Box>
        {user ? (
          <Formik
            initialValues={initialValuesEdit}
            validationSchema={editUserSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <div>{errors.phoneNumber}</div>
                )}
                <button type="submit">Save Changes</button>
              </form>
            )}
          </Formik>
        ) : (
          <h1>Hi, edit phoneNumber loading...</h1>
        )}
      </Box>
    </Layout>
  );
};

export default PhoneSetting;
