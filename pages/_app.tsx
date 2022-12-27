import '../styles/global.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import {
    RainbowKitProvider,
    getDefaultWallets,
    connectorsForWallets,
} from '@rainbow-me/rainbowkit'
import { argentWallet, trustWallet } from '@rainbow-me/rainbowkit/wallets'
import { Chain, createClient, configureChains, WagmiConfig } from 'wagmi'
// import { Chain } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const goerli: Chain = {
    id: 5,
    name: 'Goerli',
    network: 'Goerli',
    nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        alchemy: { http: ['https://eth-goerli.alchemyapi.io/v2'] },
        default: { http: ['https://rpc.ankr.com/eth_goerli'] },
        infura: { http: ['https://goerli.infura.io/v3'] },
        public: { http: ['https://rpc.ankr.com/eth_goerli'] },
    },
    blockExplorers: {
        etherscan: { name: 'Etherscan', url: 'https://goerli.etherscan.io' },
        default: { name: 'Etherscan', url: 'https://goerli.etherscan.io' },
    },
    contracts: {
        ensRegistry: {
            address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 10299530,
        },
    },
    testnet: true,
}

const { chains, provider, webSocketProvider } = configureChains(
    [goerli],
    [publicProvider()]
)

const { wallets } = getDefaultWallets({
    appName: 'RainbowKit Mint NFT Demo',
    chains,
})

const demoAppInfo = {
    appName: 'RainbowKit Mint NFT Demo',
}

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: 'Other',
        wallets: [argentWallet({ chains }), trustWallet({ chains })],
    },
])

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div>
            <Head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/safari-pinned-tab.svg"
                    color="#5bbad5"
                />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
                    <Component {...pageProps} />
                </RainbowKitProvider>
            </WagmiConfig>
        </div>
    )
}

export default MyApp
