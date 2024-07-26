import { Button, TextField } from "@mui/material";
import { ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues } from "formik"
import React, { useState } from "react"
import { useDispatch } from "react-redux";
import * as Yup from "yup"
import { loginUser } from "../../redux/auth/auth.action";
import { useAppDispatch } from "../../redux/hook";
import { Link } from "react-router-dom";

const initialValues = { email: "", password: "" };
const validationSchema = {
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
};

const Login = () => {
  const [formValue, setFormValue] = useState([]);
  const dispatch = useAppDispatch();
  const handleSubmit = (values: FormikValues) => {
    console.log("handle", values);
    dispatch(loginUser({data: values}))
  };
  return (
    <div>
      <Formik 
        // validationSchema={validationSchema} 
        initialValues={initialValues} 
        onSubmit={handleSubmit}>
        <Form className="space-y-5">
          <div className="space-y-5">
            <div>
              <Field as={TextField} name="email" placeholder="Email" type="email" fullWidth></Field>
              <ErrorMessage name="email" component={"div"} className="text-red-600"></ErrorMessage>
            </div>
            <div>
              <Field as={TextField} name="password" placeholder="Password" type="password" fullWidth></Field>
              <ErrorMessage name="password" component={"div"} className="text-red-600"></ErrorMessage>
            </div>
          </div>
          <Button 
            sx={{padding: ".8rem 0rem", backgroundColor: "red", "&:hover": { backgroundColor: "darkblue" }}} 
            fullWidth 
            variant="contained"
            color="primary"
            type="submit">Login</Button>
        </Form>
      </Formik>
      <div className="flex gap-5 mt-5 items-center">
        <h2 className="">If you don't have account?</h2>
        <Link to={"/register"}>
          <h2 className="text-blue-500 hover:text-blue-700">Register</h2>
        </Link>
      </div>
    </div>
  )
}

export default Login