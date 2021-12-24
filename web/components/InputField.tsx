import React from 'react';
import { Field } from 'formik';

interface OwnProps {
  label?: string,
  id: string,
  name: string,
  placeholder?: string
  type?: string
}

type Props = OwnProps;

const InputField: React.FC<Props> = ({label, ...props}) => {
  return (
    <>
      <Field name={props.name}>
        {({
          field,
          form: {touched, errors},
          meta
          }) => (
            <div className="mb-4">
              {label && (
                <label htmlFor={field.name} className="block mb-2 font-bold text-sm text-gray-700">{label}</label>
              )}
              <input {...field} {...props} className={'shadow appearance-none border rounded w-full py-2 px-3 text-black'}/>
              {meta.touched && meta.error && (
                <span>{meta.error}</span>
              )}
            </div>
        )

        }
      </Field>
    </>
  );
};

export default InputField;
