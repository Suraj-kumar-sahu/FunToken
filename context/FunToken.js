import React, { useContext, useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

//internal import
import { funTokenAddress, funTokenAbi } from "./constants";

//creating context
export const ERC20ICOContext = React.createContext();

const fetchFunTokenContract = (signerOrProvider) =>
    new ethers.Contract(funTokenAddress, funTokenAbi, signerOrProvider);

export const ERC20Provider = ({ children }) => {
    //----USER ACCOUNT
    const [holderArray, setHolderArray] = useState([]);
    const [account, setAccount] = useState("");
    const [accountBalance, setAccountBalance] = useState("");
    const [userId, setUserId] = useState("");

    const [NoOfToken, setNoOfToken] = useState("");
    const [TokenName, setTokenName] = useState("");
    const [TokenStandard, setTokenStandard] = useState("");
    const [TokenSymbol, setTokenSymbol] = useState("");
    const [TokenOwner, setTokenOwner] = useState("");
    const [TokenOwnerBal, setTokenOwnerBal] = useState("");
    const [completed, setCompleted] = useState(false);

    //---------CONECTING WALLET
    const checkConnection = async () => {
        try {
            if (!window.ethereum) {
                console.log("Metamask is not installed");
            }

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            setAccount(accounts[0]);

            // crating connection to smartcontract and fetch data
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchFunTokenContract(signer);

            //get all token holder
            const allTokenHolder = await contract.balanceOf(accounts[0]);
            setAccountBalance(allTokenHolder.toNumber());

            const totalHolder = await contract._userId();
            setUserId(totalHolder.toNumber());
        }
        catch (error) {
            console.log("wallet is not connected");
        }
    }

    //-------CONNCTING WITH TOKEN CONTRACT

    const ERC20FunToken = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner(
                "0xB4758956412f356dAa6CA798E46c57E34ce2d26C"
            );
            const contract = fetchFunTokenContract(signer);

            //TOKEN SUPPLY
            const supply = await contract.totalSupply();
            const totalSupply = supply.toNumber();
            setNoOfToken(totalSupply);
            //TOKEN NAME
            const name = await contract.name();
            setTokenName(name);
            //TOKEN SYMBOL
            const symbol = await contract.symbol();
            setTokenSymbol(symbol);
            //TOKEN Standard
            const standard = await contract.standard();
            setTokenStandard(standard);
            //TOKEN OWNERCONTRACT
            const ownerOfContract = await contract.ownerOfContract();
            setTokenOwner(ownerOfContract);

            //OWNER TOKEN BALANC
            const balanceToken = await contract.balanceOf(
                "0xB4758956412f356dAa6CA798E46c57E34ce2d26C"
            );
            setTokenOwnerBal(balanceToken.toNumber());
        } catch (error) {
            console.log("Something wrong in the Token Function");
        }
    };

    // transfer token
    const transferToken = async (address, value) => {
        try {
            if (!address || !value) return console.log("No Data");
            console.log(address, value * 1);
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchFunTokenContract(signer);

            const transfer = await contract.transfer(address, BigInt(value * 1));

            transfer.wait();

            // myLoader();
            window.location.reload();
        } catch (error) {
            console.log("something wrong while transfering token");
        }
    };

    // token holder data
    const tokenHolderData = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchFunTokenContract(signer);

            const allTokenHolder = await contract.getTokenHolder();

            allTokenHolder.map(async (el) => {
                const singleHolderData = await contract.getTokenHolderData(el);
                holderArray.push(singleHolderData);
                console.log(holderArray);
            });
        } catch (error) {
            console.log("can't get the data");
        }
    };

    return (
        <ERC20ICOContext.Provider value={{
            checkConnection,
            ERC20FunToken,
            transferToken,
            tokenHolderData,
            NoOfToken,
            TokenName,
            TokenStandard,
            TokenSymbol,
            TokenOwner,
            holderArray,
            account,
            accountBalance,
            TokenOwnerBal,
            userId,
            completed
        }}>
            {children}
        </ERC20ICOContext.Provider>
    )
}

