import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../generated/graphql';
import Wrapper from '../components/Wrapper';
import { Form, Formik, FormikHelpers } from 'formik';
import { toErrorMap } from '../utils/toErrorMap';
import InputField from '../components/InputField';
import { NextUrqlClientConfig, withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface OwnProps {
}

type Props = OwnProps;

interface formValues {
  email: string;
}

const ForgotPassword: React.FC<Props> = (props) => {
  const [complete, setComplete] = useState(false);
  const [{}, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant={'small'}>
      <Formik
        initialValues={{email: ''}}
        onSubmit={async (
          values: formValues
        ) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({
            errors,
            isSubmitting
          }) => (
          <Form className="bg-white shadow-md card py-8 px-4">
            {!complete
              ? (
                <>
                  <InputField label={'Email'} id={'email'} name={'email'}/>
                  <button
                    className={`group bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? `submitting` : ''}`}
                    type="submit">
                    Reset password
                  </button>
                </>
              ) : (
                <p>Check your inbox</p>
              )
            }
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig)(ForgotPassword);
