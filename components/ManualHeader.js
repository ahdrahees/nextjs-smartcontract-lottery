import { useMoralis } from "react-moralis"

export default function ManualHeader() {
    const { enableWeb3, isWeb3Enabled } = useMoralis()
    return (
        <div>
            <button onClick={() => enableWeb3()}>Connect</button>
        </div>
    )
}
