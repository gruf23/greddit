import React from 'react';
import { Form, Formik, Field, FormikHelpers } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';

interface registerProps {

}

interface formValues {
  username: string,
  password: string
}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper>
      <Formik
        initialValues={{username: '', password: ''}}
        onSubmit={(
          values: formValues,
          {setSubmitting}: FormikHelpers<formValues>
        ) => {
          setTimeout(() => {
            console.log(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 1000);
        }}
      >
        {({
          errors,
          isSubmitting
          }) => (
          <Form className="bg-white shadow-md card py-8 px-4">
            <InputField label={'Username'} id={'username'} name={'username'}/>
            <InputField label={'Password'} id={'password'} name={'password'} type={'password'}/>
            <button
              className={`group bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? `submitting` : ''}`}
              type="submit">
              Register
            </button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
