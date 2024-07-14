const FormErrorMessage = ({ errorText }) => {
  if (!errorText) return null;

  return <div className="text-red-500 text-xl mt-1">{errorText}</div>;
};

export default FormErrorMessage;
