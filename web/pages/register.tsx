import React from 'react';
import { Form, Formik, Field, FormikHelpers } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { NextUrqlClientConfig, withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {

}

interface formValues {
  username: string,
  email: string,
  password: string
}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [{}, register] = useRegisterMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{username: '', password: '', email: ''}}
        onSubmit={async (
          values: formValues,
          {setErrors}: FormikHelpers<formValues>
        ) => {
          const response = await register({options: values});
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            await router.push('/');
          }
        }}
      >
        {({
            errors,
            isSubmitting
          }) => (
          <Form className="bg-white shadow-md card py-8 px-4">
            <InputField label={'Email'} id={'email'} name={'email'}/>
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

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig)(Register);
