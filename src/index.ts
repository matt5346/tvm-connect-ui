import { html, nothing, render } from 'lit-html'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { classMap } from 'lit-html/directives/class-map.js'
import { type AddNetwork, type Network, type Permissions, ProviderRpcClient } from 'everscale-inpage-provider'
import {
    getRecentConnectionMeta,
    getTvmProviderPlatformLink,
    isEverWalletBrowser,
    isSparXWalletBrowser,
    isVenomWalletBrowser,
    storeRecentConnectionMeta,
    type TvmWalletProviderConfig,
    TvmWalletService,
} from '@broxus/tvm-connect/lib'
import { autorun, makeAutoObservable, reaction, runInAction } from 'mobx'
import { getUserAgent, isMobile } from '@broxus/js-utils'

import { everWallet, sparxWallet, venomWallet } from './providers'

export * from './providers'
export * from './networks'

type Params = {
    providers?: TvmWalletProviderConfig[]
    networks?: AddNetwork[]
}

export type TvmConnectState = {
    providerId?: string
    networkId?: number
    address?: string
    account?: Permissions['accountInteraction']
    balance?: string
    isReady: boolean
    isLoading: boolean
    isUnsupportedNetwork: boolean
    isPopupVisible: boolean
    isNotInstalled: boolean
    isInitializing: boolean
}

export class TvmConnectUI {
    protected itemTemplate = (provider: TvmWalletProviderConfig) => {
        const hasProvider = this.hasProvider[provider.id]
        const isInitializing = this.isInitializing[provider.id]
        const homepage = provider.info.links?.homepage
        const universalLink = provider.info.links?.universalLink
        const [_, uri] = getTvmProviderPlatformLink({ ...provider.info.links }) ?? []
        const meta = getRecentConnectionMeta()

        return html`
            ${!hasProvider && isInitializing
                ? html`
                      <button
                          class=${classMap({
                              'tvm-connect-ui-item': true,
                              'tvm-connect-ui-item-disabled': true,
                          })}
                      >
                          ${provider.info.icon
                              ? html`
                                    <img class="tvm-connect-ui-item-icon" src=${provider.info.icon} alt="" />
                                `
                              : null}
                          <div class="tvm-connect-ui-item-info">
                              <div class="tvm-connect-ui-item-name">${provider.info.name}</div>
                              <div class="tvm-connect-ui-item-desc">Initializing...</div>
                          </div>
                      </button>
                  `
                : this.isMobile && !hasProvider && universalLink
                  ? html`
                        <a target="_blank" rel="noopener noreferrer" class="tvm-connect-ui-item" href=${universalLink}>
                            ${provider.info.icon
                                ? html`
                                      <img class="tvm-connect-ui-item-icon" src=${provider.info.icon} alt="" />
                                  `
                                : null}
                            <div class="tvm-connect-ui-item-info">
                                <div class="tvm-connect-ui-item-name">${provider.info.name}</div>
                                ${provider.info.description
                                    ? html`
                                          <div class="tvm-connect-ui-item-desc">${provider.info.description}</div>
                                      `
                                    : null}
                            </div>
                        </a>
                    `
                  : !hasProvider
                    ? html`
                          <a
                              target="_blank"
                              rel="noopener noreferrer"
                              class=${classMap({
                                  'tvm-connect-ui-item-disabled': !uri && !homepage,
                                  'tvm-connect-ui-item': true,
                              })}
                              href=${ifDefined(uri ?? homepage)}
                          >
                              ${provider.info.icon
                                  ? html`
                                        <img class="tvm-connect-ui-item-icon" src=${provider.info.icon} alt="" />
                                    `
                                  : null}
                              <div class="tvm-connect-ui-item-info">
                                  <div class="tvm-connect-ui-item-name">Install ${provider.info.name}</div>
                                  ${provider.info.description
                                      ? html`
                                            <div class="tvm-connect-ui-item-desc">${provider.info.description}</div>
                                        `
                                      : null}
                              </div>
                          </a>
                      `
                    : html`
                          <button class="tvm-connect-ui-item" @click=${this.selectProvider.bind(this, provider.id)}>
                              ${provider.info.icon
                                  ? html`
                                        <img class="tvm-connect-ui-item-icon" src=${provider.info.icon} alt="" />
                                    `
                                  : null}
                              <div class="tvm-connect-ui-item-info">
                                  <div class="tvm-connect-ui-item-name">${provider.info.name}</div>
                                  ${provider.info.description
                                      ? html`
                                            <div class="tvm-connect-ui-item-desc">${provider.info.description}</div>
                                        `
                                      : null}
                              </div>
                              ${this.providerId === provider.id
                                  ? html`
                                        <div class="tvm-connect-ui-item-label">Connected</div>
                                    `
                                  : meta && meta.providerId === provider.id
                                    ? html`
                                          <div class="tvm-connect-ui-item-label">Recent</div>
                                      `
                                    : null}
                          </button>
                      `}
        `
    }

