// have a function to enter the lottery
import { abi, contractAddress } from "@/constants"
import { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled, isWeb3EnableLoading } = useMoralis() // object returned property chainId will be in hexa decimal number . so we have to convert it
    const chainId = parseInt(chainIdHex) // converting hex to base 10
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
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

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (
            await getEntranceFee({ onError: (error) => console.log(error) })
        ).toString()
        //       " { onError: (error) => console.log(error) }" this line is added because if any error spot during calling . we can console.log the error

        const numberOfPlayersFromCall = (
            await getNumberOfPlayers({
                onError: (error) => console.log(error),
            })
        ).toString()
        const recentWinnerFromCall = await getRecentWinner({
            onError: (error) => console.log(error),
        })

        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numberOfPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    //Set Listner for WinnerPicked Event

    async function listenerWinnerPicked() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const raffle = new ethers.Contract(raffleAddress, abi, provider)

        await new Promise(async (resolve, reject) => {
            raffle.on("WinnerPicked", () => {
                try {
                    updateUI()

                    console.log("WinnerPicked event fired!")
                } catch (error) {
                    console.log(error)
                    reject(error)
                }
                resolve()
            })
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI() // try to read raffle entrance fee
            listenerWinnerPicked() /// Setting Listener when user connected
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            Hi from Lottery Entrance!
            <div className=" text-red-600">Supported Chains : Sepolia (recomended) & Goerli </div>
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-2 rounded ml-auto "
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess, // onSuccess isn't checking that transaction has a blockconfirmation, It is checking transaction is successfully sent ot metamask. " thats why we added `` tx.wait(1)`` this is wait for transaction to confirm "
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isFetching || isLoading ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div className="font-bold">
                        Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                    </div>
                    <div className="font-bold  ">Number Of Players: {numberOfPlayers}</div>
                    <div className="font-bold "> Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle Address Detected </div>
            )}
        </div>
    )
}
