import AppLayout from 'pages/AppLayout'
import { useERC20Balances, useWeb3Contract } from 'react-moralis'
import {
  useEthers,
  useTokenList,
  useContractCalls,
  ERC20Interface,
  useEtherBalance,
} from '@usedapp/core'
import { useState, useEffect } from 'react'
import { Contract, utils } from 'ethers'

const UNISWAP_DEFAULT_TOKEN_LIST_URI =
  'https://gateway.ipfs.io/ipns/tokens.uniswap.org'

const tokenSymbol = {
  1: 'ETH',
  43114: 'AVAX',
  137: 'MATIC',
  56: 'BNB',
  4: 'ETH',
  3: 'ETH',
  19: 'SGB',
  25: 'CRO',
  338: 'CRO',
  250: 'FTM',
  42161: 'ETH',
  8217: 'KLAY',
  1313161554: 'ETH',
  1666600000: 'ONE',
  10: 'ETH',
  361: 'TFUEL',
  100: 'xDAI',
  1285: 'MOVR',
  1284: 'GLMR',
  10000: 'BCH',
  122: 'FUSE',
  14: 'FLR',
  11297108109: 'PALM',
  106: 'VLX',
}

const MainPage = () => {
  const { account, chainId, library } = useEthers()
  const [tokens, setTokens] = useState([])
  const etherBalance = useEtherBalance(account)

  const {
    fetchERC20Balances,
    data,
    isLoading,
    isFetching,
    error,
  } = useERC20Balances()

  useEffect(() => {
    chainId && console.log(chainId.toString(16))
  }, [chainId])

  const loadTokens = async () => {
    if (account) {
      const response = await fetchERC20Balances({
        params: {
          chain: '0x' + chainId.toString(16),
          address: account,
        },
      })

      console.log(response)
      setTokens(response)
    }
  }

  const { runContractFunction } = useWeb3Contract()

  const approveToken = async (tokenAddress, approveAmount) => {
    const erc20 = new Contract(
      tokenAddress,
      ERC20Interface,
      library.getSigner(),
    )
    await erc20.approve(
      '0x05c13CcaEce9C19Da652e1fF77aB56DE8e6468da',
      utils.parseUnits(approveAmount.toString(), 'wei'),
    )
    // await runContractFunction({
    //   abi: ERC20Interface,
    //   contractAddress: tokenAddress, // your contract address here
    //   functionName: 'approve',
    //   params: {
    //     //TODO change address
    //     _spender: '0x05c13CcaEce9C19Da652e1fF77aB56DE8e6468da',
    //     _value: parseUnits(approveAmount.toString(), 'wei'),
    //   },
    // })
  }

  // const httpSource =
  //   logoURI && logoURI.startsWith('ipfs')
  //     ? logoURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
  //     : logoURI;

  return (
    <AppLayout>
      <div className="container mx-auto">
        <div className="flex items-center gap-8">
          <button
            className="flex items-center px-4 py-3 text-white bg-indigo-500 hover:bg-indigo-400"
            onClick={loadTokens}
          >
            Load Tokens
          </button>
          <div className="text-xl">Current Chain ID: {chainId && chainId}</div>
          {etherBalance && (
            <p>
              Wallet Balance:{' '}
              {`${utils.formatEther(etherBalance)} ${tokenSymbol[chainId]}`}{' '}
            </p>
          )}
        </div>

        <div className="relative overflow-x-auto shadow-md my-8">
          {/* <div>
            {name}
            {httpSource && <img src={httpSource} alt={name} />}
          </div> */}
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Symbol
                </th>
                <th scope="col" className="px-6 py-3">
                  Address
                </th>
                <th scope="col" className="px-6 py-3">
                  Balance
                </th>
                <th scope="col" className="px-6 py-3">
                  <span>Approval</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {tokens?.map((token, idx) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  key={idx}
                >
                  <td className="px-6 py-4 min-w-[120px]">
                    {token.logo && (
                      <img
                        className="w-12 h-12 rounded-full"
                        src={token.logo}
                        alt="Logo"
                      />
                    )}
                  </td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                  >
                    {token.name}
                  </th>
                  <td className="px-6 py-4">{token.symbol}</td>
                  <td className="px-6 py-4">{token.token_address}</td>
                  <td className="px-6 py-4">
                    {token.balance / 10 ** token.decimals}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() =>
                        approveToken(
                          token.token_address,
                          token.balance / 10 ** token.decimals,
                        )
                      }
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}

export default MainPage
