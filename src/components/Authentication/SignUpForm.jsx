import React from "reacct"
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";

function SignUpForm() {
  const initialValues = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: null,
    password: '',
    location: ''
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Required'),
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phoneNumber: Yup.string().required('Required'),
    dateOfBirth: Yup.date().nullable().required('Required').transform((value, originalValue) => {
      if (originalValue) {
        const [day, month, year] = originalValue.split('-');
        return new Date(`${year}-${month}-${day}`);
      }
      return null;
    }),
    password: Yup.string().required('Required'),
    location: Yup.string().required('Required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/api/register', values);
      console.log(response);
      resetForm();
    } catch (error) {
      console.log(error.response.data);
    }
    setSubmitting(false);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <Field type="text" name="username" />
            <ErrorMessage name="username" />
          </div>

          <div>
            <label htmlFor="firstName">First Name:</label>
            <Field type="text" name="firstName" />
            <ErrorMessage name="firstName" />
          </div>

          <div>
            <label htmlFor="lastName">Last Name:</label>
            <Field type="text" name="lastName" />
            <ErrorMessage name="lastName" />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" />
          </div>

          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <Field type="text" name="phoneNumber" />
            <ErrorMessage name="phoneNumber" />
          </div>

          <div>
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <DatePicker
              id="dateOfBirth"
              name="dateOfBirth"
              selected={values.dateOfBirth}
              onChange={date => setFieldValue('dateOfBirth', date)}
              onBlur={handleBlur}
              dateFormat="yyyy-MM-dd"
              placeholderText="yyyy-mm-dd"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            {errors.dateOfBirth && touched.dateOfBirth && <div>{errors.dateOfBirth}</div>}
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" />
          </div>

            <button type="submit">Register</button>
          </Form>
        )}
      </Formik>
  );
};

export default SignUpForm;
