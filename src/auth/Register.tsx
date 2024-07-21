import { Button, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues } from "formik"
import React, { useState } from "react"
import * as Yup from "yup"

const initialValues = { firstName: "", lastName: "", email: "", password: "", gender: ""};
const validationSchema = {
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
};

const Register = () => {
  const [formValue, setFormValue] = useState([]);
  const handleSubmit = (values: FormikValues) => {
    console.log("handle", values);
  };
  return (
    <div>
      <Formik 
        // validationSchema={validationSchema} 
        initialValues={initialValues} 
        onSubmit={handleSubmit}>
        <Form className="space-y-5">
            <div>
              <Field as={TextField} name="firstName" placeholder="First name" type="text" fullWidth></Field>
              <ErrorMessage name="firstName" component={"div"} className="text-red-600"></ErrorMessage>
            </div>
            <div>
              <Field as={TextField} name="lastName" placeholder="Last name" type="text" fullWidth></Field>
              <ErrorMessage name="lastName" component={"div"} className="text-red-600"></ErrorMessage>
            </div>
            <div>
              <Field as={TextField} name="email" placeholder="Email" type="email" fullWidth></Field>
              <ErrorMessage name="email" component={"div"} className="text-red-600"></ErrorMessage>
            </div>
            <div>
              <Field as={TextField} name="password" placeholder="Password" type="password" fullWidth></Field>
              <ErrorMessage name="password" component={"div"} className="text-red-600"></ErrorMessage>
            </div>
            {/* <FormLabel component="legend">Gender</FormLabel> */}
            <Field as={RadioGroup} name="gender" row>
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </Field>
          <Button 
            sx={{padding: ".8rem 0rem", backgroundColor: "red", "&:hover": { backgroundColor: "darkblue" }}} 
            fullWidth 
            variant="contained"
            color="primary"
            type="submit">Register</Button>
        </Form>
      </Formik>
    </div>
  )
}

export default Register