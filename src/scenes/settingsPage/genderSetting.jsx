import React from 'react';
import Layout from "../../components/Layout";
import {
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../state";
import { useEffect, useState } from "react";

const GenderSetting = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "None-binary", value: "none-binary" },
    { label: "Other", value: "other" },
  ];

  yup.addMethod(yup.string, "gender", function(){
    return this.matches(/^(male|female|none-binary|other)$/i);
  })

  const editUserSchema = yup.object().shape({
    gender: yup.string().gender().required("Please select your gender"),
  });

  console.log({ gender: user && user.gender });

  const initialValuesEdit = user ? { gender: user.gender } : {};

  const updateGender = async (gender) => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/settings`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gender }),
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
  }, [userId, token]);

  const handleFormSubmit = async (values) => {
    await updateGender(values.gender);
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
                <Select
                  labelId="gender-select-label"
                  id="gender"
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {touched.email && errors.email && <div>{errors.email}</div>}
                <button type="submit">Save Changes</button>
              </form>
            )}
          </Formik>
        ) : (
          <h1>Hi, edit gender loading...</h1>
        )}
      </Box>
    </Layout>
  );
};

export default GenderSetting;
