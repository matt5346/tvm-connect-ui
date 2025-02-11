import { type ConnectionProperties } from 'everscale-standalone-client'

export const everscaleConnection: ConnectionProperties = {
    id: 42,
    type: 'jrpc',
    data: {
        endpoint: 'https://jrpc.everwallet.net'
    }
}

export const venomConnection: ConnectionProperties = {
    id: 1,
    type: 'jrpc',
    data: {
        endpoint: 'https://jrpc.venom.foundation'
    }
}

export const hamsterConnection: ConnectionProperties = {
    id: 7,
    type: 'jrpc',
    data: {
        endpoint: 'https://rpc.hamster.network'
    }
}

export const tychoTestnetConnection: ConnectionProperties = {
    id: 2000,
    type: 'jrpc',
    data: {
        endpoint: 'https://rpc-testnet.tychoprotocol.com'
    }
}

export const tonConnection: ConnectionProperties = {
    id: -239,
    type: 'jrpc',
    data: {
        endpoint: 'https://jrpc-ton.broxus.com'
    }
}
