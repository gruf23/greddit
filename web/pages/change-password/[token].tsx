import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useChangePasswordMutation, useLoginMutation } from '../../generated/graphql';
import Wrapper from '../../components/Wrapper';
import { Form, Formik, FormikHelpers } from 'formik';
import { toErrorMap } from '../../utils/toErrorMap';
import InputField from '../../components/InputField';
import React, { useState } from 'react';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { NextUrqlClientConfig, withUrqlClient } from 'next-urql';
import Link from 'next/link';

interface formValues {
  newPassword: string;
}

const ChangePassword: NextPage<{ token: string }> = ({token}) => {
  const router = useRouter();
  const [{}, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  return (
    <Wrapper variant={'small'}>
      <Formik
        initialValues={{newPassword: ''}}
        onSubmit={async (
          values: formValues,
          {setErrors}: FormikHelpers<formValues>
        ) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else {
            await router.push('/');
          }
        }}
      >
        {({
            errors,
            isSubmitting
          }) => (
          <Form className="bg-white shadow-md card py-8 px-4">
            <InputField label={'New password'} id={'newPassword'} name={'newPassword'} type={'password'}/>
            {tokenError && (
              <>
              <span className={"block text-red-500 text-sm"}>{tokenError}</span>
                <Link href={'/forgot-password'}><a>Forget it again</a></Link>
              </>
            )}
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

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig, {ssr: false})(ChangePassword);