    protected providerTemplate = () => {
        if (!this.selectedProvider) {
            return nothing
        }

        const disconnect = () => {
            this.disconnect()
            this.resetselectedProvider()
        }

        return html`
            <button tabindex="0" class="tvm-connect-ui-back" @click=${this.resetselectedProvider}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                >
                    <path
                        d="m289.18-445.54 214.05 213.8q9.85 10.15 10.23 24.19.39 14.04-9.43 24.41-10.49 10.73-24.7 10.66-14.2-.06-24.02-10.55L186.87-451.47q-6.23-5.56-9-12.54-2.77-6.98-2.77-15.69 0-8.04 2.77-14.99 2.77-6.95 9-12.51l269.77-269.77q10.23-10.23 24.18-10.43 13.95-.19 24.54 10.43 9.82 10.59 9.82 24.34 0 13.76-9.82 23.32L289.18-513.13h478.69q13.87 0 23.66 9.8 9.8 9.8 9.8 23.67 0 14.53-9.8 24.33-9.79 9.79-23.66 9.79H289.18Z"
                    />
                </svg>
            </button>
            <div class="tvm-connect-ui-provider">
                <div class="tvm-connect-ui-provider-info">
                    ${this.selectedProvider.info.icon
                        ? html`
                              <img class="tvm-connect-ui-provider-icon" src=${this.selectedProvider.info.icon} alt="" />
                          `
                        : null}
                    ${this.selectedProvider.info.description
                        ? html`
                              <div class="tvm-connect-ui-provider-desc">${this.selectedProvider.info.description}</div>
                          `
                        : null}
                </div>

                ${this.providerId === this.selectedProvider.id
                    ? html`
                          <div class="tvm-connect-ui-provider-status">
                              <div class="tvm-connect-ui-provider-hint">
                                  ${this.selectedProvider.info.name} is connected
                              </div>
                              <button class="tvm-connect-ui-provider-btn" @click=${disconnect}>Disconnect</button>
                          </div>
                      `
                    : this.selectedProviderError
                      ? html`
                            <div class="tvm-connect-ui-provider-status">
                                <div class="tvm-connect-ui-provider-error">Connection failed</div>
                                <div class="tvm-connect-ui-provider-text">
                                    The request was rejected, please try again
                                </div>
                                <button
                                    class="tvm-connect-ui-provider-btn"
                                    @click=${this.selectProvider.bind(this, this.selectedProvider.id)}
                                >
                                    Try again
                                </button>
                            </div>
                        `
                      : html`
                            <div class="tvm-connect-ui-provider-status">
                                <div class="tvm-connect-ui-provider-hint">
                                    Continue in ${this.selectedProvider.info.name}
                                </div>
                                <div class="tvm-connect-ui-provider-text">Accept connection request in the wallet</div>
                            </div>
                        `}
            </div>
        `
    }

