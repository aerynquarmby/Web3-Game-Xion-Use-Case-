console.log("app.js loaded");


const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const ethers = window.ethers;

const gemGameAddress = "0x25c116c4B92C28F17e38434aD5E01024273134e0"; // replace with your deployed contract address
const gemGameAbi = [
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "_maticToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "gems",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let gemGameContract;
let gemBalance;
let signer;

async function connectWallet() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          1: 'https://autumn-fluent-feather.matic-testnet.discover.quiknode.pro/d31e074d9f87a07efffbd4fb6921b046a83f10bb/' // replace with your QuickNode RPC endpoint URL and Project ID
        }
      },
    },
  };

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  });

  const provider = await web3Modal.connect();
  signer = provider.getSigner();
  const network = await provider.getNetwork();

  if (network.chainId !== 80001) { // ensure we're on the Mumbai Testnet
    alert("Please switch to the Mumbai Testnet");
    return;
  }

  gemGameContract = new ethers.Contract(gemGameAddress, gemGameAbi, signer);
  gemBalance = await gemGameContract.gems(signer.getAddress());
  updateGemBalance(gemBalance);
}

function updateGemBalance(balance) {
  const gemBalanceElement = document.getElementById("gem-balance");
  gemBalanceElement.innerText = balance.toString();
}

document.getElementById("credit-gems-btn").addEventListener("click", async () => {
  const creditAmount = document.getElementById("credit-amount").value;
  const tx = await gemGameContract.deposit(creditAmount);
  await tx.wait();
  gemBalance = await gemGameContract.gems(signer.getAddress());
  updateGemBalance(gemBalance);
});

connectWallet();
