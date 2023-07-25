import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert2";
import Web3 from "web3";
import { contract_address, contract_abi, speedy_nodes } from "./config";
import { IoMdClose } from "react-icons/io";
import Web3Provider from "@walletconnect/web3-provider";
import { useWeb3Modal, Web3Modal } from "@web3modal/react";
import {
  mainnet,
  useAccount,
  useConnect,
  useNetwork,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  getContract,
  parseEther,
  simulateContract,
  createPublicClient,
  http,
  BaseError,
  InsufficientFundsError,
  UserRejectedRequestError,
} from "viem";
import { createWalletClient, custom, publicActions } from "viem";
import Footer from "./component/Footer";
import PercentageBar from "./component/PercentageBar";
import Sidebar from "./component/Sidebar";
import { initializationFunction } from "./component/wert";
import MenuBar from "./component/MenuBar";

function App() {
  const { open, close } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  // const { connectors, error, pendingConnector } = useConnect();
  const { chain } = useNetwork();

  const [isWalletConnected, setisWalletConnected] = useState(false);
  const [contract, setContract] = useState();
  const [contractEthBalance, setcontractEthBalance] = useState(0);
  const [contractTokenBalance, setcontractTokenBalance] = useState(0);
  const [tokenPriceInWei, settokenPriceInWei] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [selectedEthValue, setselectedEthValue] = useState(0.00002);
  const [selectedEthValueinWei, setselectedEthValueinWei] = useState(0);
  const [tokensToGet, settokensToGet] = useState(0);
  const [web3Global, setweb3global] = useState();
  const [isModal, setIsModal] = useState(false);
  const [nav, setNav] = useState(false);
  const [soldTokens, setSoldTokens] = useState(0);
  const [tokenPriceInUSDT, settokenPriceInUSDT] = useState(0);
  const [valueinString, setValueInString] = useState("");
  const [wertOpen, setWertOpen] = useState(false);

  const referralCode = window.location.pathname.split("/")[1];
  // console.log(referralCode);

  // This is the function that runs in the start and takes values from the config file and updates the starting vales.
  const startFunction = async () => {
    const web3 = new Web3(speedy_nodes);
    const isContract = new web3.eth.Contract(contract_abi, contract_address);
    setContract(isContract);
    setweb3global(web3);
    setselectedEthValueinWei(0);
    console.log(window.ethereum, "window.ethereum");
  };

  //Public Client for reading contract
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  ///WalletClient for writing functions
  // const walletClient = createWalletClient({
  //   chain: goerli,
  //   transport: http(),
  //   account: address,
  // }).extend(publicActions);

  const onClickNav = () => {
    setNav(!nav);
  };
  const addReferral = async (addt) => {
    await axios
      .put(`https://referralfly.herokuapp.com/api/users/add/${referralCode}`, {
        referralCode,
        walletAddress: addt,
      })
      .then((res) => {
        if (res.statusText === "OK") {
          swal.fire("Success", "Referral added", "success");
        } else {
          swal.fire("Error", "Referral could not be added", "Error");
        }
      });
  };

  // First one time run
  useEffect(() => {
    const func = async () => {
      await startFunction();
    };
    func();
  }, []);

  //
  useEffect(() => {
    async function handleConnection() {
      // const isContract = new web3.eth.Contract(contract_abi, contract_address);

      // const addresses = await web3.eth.getAccounts();
      // const address = addresses[0];

      addReferral(address);
      // setweb3global(web3);

      await fetch_data();
    }

    if (isConnected) {
      if (chain.id === 1) {
        handleConnection();
      } else {
        swal.fire("Wrong Network Selected. Select Ethereum Mainnet");
      }
    }
  }, [isConnected, chain]);

  async function connect_wallet() {
    try {
      const result = await open();
    } catch (error) {
      console.error("Error connecting to provider:", error);
    }
  }

  //write function for contract
  // const { config } = usePrepareContractWrite({
  //   address: contract_address,
  //   abi: contract_abi,
  //   functionName: "buyTokenInETH",
  // });
  const getTest = async () => {
    const result = await publicClient.simulateContract({
      address: contract_address,
      abi: contract_abi,
      functionName: "buyTokenInETH",
      value: parseEther(valueinString),
    });
    console.log(result, "result");
  };
  const { writeAsync } = useContractWrite({
    address: contract_address,
    abi: contract_abi,
    functionName: "buyTokenInETH",
    value: parseEther(valueinString),
  });

  async function fetch_data() {
    //--------------------------------------------------------------------------------------
    const gettingEthBalance = async () => {
      const resultGetBalanceETH = await publicClient.readContract({
        address: contract_address,
        abi: contract_abi,
        functionName: "getContractBalanceETH",
      });
      console.log(resultGetBalanceETH, "getContractBalanceETH");

      const convertedValue = Web3.utils.fromWei(
        resultGetBalanceETH.toString(),
        "ether"
      );

      console.log(convertedValue, typeof convertedValue, "convertedValue");
      setcontractEthBalance(convertedValue);
    };
    await gettingEthBalance();
    //--------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------
    const getTotalTokenSold = async () => {
      const resultTotalTokenSold = await publicClient.readContract({
        address: contract_address,
        abi: contract_abi,
        functionName: "totalTokenSold",
      });
      const result = Web3.utils.fromWei(
        resultTotalTokenSold.toString(),
        "ether"
      );
      console.log(result, "result");
      // const result = Number(resultTotalTokenSold);
      setSoldTokens(result);
      calculate_progress(result);
      console.log(result, "resultTotalTokenSold");
    };
    await getTotalTokenSold();
    //--------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------
    const getFLYYBalance = async () => {
      const resultFLYYBalance = await publicClient.readContract({
        address: contract_address,
        abi: contract_abi,
        functionName: "getContractBalanceFLYY",
      });
      const result = Number(resultFLYYBalance);
      setcontractTokenBalance(result);
    };
    await getFLYYBalance();
    //--------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------------
    const getPriceInWei = async () => {
      const resultPriceInWei = await publicClient.readContract({
        address: contract_address,
        abi: contract_abi,
        functionName: "tokenPriceInWEI",
      });
      const result = Number(resultPriceInWei);
      settokenPriceInWei(result);
    };
    await getPriceInWei();
    //--------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------------
    const getPriceInUSDT = async () => {
      const resultPriceInUSDT = await publicClient.readContract({
        address: contract_address,
        abi: contract_abi,
        functionName: "tokenPriceInUSDT",
      });
      console.log(resultPriceInUSDT, "resultPriceInUSDT");
      const result = Number(resultPriceInUSDT);
      let tokenPrice = 1 / result;
      console.log(tokenPrice, "tokenPrice");
      settokenPriceInUSDT(tokenPrice);
    };
    await getPriceInUSDT();
    //--------------------------------------------------------------------------------------
  }
  const onEthValueInputHandler = (e) => {
    let temp = parseInt(e.target.value - 0.00002);
    temp = temp + 1;
    temp = temp * parseInt(tokenPriceInWei);
    let value_in_ether = web3Global.utils.fromWei(temp.toString(), "ether");
    let isValueinString = (temp / 10 ** 18).toString();

    console.log(isValueinString, "Value in String");
    if (parseFloat(value_in_ether) <= 0.00002) {
      return;
    }
    console.log(value_in_ether);
    setselectedEthValueinWei(temp);

    setValueInString(isValueinString);
    setselectedEthValue(parseFloat(value_in_ether));
    settokensToGet(parseFloat(value_in_ether) / 0.00002);
    //setMintValue(+e.target.value);
  };
  const onEthManuallyValueInputHandler = (e) => {
    setselectedEthValue(parseFloat(e.target.value));
    settokensToGet(parseFloat(e.target.value) / 0.00002);
    setselectedEthValueinWei(web3Global.utils.toWei(e.target.value));
    //setMintValue(+e.target.value);
  };
  async function show_error_alert(error) {
    console.log(error, "error");
    let temp_error = error.message.toString();
    console.log(temp_error);
    let error_list = [
      "It's not time yet",
      "Sent Amount Wrong",
      "Max Supply Reached",
      "You have already Claimed Free Nft.",
      "Presale have not started yet.",
      "Presale Ended.",
      "You are not Whitelisted.",
      "Sent Amount Not Enough",
      "Max 20 Allowed.",
      "insufficient funds",
      "Exceeding Per Tx Limit",
      "mint at least one token",
      "incorrect ether amount",
      "Presale Ended.",
      "Sale is Paused.",
      "You are not whitelisted",
      "Invalid Voucher. Try Again.",
      "Max Supply Reached.",
      "Public sale is not started",
      "Needs to send more eth",
      "Public Sale Not Started Yet!",
      "Exceed max adoption amount",
      "Private Sale Not Started Yet!",
      "Exceed max minting amount",
      "TokenCrowdsaleFLYY: sent ETH amount must be between purchasing limit",
      "TokenCrowdsaleFLYY: buyable token amount exceeds crowdsale contract balance",
    ];

    for (let i = 0; i < error_list.length; i++) {
      if (temp_error.includes(error_list[i])) {
        // set ("Transcation Failed")
        swal.fire(error_list[i].toLocaleUpperCase());
      }
    }
  }

  //-----------------------------
  async function buyWithEther() {
    if (selectedEthValueinWei > 0) {
      try {
        const { result } = await getTest();
        const writeResult = await writeAsync();
      } catch (err) {
        if (err instanceof BaseError) {
          const isInsufficientFundsError =
            err.walk((e) => e instanceof InsufficientFundsError) instanceof
            InsufficientFundsError;
          //   const isUserRejectedRequestError =
          //     err.walk((e) => e instanceof UserRejectedRequestError) instanceof
          //     UserRejectedRequestError;

          //   // const revertError = err.walk(
          //   //   (err) => err instanceof ContractFunctionExecutionError
          //   // );
          if (isInsufficientFundsError) {
            swal.fire("Not enough balance");
          }
          //   if (isUserRejectedRequestError) {
          //     alert(isInsufficientFundsError,"isUserRejecte");
          //   }
        }
      }
    } else {
      swal.fire("Please select the no of Tokens to buy");
    }
  }

  //-----------------

  async function buyWithCard() {
    if (selectedEthValueinWei > 0) {
      console.log("contract and address ", contract, address);

      // price = Math.round(price * 100) / 100;
      console.log("Price:  .........   " + selectedEthValueinWei);
      //   price =0.006;
      try {
        setWertOpen(true);
        const buyUsingCard = await initializationFunction({
          address,
          contract,
        });
        console.log(buyUsingCard, "buyusingCard");
      } catch (e) {
        setWertOpen(false);
        show_error_alert(e);
      }

      // await contract.methods.tokenByIndex(i).call();
    } else {
      swal.fire("Please select the no of Tokens to buy");
    }
  }
  function calculate_progress(tokensSold) {
    console.log(tokensSold, "Sold Tokens");
    // let total_bought = in_float * 0.00002;
    let total_sold = Math.round(tokensSold);
    console.log(total_sold, "totalSold");
    let total_tokens = 62160000;
    const completed = (total_sold / total_tokens) * 100;
    console.table({ total_sold, completed });
    setProgressPercentage(completed.toFixed(2) + "%");
  }

  //Add token to the Metamask
  const addTokenToMetamask = async () => {
    const tokenAddress = "0xdEF36a0653D4992c3614362553C446ce41488a46";
    const tokenSymbol = "FLYY";
    const tokenDecimals = 18;
    const tokenImage = "https://etherscan.io/token/images/flyguyz_32.png";

    try {
      // wasAdded is a boolean. Like any RPC method, an error can be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC-20 tokens, but eventually more!
          options: {
            address: tokenAddress, // The address of the token.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 characters.
            decimals: tokenDecimals, // The number of decimals in the token.
            image: tokenImage, // A string URL of the token logo.
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Counter

  // Set the target date (August 28, 2023)
  const targetDate = new Date("2023-08-28T00:00:00");

  // State to store the remaining time
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  // Function to calculate the remaining time
  function calculateRemainingTime() {
    const currentTime = new Date();
    const timeDifference = targetDate - currentTime;
    return timeDifference > 0 ? timeDifference : 0;
  }

  // Function to update the remaining time every second
  function updateRemainingTime() {
    setRemainingTime(calculateRemainingTime());
  }

  useEffect(() => {
    // Update the remaining time every second
    const interval = setInterval(updateRemainingTime, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  // Function to format the remaining time as days, hours, minutes, and seconds
  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
    const hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds };
  }

  const { days, hours, minutes, seconds } = formatTime(remainingTime);

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>FlyGuyz</title>
      {/* Favicon */}
      <link
        rel="shortcut icon"
        href="img/flyguyz-favicon.png"
        type="image/x-icon"
      />
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Russo+One&family=Ubuntu:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      {/* Boostrap CSS */}
      <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css" />
      {/* FontAwesome CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/fontawesome.min.css"
        integrity="sha512-xX2rYBFJSj86W54Fyv1de80DWBq7zYLn2z0I9bIhQG+rxIF6XVJUpdGnsNHWRa6AvP89vtFupEPDP8eZAtu9qA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/solid.min.css"
        integrity="sha512-qzgHTQ60z8RJitD5a28/c47in6WlHGuyRvMusdnuWWBB6fZ0DWG/KyfchGSBlLVeqAz+1LzNq+gGZkCSHnSd3g=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      {/* CSS */}
      <link rel="stylesheet" href="css/style.css" />
      {/* Header Start */}
      <nav className="navbar navbar-expand-lg">
        <div className="container-xxl flex-nowrap">
          <div
            id="sideBarNav"
            className="sidebar-nav me-2 me-md-5"
            onClick={onClickNav}
          >
            <a id="sideBarBtn" href="javascript:void(0)">
              <span />
              <span />
              <span />
              <span />
            </a>
          </div>
          <a className="navbar-brand" href="index.html">
            <img
              src="img/flyguyz-logo.png"
              className="img-fluid"
              alt="FlyGuyz"
            />
          </a>

          <MenuBar />
          {/* End of Menu bar */}
          <ul className="navbar-nav ms-auto mb-lg-0">
            <li className="nav-item">
              {(!isConnected || chain.id !== 1) && (
                <a
                  className="btn btn-blue"
                  aria-current="page"
                  onClick={connect_wallet}
                >
                  CONNECT WALLET
                </a>
              )}
              {isConnected && chain.id === 1 && (
                <div className="space-x-2">
                  <a
                    className="btn btn-blue"
                    aria-current="page"
                    onClick={connect_wallet}
                  >
                    CONNECTED
                  </a>
                </div>
              )}
            </li>
          </ul>
        </div>
        {/* Start */}
        <div
          className={
            nav
              ? "flex fixed top-0 left-0 right-0 px-2 z-10 flex-col opacity-90 md:hidden col-auto ease-in-out duration-300 navbar-main ms-auto py-3 rounded-2xl transform translate-y-0"
              : "fixed top-0 left-0 right-0 ease-in-out duration-200 transform -translate-y-full"
          }
        >
          <ul className="navbar-nav text-white flex-column pb-16 mx-auto py-12 rounded-2xl align-items-center bg-[#391883] w-[90vw] space-y-12 ">
            <button className="absolute right-14 top-10" onClick={onClickNav}>
              <IoMdClose size={40} />
            </button>

            <li className="nav-item ">
              <a
                className="nav-link-top text-base font-bold no-underline"
                href="https://www.flyguyz.io/"
                onClick={onClickNav}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link-top font-bold no-underline text-base "
                href="https://dashboard.flyguyz.io/"
                onClick={onClickNav}
              >
                Token Sale
              </a>
            </li>
            <li className="nav-item hover:text-[#3ce66f] ">
              <a
                className="nav-link-top  text-base font-bold no-underline"
                href="https://claim.flyguyz.io/"
                onClick={onClickNav}
              >
                Claim
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link-top font-bold text-base no-underline"
                href="https://referral.flyguyz.io/"
                onClick={onClickNav}
              >
                Referral
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link-top font-bold text-base no-underline"
                href="https://fly-guyz.vercel.app/litepaper.html"
                onClick={onClickNav}
              >
                Litepaper
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link-top font-bold text-base no-underline"
                href="https://whitepaper.flyguyz.io/"
                onClick={onClickNav}
              >
                Whitepaper
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link-top font-bold text-base no-underline"
                href="https://flyguyz.io#roadmap"
                onClick={onClickNav}
              >
                Roadmap
              </a>
            </li>
          </ul>
        </div>
        {/* End */}
      </nav>
      {/* Header   End */}
      {/* Main Start */}
      <div className="container-fluid">
        <div className="row align-items-stretch">
          {/* Sidebar Start */}
          <Sidebar addTokenToMetamask={addTokenToMetamask} />
          {/* Sidebar   End */}
          {/* Other Page Start */}
          <div className="col pt-4">
            <div className="wrap px-lg-4 px-xl-5">
              {/* Breadcrumbs Start */}
              <div className="breadcrumbs">
                <a href="#">User dashboard</a>
                <span> ⁄ </span>
                <span>Private Sale</span>
              </div>
              {/* Breadcrumbs   End */}
              {/* Private Sale Start */}
              <div className="private-sale">
                <div className="page-header">
                  <h2 className="page-heading text-uppercase">
                    FlyGuyz Swap Box
                  </h2>
                </div>
                {/* <div className="note mb-5">
          <div className="card-widget card-widget-success h-100">
            <div className="card-widget-body d-flex flex-row align-items-center">
              <div className="dot dot dot-xlg me-3 bg-success"></div>
              <div className="text pe-3">
                <h6 className="text-uppercase mb-0">Private sale is finished. Thank you for participating!</h6>
                <span>We will announce further instructions how to claim your FLYY tokens in User dashboard and what
                  are the dates of Public round, TGE, and listings. Check our social media for the detailed
                  information</span>
              </div>
              <div className="icon icon-lg text-white bg-success"><svg aria-hidden="true" focusable="false"
                  data-prefix="fal" data-icon="check" className="svg-inline--fa fa-check " role="img"
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor"
                    d="M443.3 100.7C449.6 106.9 449.6 117.1 443.3 123.3L171.3 395.3C165.1 401.6 154.9 401.6 148.7 395.3L4.686 251.3C-1.562 245.1-1.562 234.9 4.686 228.7C10.93 222.4 21.06 222.4 27.31 228.7L160 361.4L420.7 100.7C426.9 94.44 437.1 94.44 443.3 100.7H443.3z">
                  </path>
                </svg></div>
            </div>
          </div>
        </div> */}
              </div>
              {/* Private Sale   End */}
              {/* Graphs Start */}

              {/* <section className="container">

              <div className="walletbox">
              <div className="w-100 d-flex flex-column align-items-center justify-content-start p-3 text-white text-center" style={{backgroundColor: "#580990"}}>
                <div className="d-flex align-items-center justify-content-center w-100 gap-3 fw-semibold font-20 mb-3">
                  <div className="rounded-3 time-card text-center">05d</div>
                  <div className="rounded-3 time-card text-center">23h</div>
                  <div className="rounded-3 time-card text-center">14m</div>
                  <div className="rounded-3 time-card text-center">20s</div>

                  </div>
                  
                  <h4 className="">BUY IN BEFORE PRICE INCREASES!</h4>
                  <div className="progress my-2">
                    <div className="bar" style={{width: "8.59%"}}></div>
                    <div className="status">Next Stage Price: $0.0325</div>
                    </div><p className="mb-2 font-sm-15 fw-semibold"> USDT Raised: $16,735,166.01 / $18,004,966.16 </p>
                </div>

                <div className="p-3 swapArea">
                <p className="text-center mb-3 font-14 dashTitle fw-semibold" >1 FLYY = $0.010</p>
                <div className="tab-container gap-2">
                  <button className="btn btn-light font-14 text-uppercase d-flex align-items-center justify-content-center selected ng-star-inserted">
                    <img style={{height: "22px"}} alt="" src="img/eth.svg"/>

                      <span className="ps-2 font-14">ETH</span>
                      </button>
                  <button className="btn btn-light font-90 text-uppercase d-flex align-items-center justify-content-center ng-star-inserted">
                        <img src="img/usdt.svg" style={{height: "22px"}} alt=""/>

                          <span className="ps-2 font-14">USDT</span></button>
                  <button className="btn btn-light font-14 text-uppercase d-flex align-items-center justify-content-center">
                            <img  src="img/card.svg" style={{height: "22px"}} alt=""/>

                              <span  translate="" className="ps-2 font-14">CARD</span>
                              </button>
                </div>

                </div>
              </div>

              </section> */}
              <section className="container">
                <div className="walletbox">
                  <div
                    className="w-100 bg-black d-flex flex-column align-items-center justify-content-start p-3 text-white text-center"
                    id="uppersection"
                  >
                    <div className="d-flex align-items-center justify-content-center w-100 gap-3 fw-semibold font-20 mb-3">
                      <div className="rounded-3 time-card text-center">
                        {days}d
                      </div>
                      <div className="rounded-3 time-card text-center">{hours}h</div>
                      <div className="rounded-3 time-card text-center">{minutes}m</div>
                      <div className="rounded-3 time-card text-center">{seconds}s</div>
                    </div>
                    <h4 style={{ fontSize: "20px" }}>
                      BUY IN BEFORE PRICE INCREASES!
                    </h4>
                    <div className="progress my-2">
                      <div className="bar" style={{ width: "3.3%" }}></div>
                      <div className="status">Next Stage Price: $0.0325</div>
                    </div>
                    <p
                      style={{ fontSize: "15px", fontWeight: "bold" }}
                      className="mb-2 font-sm-15 fw-semibold"
                    >
                      USDT Raised: $16,757,237.66 / $18,004,966.16
                    </p>
                  </div>
                  <div className="p-3 swapArea">
                    <p className="text-center mb-3 font-14 dashTitle fw-semibold">
                      1 FLYY = $0.0322
                    </p>
                    <div className="tab-container gap-2">
                      <button className="btn1 btn-light font-14 text-uppercase d-flex align-items-center justify-content-center ng-star-inserted">
                        <img
                          style={{ height: "22px" }}
                          alt=""
                          src="/img/eth.svg"
                        />
                        <span className="ps-2 font-14">ETH</span>
                      </button>
                      <button className="btn1 btn-light font-14 text-uppercase d-flex align-items-center justify-content-center ng-star-inserted">
                        <img
                          src="/img/usdt.svg"
                          style={{ height: "22px" }}
                          alt=""
                        />
                        <span className="ps-2 font-14">USDT</span>
                      </button>
                      <button className="btn1 btn-light font-14 text-uppercase d-flex align-items-center justify-content-center selected">
                        <img
                          src="img/card.svg"
                          style={{ height: "22px" }}
                          alt=""
                        />
                        <span translate="" className="ps-2 font-14">
                          CARD
                        </span>
                      </button>
                    </div>
                    <app-swap>
                      <div className="swapSection my-3">
                        <div className="body-section ng-star-inserted">
                          <div className="row">
                            <div className="col-md-6 pe-md-1">
                              <div
                                style={{ color: "gray" }}
                                className="d-flex align-items-center justify-content-between mb-2"
                              >
                                <label className="d-block text-grey font-13">
                                  {" "}
                                  Amount in{" "}
                                  <span className="text-uppercase fw-bold">
                                    USD
                                  </span>{" "}
                                  you pay{" "}
                                </label>
                              </div>
                              <div className="amountField d-flex align-items-start">
                                <input
                                  id="input-box"
                                  type="text"
                                  apptwodigitdecimalnumber=""
                                  placeholder="0"
                                  className="form-control"
                                />
                                <div className="amountType">
                                  <img
                                    style={{ width: "25px" }}
                                    src="img/usdt.svg"
                                  />
                                </div>
                              </div>
                            </div>
                            <div
                              style={{ color: "gray" }}
                              className="col-md-6 ps-md-1"
                            >
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <label className="d-block text-mid-grey font-13">
                                  {" "}
                                  Amount in{" "}
                                  <span className="text-uppercase fw-bold">
                                    FLYY
                                  </span>{" "}
                                  you receive{" "}
                                </label>
                              </div>
                              <div className="amountField">
                                <input
                                  id="input-box"
                                  type="text"
                                  apptwodigitdecimalnumber=""
                                  min="minAmount"
                                  pattern="\d*"
                                  placeholder="0"
                                  className="form-control"
                                />
                                <div className="amountType">
                                  <img
                                    style={{ width: "28px" }}
                                    src="img/flyguyz-logo.png"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </app-swap>
                    <div className="mt-3">
                      <button className="btn2 btn2-black font-14 mb-2 w-100 ng-star-inserted">
                        Buy Now
                      </button>
                      {/* <button className="btn2 btn2-outline-black font-14 mb-2 w-100 ng-star-inserted">Buy with ETH</button> */}
                      <a
                        className="btn2 btn2-light font-14 text-grey w-100"
                        href="/en#how-to-buy"
                      >
                        How To Buy
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              {/* <section className="section-sale mb-3 mb-lg-5">
                <div className="row">
                  <div className="my-4 col-xxl-8 col-xl-8 col-lg-12 col-md-12">
                    <div className="card h-100">
                      <div
                        id="wert-widget"
                        className={`card-inner after-content ${
                          wertOpen ? "w-full h-[800px] relative" : ""
                        }`}
                      >
                        <div className="py-4 card-header">
                          <h6 className="card-heading">Buy Tokens</h6>
                        </div>
                        <div className="pt-3 pb-3 card-body">
                          <div className="h5">Total pay</div>
                          <div className="coin-swap mb-3">
                            <div className="row align-items-center">
                              <div className="col-lg-2 col-md-3 mb-4 mb-md-0">
                                <span className="token token-with-ticker">
                                  <img
                                    src="img/ethereum.svg"
                                    alt="ethereum"
                                    className="img-fluid"
                                  />
                                  <span className="token-name">ETH</span>
                                </span>
                              </div>
                              <div className="col-lg-8 col-md-6 mb-3 mb-md-0">

                                <form className="w-100">
                                  <div className="slider">
                                    <span className="min-value">0.00002</span>
                                    <div className="range">
                                      <input
                                        type="range"
                                        onChange={onEthValueInputHandler}
                                        className="form-range"
                                        min={0.00002}
                                        max={1000000}
                                        defaultValue={0.00002}
                                        required
                                      />
          
                                    </div>
                                    <span className="max-value">14</span>
                                  </div>
                                </form>
                              </div>
                              <div className="col-lg-2 col-md-3">
                                <input
                                  type="number"
                                  onChange={onEthManuallyValueInputHandler}
                                  className="form-control"
                                  min={0.00002}
                                  max={1000000}
                                  defaultValue={selectedEthValue}
                                  value={selectedEthValue}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="coin-swap-arrow">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fal"
                              data-icon="arrow-down"
                              className="svg-inline--fa fa-arrow-down fa-2x"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 384 512"
                            >
                              <path
                                fill="currentColor"
                                d="M378.8 309.8l-176 165.9C199.7 478.6 195.9 480 192 480s-7.719-1.426-10.77-4.31l-176-165.9C-1.297 303.6-1.781 293.1 4.156 286.3c5.953-6.838 16.09-7.259 22.61-1.134L176 425.9V48.59c0-9.171 7.156-16.59 15.1-16.59S208 39.42 208 48.59v377.3l149.2-140.7c6.516-6.125 16.66-5.704 22.61 1.134C385.8 293.1 385.3 303.6 378.8 309.8z"
                              ></path>
                            </svg>
                          </div>
                          <div className="h5">Total receive</div>
                          <div className="coin-swap igu-token mb-3">
                            <span className="token token-with-ticker">
                              <span className="token-left">
                                <img
                                  src="img/icons/flyguyz-icon.png"
                                  alt="FlyGuyz"
                                />
                                <span className="token-name">FLYY</span>
                              </span>
                              <b className="token-value">{tokensToGet}</b>
                            </span>
                          </div>
                          <hr />
                          <div className="h5 tooltip-calculate-result">
                            Round Price
                            <small className="text-muted">
                              1 FLYY = $0.010 USD
                            </small>
                          </div>
                          <div className="flex flex-row justify-between">
                            <p className="font-bold">
                              Round 1 Claim Date on Sep. 20
                            </p>
                          </div>
                          <div className="flex flex-row justify-between">
                            <p className="-mt-2">
                              Buy Before Price Increases To $0.020 FLYY
                            </p>
                          </div>
                          <div className="flex flex-row justify-between">
                            <p className="-mt-2">Listing Price $0.040</p>
                          </div>
                        </div>
                        <div className="text-end card-footer">
                          {(!isConnected || chain.id !== 1) && (
                            <button
                              type="button"
                              onClick={connect_wallet}
                              className="btn-buy d-block w-100 text-uppercase btn btn-blue"
                            >
                              Connect wallet
                            </button>
                          )}
                          {isConnected && chain.id === 1 && (
                            <>
                              
                              <button
                                type="button"
                                onClick={buyWithCard}
                                className="btn-buy d-block w-100 text-uppercase btn btn-blue"
                              >
                                Buy using Card
                              </button>
                              <br />
                              <button
                                type="button"
                                onClick={buyWithEther}
                                className="btn-buy d-block w-100 text-uppercase btn btn-blue"
                              >
                                Buy with Ether
                              </button>
                            </>
                          )}
                          <div className="text-center mt-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 col-lg-4 col-md-12">
                    <div className="mt-4">
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-7">
                              <div className="text-center text-primary">
                                <p className="mb-0">1 FLYY = </p>
                                <div className="h5">$0.010</div>
                                <hr />
                                <p className="mb-0 text-uppercase text-primary">
                                  Pre-Sale
                                </p>
                              </div>
                            </div>
                            <div className="col-5">
                              <div className="text-center">
                                <p className="text-muted mb-0">1 FLYY = </p>
                                <div className="h5">$0.040</div>
                                <hr />
                                <p className="text-muted mb-0 text-uppercase">
                                  Public round
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <PercentageBar progressPercentage={progressPercentage} />
                </div>
  
              </section> */}
            </div>

            <Footer />
          </div>
        </div>
      </div>

      <script src="js/jQuery.js"></script>

      <script src="js/bootstrap/bootstrap.bundle.min.js"></script>

      <script src="js/scripts.js"></script>
    </div>
  );
}

export default App;
