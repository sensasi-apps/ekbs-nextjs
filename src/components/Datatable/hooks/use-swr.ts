import type { SWRConfiguration } from 'swr'
import useSWRVendor from 'swr'
import type YajraDatatable from '@/types/yajra-datatable-response'
import type { DatatableProps } from '../@types'

export default function useSwr<T>(
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
