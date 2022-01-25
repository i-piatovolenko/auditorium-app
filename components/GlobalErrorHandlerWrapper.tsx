import React, {FC} from 'react';
import {useLocal} from "../hooks/useLocal";
import ErrorDialog from "./ErrorDialog";
import {client} from "../api/client";
import {globalErrorVar} from "../api/localClient";

const GlobalErrorHandlerWrapper: FC = ({children}) => {
  const {data: {globalError}} = useLocal('globalError');

  const resetGlobalError = async () => {
    globalErrorVar(null);
    await client.resetStore();
  };

  return (
    <>
      {children}
      <ErrorDialog visible={!!globalError} hideDialog={resetGlobalError} title='Увага!' message={globalError}/>
    </>
  );
};

export default GlobalErrorHandlerWrapper;
