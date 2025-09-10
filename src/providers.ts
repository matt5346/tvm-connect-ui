import { paramsSerializer } from '@broxus/js-utils'
import { EverWallet, SparXWallet, TvmWalletProviderConfig, VenomWallet } from '@broxus/tvm-connect/lib'

import EverWalletSvg from './icons/EverWallet.svg'
import SparXWalletSvg from './icons/SparXWallet.svg'
import VenomWalletSvg from './icons/VenomWallet.svg'

export type { TvmWalletProviderConfig } from '@broxus/tvm-connect/lib'

export const sparxWallet = (fallbackAttemptsCount?: number): TvmWalletProviderConfig => ({
    connector: new SparXWallet({ fallbackAttempts: fallbackAttemptsCount ?? 1 }),
    id: 'SparXWallet',
    info: {
        description: 'Your universal tool for TVM',
        icon: SparXWalletSvg,
        links: {
            android: 'https://play.google.com/store/apps/details?id=com.broxus.sparx.app',
            homepage: 'https://sparxwallet.com/',
            chromeExtension: 'https://chrome.google.com/webstore/detail/sparx-wallet/aijecocmefcagpmbpjcfjjbcclfmobgf',
            ios: 'https://apps.apple.com/us/app/sparx-tvm-wallet/id6670219321',
            universalLink: useUniversalLink('https://l.sparxwallet.com', {
                apn: 'com.broxus.sparx.app',
                ibi: 'app.sparx.broxus.com',
                isi: '6670219321',
            }),
        },
        name: 'SparX Wallet',
    },
})

export const everWallet = (fallbackAttemptsCount?: number): TvmWalletProviderConfig => ({
    connector: new EverWallet({ fallbackAttempts: fallbackAttemptsCount ?? 1 }),
    id: 'EverWallet',
    info: {
        description: 'Premier wallet for the Everscale',
        icon: EverWalletSvg,
        links: {
            android: 'https://play.google.com/store/apps/details?id=com.broxus.crystal.app',
            chromeExtension: 'https://chrome.google.com/webstore/detail/ever-wallet/cgeeodpfagjceefieflmdfphplkenlfk',
            firefoxExtension: 'https://addons.mozilla.org/en-GB/firefox/addon/ever-wallet/',
            homepage: 'https://everwallet.net/',
            ios: 'https://apps.apple.com/us/app/ever-wallet-everscale/id1581310780',
        },
        name: 'Ever Wallet',
    },
})

export const venomWallet = (fallbackAttemptsCount?: number): TvmWalletProviderConfig => ({
    connector: new VenomWallet({ fallbackAttempts: fallbackAttemptsCount ?? 1 }),
    id: 'VenomWallet',
    info: {
        description: 'Safe, reliable, and 100% yours',
        icon: VenomWalletSvg,
        links: {
            android: 'https://play.google.com/store/apps/details?id=com.venom.wallet',
            chromeExtension: 'https://chrome.google.com/webstore/detail/venom-wallet/ojggmchlghnjlapmfbnjholfjkiidbch',
            homepage: 'https://venomwallet.com/',
            ios: 'https://apps.apple.com/app/venom-blockchain-wallet/id1622970889',
            universalLink: useUniversalLink('https://venomwallet.page.link', {
                apn: 'com.venom.wallet',
                ibi: 'foundation.venom.wallet',
                isi: '1622970889',
            }),
        },
        name: 'Venom Wallet',
    },
})

function useUniversalLink(
    basePath: string,
    params: {
        apn: string
        ibi: string
        isi: string
        link?: string
    },
): string {
    return [
        basePath,
        paramsSerializer({
            apn: params.apn,
            ibi: params.ibi,
            isi: params.isi,
            link: params.link || encodeURIComponent(window.location.href),
        }),
    ].join('?')
}
