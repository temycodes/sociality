import React from 'react';
import Layout from "../../components/Layout";
import { Box } from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../state";
import { useEffect, useState } from "react";

const ImgUploadSetting = ({ userId }) => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);
  const token = useSelector((state) => state.token);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const editUserSchema = yup.object().shape({
    picturePath: yup.string().required("required"),
  });

  const initialValuesEdit = user ? { picturePath: user.picturePath } : "";

  const updatePicture = async (picturePath) => {
    const response = await fetch(
      `https://inquisitive-moth-sweater.cyclic.app/users/${userId}/settings`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ picturePath }),
      }
    );
    const data = await response.json();
    dispatch(setUserDetails({ userDetails: data }));
    navigate("/settings");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`https://inquisitive-moth-sweater.cyclic.app/users/${userId}`, {
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

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl, token, userId]);

  const handleFormSubmit = async (values) => {
    try {
      await updatePicture(values.picturePath);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
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
                  type="file"
                  name="picturePath"
                  onChange={(event) => {
                    handleChange(event);
                    handleImageChange(event);
                  }}
                  onBlur={handleBlur}
                />
                <image src={imageUrl} alt="user image" />
                {touched.picturePath && errors.picturePath && (
                  <div>{errors.picturePath}</div>
                )}
                <button type="submit">Save Changes</button>
              </form>
            )}
          </Formik>
        ) : (
          <h1>Hi, edit picturePath loading...</h1>
        )}
      </Box>
    </Layout>
  );
};

export default ImgUploadSetting;
