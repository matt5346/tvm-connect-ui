<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { everscaleNetwork, everWallet, sparxWallet, TvmConnectUI, venomWallet } from '@broxus/tvm-connect-ui'
import '@broxus/tvm-connect-ui/dist/styles.css'

const tvmConnectUI = new TvmConnectUI({
    providers: [everWallet, sparxWallet, venomWallet],
    networks: [everscaleNetwork],
})

const tvmConnectState = ref(tvmConnectUI.getState())

onMounted(() => {
    tvmConnectUI.subscribe(value => {
        tvmConnectState.value = value
    })
})

const testProvider = () => {
    const provider = tvmConnectUI.getProvider()
    provider?.getProviderState().then(r => {
        alert(`Numeric version: ${r.numericVersion}`)
    })
}
</script>

<template>
    <template v-if="tvmConnectState.isReady">
        <template v-if="tvmConnectState.isUnsupportedNetwork">
            <button @click="() => tvmConnectUI.switchNetwork(everscaleNetwork)">Switch network</button>
        </template>
        <template v-else>
            <p>User address: {{ tvmConnectState.address }}</p>
            <p>Balance: {{ tvmConnectState.balance }}</p>
            <p>Network id: {{ tvmConnectState.networkId }}</p>
            <p>
                <button @click="tvmConnectUI.changeAccount">Change account</button>
            </p>
            <p>
                <button @click="testProvider">Test provider</button>
            </p>
            <p>
                <button @click="tvmConnectUI.disconnect">Disconnect</button>
            </p>
        </template>
    </template>
    <template v-else>
        <button @click="() => tvmConnectUI.connect(everscaleNetwork)">Connect</button>
    </template>
</template>
