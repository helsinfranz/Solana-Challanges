const readline = require('readline');
// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

// Get the wallet balance from a given private key
const getWalletBalance = async (address) => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const publicKey = new PublicKey(address);
        const walletBalance = await connection.getBalance(publicKey);
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async (address) => {
    try {
        // Connect to the Devnet and make a wallet from privateKey
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // Request airdrop of 2 SOL to the wallet
        console.log("Airdropping 2 SOL to wallet: " + address);
        const fromAirDropSignature = await connection.requestAirdrop(new PublicKey(address),2 * LAMPORTS_PER_SOL);
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

const lineReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
  
lineReader.question(`Enter Solana wallet address to receive airdrop: `, async (address) => {

    try {
        const isValidAddress = PublicKey.isOnCurve(address);

        if(isValidAddress){
            await getWalletBalance(address);
            await airDropSol(address);
            await getWalletBalance(address);
        }
    } catch (error) {
        console.log("Enter a valid Solana wallet address.")
    }
   
    lineReader.close();
});
