import {
    everscaleNetwork,
    everWallet,
    sparxWallet,
    TvmConnectState,
    TvmConnectUI,
    venomWallet,
} from '@broxus/tvm-connect-ui'
import '@broxus/tvm-connect-ui/dist/styles.css'
import './style.css'

const tvmConnectUI = new TvmConnectUI({
    providers: [sparxWallet, everWallet, venomWallet],
    networks: [everscaleNetwork],
})

tvmConnectUI.subscribe(state => {
    render(state)
})

function render(state: TvmConnectState) {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      ${
          state.isReady
              ? `
        ${
            state.isUnsupportedNetwork
                ? `
          <button id="switch-network">
            Switch network
          </button>
        `
                : `
        <div>
          <p>User address: ${state.address}</p>
          <p>Balance: ${state.balance}</p>
          <p>Network id: ${state.networkId}</p>
          <p>
            <button id="change-account">
              Change account
            </button>
          </p>
          <p>
            <button id="test-provider">
              Test provider
            </button>
          </p>
          <p>
            <button id="disconnect">
              Disconnect
            </button>
          </p>
        </div>
        `
        }
      `
              : `
        <button id="connect">
          Connect
        </button>
      `
      }
    </div>
  `

    document.getElementById('connect')?.addEventListener('click', () => {
        tvmConnectUI.connect(everscaleNetwork)
    })

    document.getElementById('disconnect')?.addEventListener('click', () => {
        tvmConnectUI.disconnect()
    })

    document.getElementById('switch-network')?.addEventListener('click', () => {
        tvmConnectUI.switchNetwork(everscaleNetwork)
    })

    document.getElementById('test-provider')?.addEventListener('click', () => {
        const provider = tvmConnectUI.getProvider()

        provider?.getProviderState().then(r => {
            alert(`Numeric version: ${r.numericVersion}`)
        })
    })

    document.getElementById('change-account')?.addEventListener('click', () => {
        tvmConnectUI.changeAccount()
    })
}
