import express, { Request } from "express";
import * as store_Service  from './services/storeService';
export interface CustomHeaders {
    authorization?: string;
  }

export const checkAuthorizationHeader = (context: { req: Request<{}, {}, {}, CustomHeaders> }) => {
  const authorizationHeader = context.req.headers.authorization;

  if (!authorizationHeader) {
    throw new Error("Authorization header is missing.");
  }else{
    return true
  }
};


 export const getStoreM = async (
    args: { id: number },
    context: { req: express.Request }
  ) => {
    if (checkAuthorizationHeader(context)) {
      const authorizationHeader = context.req.headers.authorization;
      if (authorizationHeader !== undefined) {
        return await store_Service.getStore(args, authorizationHeader);
      } else {
        throw new Error("Authorization header is missing.");
      }
    }
  };

