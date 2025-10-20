'use client'

import Agriculture from '@mui/icons-material/Agriculture'
import BikeScooter from '@mui/icons-material/BikeScooter'
import CurrencyExchange from '@mui/icons-material/CurrencyExchange'
import Forest from '@mui/icons-material/Forest'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import Warehouse from '@mui/icons-material/Warehouse'
import Alert from '@mui/material/Alert'
import useSWR from 'swr'
import Role from '@/enums/role'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
import type ParticipationApiResponseType from './api-response-type'
import Section from './section'

/**
 * Page component that displays user participation based on their roles.
 * Participation mean the user's activities in the cooperative's business units.
 */
export default function PageClient() {
    const isUserHasRole = useIsAuthHasRole()

    const {
        data: {
            farmInputs,
            palmBunchesDelivery,
            palmBunches,
            repairShop,
            mart,
            heavyEquipmentRent,
            userLoan,
        } = {},
    } = useSWR<ParticipationApiResponseType>(
        isUserHasRole(Role.MEMBER) ? 'me/participations' : null,
    )

    if (!isUserHasRole(Role.MEMBER)) {
        return (
            <Alert severity="error">
                Halaman ini hanya dapat diakses oleh anggota.
            </Alert>
        )
    }

    return (
        <>
            {isUserHasRole(Role.FARMER) && (
                <Section
                    data={palmBunches}
                    detailHref="/palm-bunches/rea-tickets"
                    iconTitle={<Forest />}
                    title="TBS — Jual"
                />
            )}

            {isUserHasRole(Role.COURIER) && (
                <Section
                    data={palmBunchesDelivery}
                    detailHref="/palm-bunches/rea-tickets"
                    iconTitle={<Forest />}
                    title="TBS — Angkut"
                />
            )}

            <Section
                data={farmInputs}
                detailHref="/farm-inputs/my-purchases"
                iconTitle={<Warehouse />}
                title="SAPRODI"
            />

            <Section
                data={heavyEquipmentRent}
                iconTitle={<Agriculture />}
                title="Alat Berat"
            />

            <Section
                data={userLoan}
                iconTitle={<CurrencyExchange />}
                title="Simpan Pinjam"
            />

            <Section
                data={mart}
                iconTitle={<ShoppingCart />}
                title="Belayan Mart"
            />

            <Section
                data={repairShop}
                iconTitle={<BikeScooter />}
                title="Belayan Spare Parts"
            />
        </>
    )
}
