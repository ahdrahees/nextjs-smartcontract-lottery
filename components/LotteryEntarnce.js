// have a function to enter the lottery
import { abi, contractAddress } from "@/constants"
import { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { ethers } from "ethers"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() // object returned property chainId will be in hexa decimal number . so we have to convert it
    const chainId = parseInt(chainIdHex) // converting hex to base 10
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const entranceFeeFromcall = (await getEntranceFee()).toString()

                setEntranceFee(entranceFeeFromcall)
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            Hi from Lottery Entrance!
            {raffleAddress ? (
                <div>
                    <button
                        onClick={async function () {
                            await enterRaffle()
                        }}
                    >
                        Enter Raffle
                    </button>
                    Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                </div>
            ) : (
                <div>No Raffle Address Detected </div>
            )}
        </div>
    )
}
