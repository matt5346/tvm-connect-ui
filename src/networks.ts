import { type AddNetwork } from 'everscale-inpage-provider'

export const everscaleNetwork: AddNetwork = {
    connection: {
        type: 'jrpc',
        data: {
            endpoint: 'https://jrpc.everwallet.net',
        },
    },
    name: 'Everscale',
    networkId: 42,
    config: {
        symbol: 'EVER',
        explorerBaseUrl: 'https://everscan.io',
        tokensManifestUrl: 'https://raw.githubusercontent.com/broxus/ton-assets/master/manifest.json',
    },
}

export const venomNetwork: AddNetwork = {
    connection: {
        type: 'jrpc',
        data: {
            endpoint: 'https://jrpc.venom.foundation',
        },
    },
    name: 'Everscale',
    networkId: 1,
    config: {
        symbol: 'VENOM',
        explorerBaseUrl: 'https://venomscan.com',
        tokensManifestUrl: 'https://cdn.venom.foundation/assets/mainnet/manifest.json',
    },
}

export const hamsterNetwork: AddNetwork = {
    connection: {
        type: 'proto',
        data: {
            endpoint: 'https://rpc.hamster.network',
        },
    },
    name: 'Hamster Network',
    networkId: 7,
    config: {
        explorerBaseUrl: 'http://hamsterscan.io',
        tokensManifestUrl: 'https://raw.githubusercontent.com/broxus/ton-assets/refs/heads/hmstr/manifest.json',
        symbol: 'HMSTR',
    },
}

export const tychoTestnetNetwork: AddNetwork = {
    connection: {
        type: 'proto',
        data: {
            endpoint: 'https://rpc-testnet.tychoprotocol.com/proto',
        },
    },
    name: 'Tycho Testnet',
    networkId: 2000,
    config: {
        explorerBaseUrl: 'https://testnet.tychoprotocol.com',
        tokensManifestUrl: 'https://raw.githubusercontent.com/broxus/ton-assets/refs/heads/tychotestnet/manifest.json',
        symbol: 'TYCHO',
    },
}

export const tonNetwork: AddNetwork = {
    connection: {
        type: 'jrpc',
        data: {
            endpoint: 'https://jrpc-ton.broxus.com',
        },
    },
    name: 'TON',
    networkId: -239,
    config: {
        explorerBaseUrl: 'https://tonviewer.com',
        tokensManifestUrl: 'https://raw.githubusercontent.com/broxus/ton-assets/refs/heads/ton-prod/manifest.json',
        symbol: 'TON',
    },
}
