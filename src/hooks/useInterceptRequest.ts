import { useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToastContext } from "@/stores/toastContext";
import { request } from "@/share/utils/request";
import { API_ENDPOINT } from "@/share/utils/appHelper";

type AuthResponse = {
   data: {
      token: string;
   };
};

const REFRESH_URL = API_ENDPOINT + "/auth/refresh";

export function useRefreshToken() {
   const { update, data: user } = useSession();
   const { setErrorToast } = useToastContext();

   const refresh = async () => {
      try {
         if (!user) throw new Error("No user");

         const response = await axios.post(REFRESH_URL, {
            refresh_token: user.refreshToken,
         });

         const payload = response.data as AuthResponse;

         await update({ token: payload.data.token });

         return payload.data.token;
      } catch (error: any) {
         console.log({ message: error });

         setErrorToast();
      }
   };
   return refresh;
}

export default function useInterceptRequest() {
   const refresh = useRefreshToken();
   const { data: user } = useSession();

   useEffect(() => {
      if (!user) return;
      const requestIntercept = request.interceptors.request.use(
         (config) => {
            // Do something before request is sent
            if (!config.headers["Authorization"]) {
               config.headers["Authorization"] = `Bearer ${user.token}`;
            }

            return config;
         },
         (err) => Promise.reject(err), // Do something with response error
      );

      const responseIntercept = request.interceptors.response.use(
         (response) => response, // Do something with response data

         async (err) => {
            // Do something with response error
            const prevRequest = err?.config;

            if (err?.response?.status === 401 && !prevRequest?.sent) {
               prevRequest.sent = true;
               const newToken = await refresh();
               prevRequest.headers["Authorization"] = `Bearer ${newToken}`;

               return request(prevRequest);
            }
            return Promise.reject(err);
         },
      );

      return () => {
         request.interceptors.request.eject(requestIntercept);
         request.interceptors.response.eject(responseIntercept);
      };
   }, [user, refresh]);

   return request;
}
