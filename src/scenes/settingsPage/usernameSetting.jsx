import React from 'react';
import Layout from "../../components/Layout";
import { Box } from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../state";
import { useEffect, useState } from "react";

const UsernameSetting = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const editUserSchema = yup.object().shape({
    username: yup.string().required("update your username"),
  });

  const initialValuesEdit = {
    username: user.username || "",
  };

 const updateUser = async(username)=> {
    const response = await fetch(
      `http://localhost:3001/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username})
      },
    );

    const data = await response.json();
    dispatch(setUserDetails({userDetails: data}));
    navigate("/");
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
    await updateUser(values);
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
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.username && errors.username && (
                  <div>{errors.username}</div>
                )}
                <button type="submit">Save Changes</button>
              </form>
            )}
          </Formik>
        ) : (
          <h1>Hi, edit userpage loading...</h1>
        )}
      </Box>
    </Layout>
  );
};

export default UsernameSetting;
