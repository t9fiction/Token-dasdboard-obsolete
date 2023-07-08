import WertWidget from "@wert-io/widget-initializer";
import { signSmartContractData } from "@wert-io/widget-sc-signer";
import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";
import { ethers } from "ethers";
import { Buffer } from "buffer/";
import { contract_abi, contract_address } from "../config";

window.Buffer = Buffer; // needed to use `signSmartContractData` in browser

const sc_interface = new ethers.utils.Interface(contract_abi);

export const initializationFunction = ({ address }) => {
  console.log("inside initializationFunction");
  if (window.ethereum) {
    // const web3 = new Web3(window.ethereum);
    (async () => {
      const sc_input_data = sc_interface.encodeFunctionData("buyTokenInETH");
      // const sc_input_data = web3.eth.abi.encodeFunctionCall({
      //   inputs: [],
      //   name: "buyTokenInUSDT",
      //   outputs: [{ internalType: "bool", name: "", type: "bool" }],
      //   stateMutability: "nonpayable",
      //   type: "function",
      // });

      const privateKey =
        "0x57466afb5491ee372b3b30d82ef7e7a0583c9e36aef0f02435bd164fe172b1d3";
      const signedData = signSmartContractData(
        {
          address: address, // user's address
          commodity: "ETH",
          commodity_amount: 0.5, // the crypto amount that should be sent to the contract method
          network: "goerli",
          sc_address: contract_address, // your SC address
          sc_input_data,
        },
        privateKey
      );
      const otherWidgetOptions = {
        partner_id: "01H302YNKJTHG3V322JXSQFTC8", // your partner id
        container_id: "wert-widget",
        click_id: uuidv4(), // unique id of purhase in your system
      };

      const wertWidget = new WertWidget({
        ...signedData,
        ...otherWidgetOptions,
      });

      wertWidget.mount();
    })();
  }
};
