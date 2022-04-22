import {
  ERC20Interface,
  useContractCalls,
  useContractFunction,
  useEthers,
  useTokenList,
} from '@usedapp/core'

import { Contract } from 'ethers'

export const useTokensBalance = (tokenList, account) => {
  return useContractCalls(
    tokenList && account
      ? tokenList.map((token) => ({
          abi: ERC20Interface,
          address: token.address,
          method: 'balanceOf',
          args: [account],
        }))
      : [],
  )
}
