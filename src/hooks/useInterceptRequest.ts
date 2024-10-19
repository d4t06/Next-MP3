"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { API_ENDPOINT } from "@/share/utils/appHelper";

const CLIENT_TOKEN_EXPIRE = 10;

const request = axios.create({
   baseURL: API_ENDPOINT,
   headers: { "Content-Type": "application/json" },
});

const useInterceptRequest = () => {
   // hooks
   const { data: session, update } = useSession();

   useEffect(() => {
      if (!session || !session.token) return;
      const requestIntercept = request.interceptors.request.use(
         (config) => {
            // Do something before request is sent
            if (!config.headers["Authorization"]) {
               config.headers["Authorization"] = `Bearer ${session.token}`;
            }

            return config;
         },
         (err) => Promise.reject(err) // Do something with response error
      );

      const responseIntercept = request.interceptors.response.use(
         (response) => response, // Do something with response data

         async (err) => {
            try {
               const prevRequest = err?.config;

               if (err?.response?.status === 401 && !prevRequest.sent) {
                  console.log(">>> refresh token");
                  prevRequest.sent = true;
                  const payload = await axios.post(
                     API_ENDPOINT + "/auth/refresh",
                     { refresh_token: session.refreshToken }
                  );

                  if (!payload.data.data.token) return Promise.reject(err);

                  prevRequest.headers[
                     "Authorization"
                  ] = `Bearer ${payload.data.data.token}`;

                  await update({
                     token: payload.data.data.token,
                     tokenExpired: Date.now() + CLIENT_TOKEN_EXPIRE * 1000,
                  });

                  return request(prevRequest);
               }
            } catch (error) {
               console.log(">>> refresh token error");
               await update({ error: "RefreshAccessTokenError" });
            }

            return Promise.reject(err);
         }
      );

      return () => {
         request.interceptors.request.eject(requestIntercept);
         request.interceptors.response.eject(responseIntercept);
      };
   }, [session]);

   return request;
};

export default useInterceptRequest;
