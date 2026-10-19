import { parseAbi } from "viem";

export const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

export const VAULT_ADDRESS = process.env
  .NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`;

export const USDC_ABI = parseAbi([
  "function approve(address spender, uint256 value) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
]);

export const VAULT_ABI = parseAbi([
  "function deposit(uint256 _amount, uint8 _vaultNumber)",
]);
