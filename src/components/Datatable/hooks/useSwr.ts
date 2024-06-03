import type { SWRConfiguration } from 'swr'
import type YajraDatatable from '@/types/responses/YajraDatatable'
import type { DatatableProps } from '../@types'
import useSWRVendor from 'swr'

export function useSwr<T = object>(
    apiUrl: DatatableProps['apiUrl'],
    apiUrlParams: DatatableProps['apiUrlParams'] | undefined,
    swrOptions: DatatableProps['swrOptions'] | undefined,
    datatableSentRequestParamsJson?: string,
) {
    return useSWRVendor<YajraDatatable<T>>(
        datatableSentRequestParamsJson
            ? [
                  apiUrl,
                  {
                      ...apiUrlParams,
                      ...JSON.parse(datatableSentRequestParamsJson),
                  },
              ]
            : null,
        null,
        constructSwrOpts(swrOptions),
    )
}

function constructSwrOpts(
    swrOptions: DatatableProps['swrOptions'],
): SWRConfiguration {
    const { keepPreviousData = true, ...restSwrOptions } = swrOptions ?? {}
    return {
        keepPreviousData: keepPreviousData,
        ...restSwrOptions,
    }
}
