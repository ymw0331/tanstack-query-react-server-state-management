import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { generateUserKey } from "@/react-query/key-factories";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

export function useUser() {
  const queryClient = useQueryClient();

  // get details from useLoginData
  const { userId, userToken } = useLoginData();

  // TODO: call useQuery to update user data from server
  const { data: user } = useQuery({
    enabled: !!userId,
    queryKey: generateUserKey(userId, userToken),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity, // never stale(change), unless gcTime expired
  });


  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // TODO: update the user in the query cache
    queryClient.setQueryData(
      generateUserKey(newUser.id, newUser.token),
      newUser
    );
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
    queryClient.removeQueries({
      queryKey: [queryKeys.user]
    })
  }

  return { user, updateUser, clearUser };
}
