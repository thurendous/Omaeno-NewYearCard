import React from 'react'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import {
    useAccount,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi'
import { abi } from '../contract-abi'
import FlipCard, { BackCard, FrontCard } from '../components/FlipCard'

const contractConfig = {
    address: '0xc3347fA52E9713A9A6cD0A6164Abc4E1e76Aa49A',
    abi,
}

const Home: NextPage = () => {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])

    const [totalMinted, setUserMinted] = React.useState(0)
    const [getToMintLimit, setGetToMintLimit] = React.useState(false)
    const { address: user, isConnected } = useAccount()

    const { config: contractWriteConfig } = usePrepareContractWrite({
        ...contractConfig,
        functionName: 'mint',
        args: [user ? user : `0x`],
    })

    const {
        data: mintData,
        write: mint,
        isLoading: isMintLoading,
        isSuccess: isMintStarted,
        error: mintError,
    } = useContractWrite(contractWriteConfig)
    console.log(`mint:`, mint)

    const { data: balanceOfUser } = useContractRead({
        ...contractConfig,
        functionName: 'balanceOf',
        args: [user ? user : `0x`],
        watch: true,
    })

    console.log(balanceOfUser)
    const {
        data: txData,
        isSuccess: txSuccess,
        error: txError,
    } = useWaitForTransaction({
        hash: mintData?.hash,
    })

    React.useEffect(() => {
        if (balanceOfUser || balanceOfUser === 0) {
            setUserMinted(balanceOfUser.toNumber())
            if (totalMinted >= 3) {
                setGetToMintLimit(true)
            }
        }
    })

    // React.useEffect(() => {}, [balanceOfUser, user])

    const isMinted = txSuccess
    console.log(abi)
    console.log(`gettomintlimit:`, getToMintLimit)
    console.log(`totalMinted:`, totalMinted)

    return (
        <div className="page">
            <div
                className="container"
                style={{
                    border: '1px solid',
                    padding: '50px',
                    borderRadius: '20px',
                }}
            >
                <div style={{ flex: '1 1 auto', width: '400px' }}>
                    <div style={{ padding: '24px 24px 24px 0' }}>
                        <h1>Omaeno Happy New Year Card Minting</h1>
                        <h3>（Omaenoからの新年メッセージあり）</h3>
                        <p style={{ margin: '20px 0 24px' }}>
                            Omaeno年賀状を{totalMinted} 個ミントした
                        </p>
                        <ConnectButton />

                        {mintError && (
                            <p style={{ marginTop: 24, color: '#FF6257' }}>
                                Error: {mintError.message}
                            </p>
                        )}
                        {txError && (
                            <p style={{ marginTop: 24, color: '#FF6257' }}>
                                Error: {txError.message}
                            </p>
                        )}

                        {mounted &&
                            isConnected &&
                            !isMinted &&
                            !getToMintLimit && (
                                <button
                                    style={{ marginTop: 24, cursor: 'pointer' }}
                                    disabled={
                                        !mint ||
                                        isMintLoading ||
                                        isMintStarted ||
                                        getToMintLimit
                                    }
                                    className="button"
                                    data-mint-loading={isMintLoading}
                                    data-mint-started={isMintStarted}
                                    onClick={() => mint?.()}
                                >
                                    {isMintLoading && 'Waiting for approval'}
                                    {isMintStarted && 'Minting...'}
                                    {!isMintLoading && !isMintStarted && 'Mint'}
                                </button>
                            )}
                        {getToMintLimit && (
                            <p style={{ margin: '20px', color: 'grey' }}>
                                友よ！ミント上限に達したよ。ご愛顧ありがとう!
                            </p>
                        )}
                        {isMinted && (
                            <div>
                                <p
                                    style={{
                                        margin: '30px 0 24px',
                                        color: 'red',
                                    }}
                                >
                                    2023年あけおめことよろ！ミントしてくれてありがとう！この年賀状をお持ちのあなたにきっと幸運が訪れるでしょう！！
                                </p>
                                <p
                                    style={{
                                        margin: '30px 0 24px',
                                        color: 'grey',
                                    }}
                                >
                                    個人的な話になりますが、先日知り合いが原因不明の理由で他界しました。生きているだけで幸せなんだと、死を前にすると、名誉、お金など何もかも微塵子になることを感じた瞬間だった。だからこそ、自分たちが生きているこの人生は前を向き、努力の積み重ねを重視します。常識を破りながら、人や社会が当たり前だと言っていることを常に疑いつつ、激動の時代を生きていこうではないか。
                                </p>
                                <p
                                    style={{
                                        margin: '30px 0 24px',
                                        color: 'red',
                                    }}
                                >
                                    あなたとともにみんなでいることに感謝します！！それだけで幸せ！！
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ flex: '0 0 auto' }}>
                    <FlipCard>
                        <FrontCard isCardFlipped={isMinted}>
                            <Image
                                layout="responsive"
                                src="/Omaeno-new-year-card-rabbit-2023.png"
                                width="500"
                                height="500"
                                alt="RainbowKit Demo NFT"
                            />
                            <h1 style={{ marginTop: 24 }}>Rainbow NFT</h1>
                            <ConnectButton />
                        </FrontCard>
                        <BackCard isCardFlipped={isMinted}>
                            <div style={{ padding: 24 }}>
                                <Image
                                    src="/nft.png"
                                    width="80"
                                    height="80"
                                    alt="Omaeno Happy New Year Card"
                                    style={{ borderRadius: 3 }}
                                />
                                <h2 style={{ marginTop: 24, marginBottom: 6 }}>
                                    あなたのNFTがミントされた!
                                </h2>
                                <p style={{ marginBottom: 24 }}>
                                    あなたのNFTは特急便であなたに向かっています。
                                </p>
                                <p style={{ marginBottom: 6 }}>
                                    <a
                                        href={`https://goerli.etherscan.io/tx/${mintData?.hash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Etherscan
                                    </a>{' '}
                                    でみる
                                </p>
                                <p>
                                    <a
                                        href={`https://testnets.opensea.io/assets/goerli/${txData?.to}/1`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Opensea
                                    </a>
                                    {'  '}
                                    でみる
                                </p>
                            </div>
                        </BackCard>
                    </FlipCard>
                </div>
            </div>
        </div>
    )
}

export default Home
