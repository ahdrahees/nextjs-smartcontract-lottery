// have a function to enter the lottery
import { abi, contractAddress } from "@/constants"
import { useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() // object returned property chainId will be in hexa decimal number . so we have to convert it
    const chainId = parseInt(chainIdHex) // converting hex to base 10
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId](0) : null

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        params: {},
        // msgValue:
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
                const entranceFeeFromContract = await getEntranceFee()
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    return <div>Hi from Lottery Entrance</div>
}
