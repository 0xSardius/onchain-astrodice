// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title AstrodiceNFT
 * @notice Simple public-mint ERC721 for Astrodice readings
 * @dev Anyone can mint, caller pays gas, no admin functions
 */
contract AstrodiceNFT is ERC721, ERC721URIStorage {
    uint256 private _nextTokenId;

    event ReadingMinted(address indexed to, uint256 indexed tokenId, string uri);

    constructor() ERC721("Astrodice Reading", "ASTRODICE") {}

    /**
     * @notice Mint a new reading NFT
     * @param to Recipient address
     * @param uri IPFS metadata URI
     * @return tokenId The minted token ID
     */
    function mint(address to, string calldata uri) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit ReadingMinted(to, tokenId, uri);
        return tokenId;
    }

    /**
     * @notice Get the total number of minted tokens
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    // Required overrides for ERC721URIStorage
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