    protected rootTemplate = () => {
        const meta = getRecentConnectionMeta()

        return html`
            <div class="tvm-connect-ui-overlay" @click=${this.hide}></div>
            <div class="tvm-connect-ui-popup">
                <button class="tvm-connect-ui-close" tabindex="0" @click=${this.hide}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="currentColor"
                    >
                        <path
                            d="M480-437.85 277.08-234.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L437.85-480 234.92-682.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69L480-522.15l202.92-202.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08 0 12.38-8.69 21.08L522.15-480l202.93 202.92q8.3 8.31 8.5 20.89.19 12.57-8.5 21.27-8.7 8.69-21.08 8.69-12.38 0-21.08-8.69L480-437.85Z"
                        />
                    </svg>
                </button>
                <div class="tvm-connect-ui-title">Connect a wallet</div>
                ${this.selectedProvider
                    ? this.providerTemplate()
                    : html`
                          <div class="tvm-connect-ui-list">
                              ${Array.from(this.tvmWallet.providers)
                                  .sort((a, b) => (a.id === meta?.providerId ? -1 : b.id === meta?.providerId ? 1 : 0))
                                  .map(provider => this.itemTemplate(provider))}
                          </div>
                      `}
            </div>
        `
    }

    protected tvmWallet: TvmWalletService

    protected root: HTMLDivElement

    protected visible = false

    protected selectedProviderId?: string = undefined

    protected selectedNetwork?: AddNetwork = undefined

    protected hasProvider: { [providerId: string]: boolean | undefined }

    protected isMobile = isMobile(getUserAgent())

    protected subscribers: ((state: TvmConnectState) => void)[] = []

    protected networkId?: number = undefined

    protected selectedProviderError?: unknown = undefined

    protected providers: TvmWalletProviderConfig[] = []

    constructor(protected params: Params) {
        this.root = document.createElement('div')
        this.root.classList.add('tvm-connect-ui-root')
        document.body.append(this.root)

        const meta = getRecentConnectionMeta()

        let providers: TvmWalletProviderConfig[] = []
        let providerId: string | undefined = ''
        const userAgent = getUserAgent()

        if (isEverWalletBrowser(userAgent)) {
            const everWalletInstance = everWallet()
            providerId = everWalletInstance.id
            providers.push(everWalletInstance)
        }

        if (isSparXWalletBrowser(userAgent)) {
            const sparxWalletInstance = sparxWallet()
            providerId = sparxWalletInstance.id
            providers.push(sparxWalletInstance)
        }

        if (isVenomWalletBrowser(userAgent)) {
            const venomWalletInstance = venomWallet()
            providerId = venomWalletInstance.id
            providers.push(venomWalletInstance)
        }

        if (!providers.length) {
            const paramsProviders = params.providers
            providerId = paramsProviders?.length === 1 ? paramsProviders[0].id : meta?.providerId
            providers = paramsProviders?.length ? paramsProviders : [sparxWallet(), everWallet(), venomWallet()]
        }

        this.tvmWallet = new TvmWalletService({
            autoInit: true,
            providers,
            providerId,
        })

        this.hasProvider = Object.fromEntries(this.tvmWallet.providers.map(item => [item.id, false]))

        makeAutoObservable(this, {}, { autoBind: true })

        reaction(() => this.tvmWallet.providers.map(item => item.connector.provider), this.syncHasProvider, {
            fireImmediately: true,
        })

        reaction(
            () => this.state,
            () => {
                this.subscribers.forEach(callback => {
                    callback(this.state)
                })
            },
            {
                fireImmediately: true,
            },
        )

        reaction(() => this.tvmWallet.chainId, this.syncNetworkId, {
            fireImmediately: true,
        })

        autorun(() => {
            this.render()
        })
    }

    protected resetselectedProvider() {
        this.selectedProviderId = undefined
        this.selectedProviderError = undefined
    }

    protected async selectProvider(providerId: string) {
        try {
            this.selectedProviderId = providerId

            if (this.providerId === providerId) {
                return
            }

            const prevConnector = this.tvmWallet.connector

            const provider = this.tvmWallet.providers.find(item => item.id === providerId)

            if (!provider) {
                throw new Error('Provider not founded')
            }

            await provider.connector.connect(this.selectedNetwork)

            if (this.tvmWallet.providerId && providerId !== this.tvmWallet.providerId) {
                await prevConnector?.disconnect(true)
            }

            storeRecentConnectionMeta({
                providerId,
                type: provider.connector.type,
            })

            this.tvmWallet.setState('providerId', providerId)

            this.hide()
        } catch (e) {
            this.selectedProviderError = e
            console.error(e)
        }
    }

