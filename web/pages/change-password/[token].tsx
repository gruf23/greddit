import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useLoginMutation } from '../../generated/graphql';
import Wrapper from '../../components/Wrapper';
import { Form, Formik, FormikHelpers } from 'formik';
import { toErrorMap } from '../../utils/toErrorMap';
import InputField from '../../components/InputField';
import React from 'react';

interface formValues {
  newPassword: string
}

const ChangePassword: NextPage<{ token: string }> = ({token}) => {
  const router = useRouter();
  const [{}, login] = useLoginMutation();
  return (
    <Wrapper variant={'small'}>
      <Formik
        initialValues={{newPassword: ''}}
        onSubmit={async (
          values: formValues,
          {setErrors}: FormikHelpers<formValues>
        ) => {
          // const response = await login(values);
          // if (response.data?.login.errors) {
          //   setErrors(toErrorMap(response.data.login.errors));
          // } else if (response.data?.login.user) {
          //   await router.push('/');
          // }
        }}
      >
        {({
            errors,
            isSubmitting
          }) => (
          <Form className="bg-white shadow-md card py-8 px-4">
            <InputField label={'New password'} id={'newPassword'} name={'newPassword'} type={'password'}/>
            <button
              className={`group bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? `submitting` : ''}`}
              type="submit">
              Change password
            </button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = async ({query}) => {
  return {
    token: query.token as string
  };
};

export default ChangePassword;
