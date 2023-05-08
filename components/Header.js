import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="p-5 border-b-4 flex flex-row">
            <h1 className="px-4 py-4 font-bold text-3xl">Decentralized Lottery</h1>
            <div className="ml-auto py-4 px-2">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