    protected async syncHasProvider() {
        const entries = await Promise.all(
            this.tvmWallet.providers.map(async item => {
                try {
                    if (
                        item.connector.provider instanceof ProviderRpcClient &&
                        typeof item.connector.provider?.hasProvider === 'function'
                    ) {
                        const hasProvider = await item.connector.provider.hasProvider()
                        return [item.id, hasProvider]
                    } else {
                        return [item.id, item.connector.provider != null]
                    }
                } catch (e) {
                    console.error(e)
                    return [item.id, false]
                }
            }),
        )

        runInAction(() => {
            this.hasProvider = Object.fromEntries(entries)
        })
    }

    protected async syncNetworkId(): Promise<void> {
        let networkId: number | undefined
        try {
            const provider = this.getProvider()
            const state = await provider?.getProviderState()
            networkId = state?.networkId
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.networkId = networkId
        })
    }

    protected render() {
        render(this.rootTemplate(), this.root)
        this.root.classList.toggle('tvm-connect-ui-root-active', this.visible)
    }

    protected show() {
        this.resetselectedProvider()
        this.visible = true
    }

    protected hide() {
        this.visible = false
    }

    protected get selectedProvider(): TvmWalletProviderConfig | undefined {
        return this.tvmWallet.providers.find(item => item.id === this.selectedProviderId)
    }

    protected get isInitializing(): { [providerId: string]: boolean | undefined } {
        return Object.fromEntries(
            this.tvmWallet.providers.map(item => [
                item.id,
                item.connector.isInitializing === undefined || item.connector.isInitializing,
            ]),
        )
    }

    protected get balance(): string | undefined {
        return this.tvmWallet.balance
    }

    protected get providerId(): string | undefined {
        return this.isReady ? this.tvmWallet.providerId : undefined
    }

    protected get address(): string | undefined {
        return this.tvmWallet.address?.toString()
    }

    protected get account(): Permissions['accountInteraction'] | undefined {
        return this.tvmWallet.account
    }

    protected get isReady(): boolean {
        return this.tvmWallet.isReady
    }

    protected get isUnsupportedNetwork(): boolean {
        if (this.params.networks && this.params.networks.length > 0 && this.networkId !== undefined) {
            return this.params.networks.every(item => item.networkId !== this.networkId)
        }
        return false
    }

    protected get isLoading(): boolean {
        return !!this.tvmWallet.isInitializing || !!this.tvmWallet.isConnecting
    }

    protected get state(): TvmConnectState {
        return {
            providerId: this.providerId,
            networkId: this.networkId,
            account: this.account,
            address: this.address,
            balance: this.balance,
            isReady: this.isReady,
            isLoading: this.isLoading,
            isUnsupportedNetwork: this.isUnsupportedNetwork,
            isPopupVisible: this.visible,
            isInitializing: this.tvmWallet.isInitializing === true,
            isNotInstalled:
                Object.values(this.isInitializing).every(item => item === false) &&
                Object.values(this.hasProvider).every(item => item === false),
        }
    }

    connect(network?: AddNetwork) {
        this.selectedNetwork = network

        if (this.tvmWallet.providers.length > 1) {
            this.show()
        } else {
            const provider = this.tvmWallet.providers.at(0)
            if (provider) {
                if (provider.connector.provider) {
                    this.selectProvider(provider.id)
                } else {
                    this.show()
                }
            } else {
                console.warn('Provider must be defined')
            }
        }
    }

    disconnect() {
        this.tvmWallet.disconnect(true)
    }

    switchNetwork(params: AddNetwork): Promise<Network | null> {
        return this.tvmWallet.switchNetwork(params)
    }

    addNetwork(params: AddNetwork): Promise<Network | null> {
        return this.tvmWallet.addNetwork(params)
    }

    changeAccount(): Promise<void> | undefined {
        return this.tvmWallet.provider?.changeAccount()
    }

    getProvider(): ProviderRpcClient | undefined {
        return this.tvmWallet.provider
    }

    getState(): TvmConnectState {
        return { ...this.state }
    }

    subscribe(callback: (state: TvmConnectState) => void): () => void {
        const length = this.subscribers.push(callback)
        callback(this.getState())
        return () => {
            this.subscribers.splice(length - 1, 1)
        }
    }
}
