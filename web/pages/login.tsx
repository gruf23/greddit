import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { createUrqlClient } from '../utils/createUrqlClient';
import { NextUrqlClientConfig, withUrqlClient } from 'next-urql';
import Link from 'next/link';

interface loginProps {

}

interface formValues {
  usernameOrEmail: string,
  password: string
}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [{}, login] = useLoginMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{usernameOrEmail: '', password: ''}}
        onSubmit={async (
          values: formValues,
          {setErrors}: FormikHelpers<formValues>
        ) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            await router.push('/');
          }
        }}
      >
        {({
            errors,
            isSubmitting
          }) => (
          <Form className="bg-white shadow-md card py-8 px-4">
            <InputField label={'Username or Email'} id={'usernameOrEmail'} name={'usernameOrEmail'}/>
            <InputField label={'Password'} id={'password'} name={'password'} type={'password'}/>
            <div className="flex items-center justify-between">
              <button
                className={`group bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? `submitting` : ''}`}
                type="submit">
                Login
              </button>
              <Link href={'/forgot-password'}><a className={'hover:underline'}>Forgot password</a></Link>
            </div>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig)(Login);
