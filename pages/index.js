// imports work with our front-ends
// require doesnot
// nodejs != javascript
// backend-js is little different from frontend-js
import Head from "next/head"

// import ManualHeader from "@/components/ManualHeader"
import Header from "@/components/Header"
import LotteryEntrance from "@/components/LotteryEntarnce"

export default function Home() {
    return (
        <>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Our smartcontract lottery" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* header / connect button / nav bar */}
            <div>
                {/* <ManualHeader /> */}
                <Header />
                <LotteryEntrance />
            </div>
        </>
    )
}
