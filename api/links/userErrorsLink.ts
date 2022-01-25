import {ApolloLink} from "@apollo/client";
import {ErrorCodes, ErrorCodesUa} from "../../models/models";
import {langVar} from "../localClient";

const userErrorsLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((data: any) => {
    const userErrors = data?.data[operation.operationName]?.userErrors;

    if (userErrors && userErrors.length) {
      const errorCodes = Object.keys(ErrorCodes);
      const errorCode = userErrors[0]?.code;
      const errorMessageLocale = userErrors[0]?.messageLocale;

      if (errorCodes.includes(errorCode)) {
        throw new Error(ErrorCodesUa[errorCode as ErrorCodes]);
      } else if (errorMessageLocale) {
        if (errorMessageLocale[langVar()]) {
          throw new Error(errorMessageLocale[langVar()]);
        } else if (errorMessageLocale.EN) {
          throw new Error(errorMessageLocale.EN);
        }
      } else {
        throw new Error('Сталася помилка!');
      }
    }
    return data;
  });
});

export default userErrorsLink;
