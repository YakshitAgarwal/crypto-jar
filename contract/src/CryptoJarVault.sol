// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CryptoJarVault {
    IERC20 public immutable usdc;

    uint8 public constant LOW_RISK = 1;
    uint8 public constant MEDIUM_RISK = 2;
    uint8 public constant HIGH_RISK = 3;

    mapping(uint8 => uint256) public totalShares;

    mapping(address => mapping(uint8 => uint256)) public userToShares;

    event Deposited(
        address indexed user,
        uint8 indexed vaultNumber,
        uint256 amount,
        uint256 shares
    );

    event Withdrawn(
        address indexed user,
        uint8 indexed vaultNumber,
        uint256 amount,
        uint256 shares
    );

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }

    function deposit(uint256 _amount, uint8 _vaultNumber) external {
        require(_amount > 0, "Amount must be greater than zero");

        require(
            _vaultNumber >= LOW_RISK && _vaultNumber <= HIGH_RISK,
            "Invalid vault"
        );

        uint256 shares = _amount;

        usdc.transferFrom(msg.sender, address(this), _amount);

        userToShares[msg.sender][_vaultNumber] += shares;
        totalShares[_vaultNumber] += shares;

        emit Deposited(msg.sender, _vaultNumber, _amount, shares);
    }

    function withdraw(uint256 _shares, uint8 _vaultNumber) external {
        require(_shares > 0, "Shares must be greater than zero");

        require(
            userToShares[msg.sender][_vaultNumber] >= _shares,
            "Insufficient shares"
        );

        userToShares[msg.sender][_vaultNumber] -= _shares;
        totalShares[_vaultNumber] -= _shares;

        usdc.transfer(msg.sender, _shares);

        emit Withdrawn(msg.sender, _vaultNumber, _shares, _shares);
    }

    function getUserShares(
        address _user,
        uint8 _vaultNumber
    ) external view returns (uint256) {
        return userToShares[_user][_vaultNumber];
    }

    function getUserTotalShares(address _user) external view returns (uint256) {
        uint256 userTotalShares = userToShares[_user][1] +
            userToShares[_user][2] +
            userToShares[_user][3];
        return userTotalShares;
    }
}
