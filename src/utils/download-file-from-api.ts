import { enqueueSnackbar } from 'notistack'
import axios from '@/lib/axios'

/**
 * Download file from API endpoint
 * @param url - API endpoint URL
 * @param defaultFilename - Default filename if Content-Disposition header is not available
 * @returns Promise<void>
 */
export async function downloadFileFromApi(
    url: string,
    defaultFilename = 'download.zip',
): Promise<void> {
    try {
        const response = await axios.get(url, {
            responseType: 'blob',
        })

        // Get filename from Content-Disposition header
        const contentDisposition = response.headers['content-disposition']
        let filename = defaultFilename

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(
                /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
            )
            if (filenameMatch?.[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '')
            }
        }

        // Create blob URL and trigger download
        const blob = new Blob([response.data])
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)

        enqueueSnackbar('File berhasil diunduh', {
            variant: 'success',
        })
    } catch (error) {
        enqueueSnackbar('Gagal mengunduh file', {
            variant: 'error',
        })
        throw error
    }
}
