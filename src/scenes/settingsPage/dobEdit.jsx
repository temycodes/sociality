import React from 'react';
import Layout from "../../components/Layout";
import { Box } from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../state";
import { useEffect, useState } from "react";
import moment from "moment";

const DOBSetting = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const editUserSchema = yup.object().shape({
    dateOfBirth: yup
      .date()
      .max(moment(), "Date of birth cannot be in the future")
      .required("Date of birth is required"),
  });

  console.log({ "date of birth": user.dateOfBirth });

  const initialValuesEdit = user ? { dateOfBirth: new Date(user.dateOfBirth) } : {};

  const updateDOB = async (dateOfBirth) => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/settings`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateOfBirth: dateOfBirth.toISOString() }),
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
    await updateDOB(values.dateOfBirth);
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
                <DatePicker
                  value={values.dateOfBirth}
                  onChange={(date) => {
                    handleChange({ target: { name: "dateOfBirth", value: date } });
                  }}
                  onBlur={handleBlur}
                />
                {touched.dateOfBirth && errors.dateOfBirth && (
                  <div>{errors.dateOfBirth}</div>
                )}
                <button type="submit">Save Changes</button>
              </form>
            )}
          </Formik>
        ) : (
          <h1>Hi, edit dateOfBirth loading...</h1>
        )}
      </Box>
    </Layout>
  );
};

export default DOBSetting;
