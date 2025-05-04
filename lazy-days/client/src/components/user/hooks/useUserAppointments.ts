
import { axiosInstance, getJWTHeader } from "../../../axiosInstance";

import { useLoginData } from "@/auth/AuthContext";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { generateUserAppointmentsKey } from "@/react-query/key-factories";
import { Appointment } from "@shared/types";

// for when we need a query function for useQuery
async function getUserAppointments(
  userId: number,
  userToken: string
): Promise<Appointment[] | null> {
  const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
    headers: getJWTHeader(userToken),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {

  const { userId, userToken } = useLoginData()

  const fallback: Appointment[] = []

  const { data: userAppointments = fallback } = useQuery({
    enabled: !!userId, // return only userId is truthy
    queryKey: generateUserAppointmentsKey(userId, userToken),
    queryFn: () => getUserAppointments(userId, userToken),
    staleTime: Infinity,
  })


  return userAppointments;
}
