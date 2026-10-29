export type FAQ = {
  question: string;
  answer: string;
  category: string;
};

export const faqData: FAQ[] = [
  {
    category: "Getting started",
    question: "What is CryptoJar?",
    answer:
      "CryptoJar is a crypto micro-savings platform that lets you deposit USDC into savings vaults based on your preferred risk level.",
  },
  {
    category: "Getting started",
    question: "How do I connect my wallet?",
    answer:
      "Click Connect Wallet, select a supported wallet, and approve the connection. Make sure you are using the network supported by CryptoJar.",
  },
  {
    category: "Getting started",
    question: "Which blockchain does CryptoJar use?",
    answer:
      "Use the blockchain network configured for your CryptoJar deployment. Make sure your wallet is connected to the correct network before making a transaction.",
  },
  {
    category: "Getting started",
    question: "Do I need cryptocurrency to get started?",
    answer:
      "You need the supported USDC token to make deposits and the network's native token to pay transaction fees, unless your wallet supports sponsored transactions.",
  },
  {
    category: "Getting started",
    question: "Why can't I connect my wallet?",
    answer:
      "Check that your wallet extension is installed and unlocked, your wallet supports the application, and you have approved the connection request. Refresh the page and try again if needed.",
  },
  {
    category: "Savings and deposits",
    question: "How do I deposit USDC?",
    answer:
      "Open Invest, choose a jar, enter your USDC amount, and follow the transaction prompts in your wallet. Token approval may be required first.",
  },
  {
    category: "Savings and deposits",
    question: "What are the different jars?",
    answer:
      "CryptoJar offers Low, Medium, and High risk-preference options. Each strategy carries different risks. Returns are not guaranteed, and losses are possible.",
  },
  {
    category: "Savings and deposits",
    question: "What is USDC?",
    answer:
      "USDC is a stablecoin designed to track the value of the US dollar. Make sure you use the correct USDC token for the network supported by CryptoJar.",
  },
  {
    category: "Savings and deposits",
    question: "Why does my deposit need token approval?",
    answer:
      "Token approval allows a smart contract to spend a specified amount of your USDC. Review the spender address and requested allowance before approving.",
  },
  {
    category: "Savings and deposits",
    question: "Can I choose my risk preference?",
    answer:
      "You can select from the jar options available in CryptoJar. Review each strategy's risks before depositing, since higher-risk strategies can result in losses.",
  },
  {
    category: "Savings and deposits",
    question: "Will my savings earn a guaranteed return?",
    answer:
      "No. Returns depend on the underlying strategy and market conditions. DeFi protocols and smart contracts carry risks, and you may lose some or all of your deposited funds.",
  },
  {
    category: "Savings and deposits",
    question: "Where can I see my savings?",
    answer:
      "Check your dashboard for the savings statistics provided by CryptoJar. You can also review the relevant on-chain transactions using a block explorer.",
  },
  {
    category: "Withdrawals",
    question: "How do I withdraw my savings?",
    answer:
      "Open Withdraw, select your jar, enter the amount, and follow the available transaction steps. Withdrawals depend on vault liquidity and contract restrictions.",
  },
  {
    category: "Withdrawals",
    question: "Can I withdraw all my funds?",
    answer:
      "The amount you can withdraw depends on your available vault balance, the contract rules, and liquidity. Check the available balance before submitting a withdrawal.",
  },
  {
    category: "Withdrawals",
    question: "Why is my withdrawal unavailable?",
    answer:
      "Possible reasons include insufficient available balance, limited vault liquidity, contract restrictions, or a pending transaction. Review the transaction status and vault conditions.",
  },
  {
    category: "Withdrawals",
    question: "How long does a withdrawal take?",
    answer:
      "The time depends on blockchain confirmation and the vault's withdrawal mechanism. Some transactions confirm quickly, while others may take longer due to network congestion or protocol restrictions.",
  },
  {
    category: "Wallet and security",
    question: "Does logging out affect my funds?",
    answer:
      "Logging out disconnects your wallet from the interface. It does not itself transfer your funds. Your assets remain subject to the smart contracts and protocols managing them.",
  },
  {
    category: "Wallet and security",
    question: "Why is my transaction pending?",
    answer:
      "Your transaction may be waiting for blockchain confirmation. Check its status in your wallet or block explorer before attempting another transaction.",
  },
  {
    category: "Wallet and security",
    question: "Why is my transaction failing?",
    answer:
      "Check your network, USDC balance, gas balance, and token approvals. Review the transaction in your wallet or block explorer before retrying.",
  },
  {
    category: "Wallet and security",
    question: "Are my savings guaranteed?",
    answer:
      "No. Crypto assets, smart contracts, and DeFi protocols carry risks. You could lose some or all of your deposited funds.",
  },
  {
    category: "Wallet and security",
    question: "How do I keep my wallet secure?",
    answer:
      "Never share your seed phrase or private key. Check transaction details before signing, use trusted wallet software, and never approve transactions you do not understand.",
  },
  {
    category: "Wallet and security",
    question: "What happens if I lose access to my wallet?",
    answer:
      "Wallet recovery depends on your wallet provider and recovery method. CryptoJar cannot recover a self-custodial wallet's private keys for you. Keep your recovery method secure and private.",
  },
  {
    category: "Wallet and security",
    question: "Can CryptoJar support ask for my private key?",
    answer:
      "No. Never share your private key or recovery phrase with anyone claiming to be support. Legitimate troubleshooting should not require these secrets.",
  },
];
