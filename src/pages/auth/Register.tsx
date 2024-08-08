import { Button, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues } from "formik"
import React, { useState } from "react"
import * as Yup from "yup"
import { useAppDispatch } from "../../redux/hook";
import { registerUser } from "../../redux/auth/auth.action";
import { Link } from "react-router-dom";

const initialValues = { firstName: "", lastName: "", email: "", password: "", gender: "" };
const validationSchema = {
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
};

const Register = () => {
  const [formValue, setFormValue] = useState([]);
  const dispatch = useAppDispatch();
  const handleSubmit = (values: FormikValues) => {
    console.log("handle", values);
    dispatch(registerUser({ data: values }))
  };
  return (
    <div>
      <Formik
        // validationSchema={validationSchema} 
        initialValues={initialValues}
        onSubmit={handleSubmit}>
        <Form className="space-y-5">
          <div>
            <Field as={TextField} name="username" placeholder="Username" type="text" size="small" fullWidth></Field>
            <ErrorMessage name="username" component={"div"} className="text-red-600"></ErrorMessage>
          </div>
          <div>
            <Field as={TextField} name="firstName" placeholder="First name" size="small" type="text" fullWidth></Field>
            <ErrorMessage name="firstName" component={"div"} className="text-red-600"></ErrorMessage>
          </div>
          <div>
            <Field as={TextField} name="lastName" placeholder="Last name" size="small" type="text" fullWidth></Field>
            <ErrorMessage name="lastName" component={"div"} className="text-red-600"></ErrorMessage>
          </div>
          <div>
            <Field as={TextField} name="email" placeholder="Email" size="small" type="email" fullWidth></Field>
            <ErrorMessage name="email" component={"div"} className="text-red-600"></ErrorMessage>
          </div>
          <div>
            <Field as={TextField} name="password" placeholder="Password" size="small" type="password" fullWidth></Field>
            <ErrorMessage name="password" component={"div"} className="text-red-600"></ErrorMessage>
          </div>
          {/* <FormLabel component="legend">Gender</FormLabel> */}
          <Field as={RadioGroup} name="gender" row>
            <FormControlLabel value="false" control={<Radio />} label="Female" />
            <FormControlLabel value="true" control={<Radio />} label="Male" />
            <FormControlLabel value="null" control={<Radio />} label="Other" />
          </Field>
          <Button
            sx={{ padding: ".8rem 0rem", backgroundColor: "red", "&:hover": { backgroundColor: "darkblue" } }}
            fullWidth
            variant="contained"
            color="primary"
            type="submit">Register</Button>
        </Form>
      </Formik>
      <div className="flex gap-x-5 mt-5 items-center">
        <h2 className="">If you already have account?</h2>
        <Link to={"/login"} replace>
          <h2 className="text-blue-500 hover:text-blue-700">Login</h2>
        </Link>
      </div>
    </div>
  )
}

export default Register