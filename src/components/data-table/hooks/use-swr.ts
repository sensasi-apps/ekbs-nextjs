import type { SWRConfiguration } from 'swr'
import useSWRVendor from 'swr'
import type { DataTableProps } from '@/components/data-table/types/data-table-props'
import type YajraDatatable from '@/types/yajra-data-table-response'

export default function useSwr<T>(
    apiUrl: DataTableProps['apiUrl'],
    apiUrlParams: DataTableProps['apiUrlParams'] | undefined,
    swrOptions: DataTableProps['swrOptions'] | undefined,
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
    swrOptions: DataTableProps['swrOptions'],
): SWRConfiguration {
    const { keepPreviousData = true, ...restSwrOptions } = swrOptions ?? {}
    return {
        keepPreviousData: keepPreviousData,
        ...restSwrOptions,
    }
}
