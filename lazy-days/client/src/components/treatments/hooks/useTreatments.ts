import { Loading } from '@/components/app/Loading';
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Treatment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { Divider } from '@chakra-ui/react';
import { ImHome3 } from 'react-icons/im';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {

  const fallback: Treatment[] = []

  // TODO: get data from server via useQuery
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
    staleTime: 600000, //10 minutes (suppress refetching)
    gcTime: 900000, //15 minutes (doesnt make sense for staleTime to exceed gcTime)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return data;
}


export function usePrefetchTreatments(): void {

  const queryClient = useQueryClient()

  queryClient.prefetchQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
    staleTime: 600000, //10 minutes (suppress refetching)
    gcTime: 900000, //15 minutes (how long to keep data in cache)
  })

}