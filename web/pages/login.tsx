import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

interface loginProps {

}

interface formValues {
  username: string,
  password: string
}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [{}, login] = useLoginMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{username: '', password: ''}}
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
            <InputField label={'Username'} id={'username'} name={'username'}/>
            <InputField label={'Password'} id={'password'} name={'password'} type={'password'}/>
            <button
              className={`group bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? `submitting` : ''}`}
              type="submit">
              Login
            </button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;