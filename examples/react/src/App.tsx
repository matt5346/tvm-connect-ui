import { useEffect, useState } from 'react'
import { everscaleNetwork, everWallet, sparxWallet, TvmConnectUI, venomWallet } from '@broxus/tvm-connect-ui'
import '@broxus/tvm-connect-ui/dist/styles.css'
import './App.css'

const tvmConnectUI = new TvmConnectUI({
    providers: [sparxWallet(), everWallet(), venomWallet()],
    networks: [everscaleNetwork],
})

function App() {
    const [tvmConnectState, setTvmConnectState] = useState(tvmConnectUI.getState())

    useEffect(() => {
        const unsubscribe = tvmConnectUI.subscribe(value => {
            setTvmConnectState(value)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <>
            {tvmConnectState.isReady ? (
                tvmConnectState.isUnsupportedNetwork ? (
                    <button
                        onClick={() => {
                            tvmConnectUI.switchNetwork(everscaleNetwork)
                        }}
                    >
                        Switch network
                    </button>
                ) : (
                    <>
                        <p>User address: {tvmConnectState.address}</p>
                        <p>Balance: {tvmConnectState.balance}</p>
                        <p>Network id: {tvmConnectState.networkId}</p>
                        <p>
                            <button onClick={tvmConnectUI.changeAccount}>Change account</button>
                        </p>
                        <p>
                            <button
                                onClick={() => {
                                    const provider = tvmConnectUI.getProvider()

                                    provider?.getProviderState().then(r => {
                                        alert(`Numeric version: ${r.numericVersion}`)
                                    })
                                }}
                            >
                                Test provider
                            </button>
                        </p>
                        <p>
                            <button onClick={tvmConnectUI.disconnect}>Disconnect</button>
                        </p>
                    </>
                )
            ) : (
                <button
                    onClick={() => {
                        tvmConnectUI.connect(everscaleNetwork)
                    }}
                >
                    Connect
                </button>
            )}
        </>
    )
}

export default App
