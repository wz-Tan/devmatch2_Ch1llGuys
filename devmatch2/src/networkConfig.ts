import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { DEVNET_COUNTER_PACKAGE_ID, MAINNET_COUNTER_PACKAGE_ID, TESTNET_COUNTER_PACKAGE_ID } from "./constants";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables:{
        PackageId: MAINNET_COUNTER_PACKAGE_ID,
      }
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables:{
        PackageId: TESTNET_COUNTER_PACKAGE_ID,
      }
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables:{
        PackageId: DEVNET_COUNTER_PACKAGE_ID,
      }
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
