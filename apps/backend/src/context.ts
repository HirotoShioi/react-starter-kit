import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";

export type Variables = {
  jwtPayload: CognitoIdTokenPayload;
};

export type ApplicationContext = {
  Variables: Variables;
};