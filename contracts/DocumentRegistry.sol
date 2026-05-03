// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DocumentRegistry is AccessControl {

    bytes32 public constant PROFESSOR_ROLE = keccak256("PROFESSOR_ROLE");

    struct Document {
        uint256 id;
        string  fileHash;
        string  fileName;
        string  targetGroup;
        uint256 timestamp;
        address uploader;
    }

    Document[] private documents;
    mapping(string => bool) private docExists;

    event DocumentRegistered(
        uint256 indexed id,
        string  fileHash,
        string  fileName,
        string  indexed targetGroup,
        uint256 timestamp,
        address indexed uploader
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROFESSOR_ROLE, msg.sender);
    }

    function register(
        string calldata fileHash,
        string calldata fileName,
        string calldata targetGroup
    ) external onlyRole(PROFESSOR_ROLE) {
        uint256 id = documents.length;

        documents.push(Document({
            id:          id,
            fileHash:    fileHash,
            fileName:    fileName,
            targetGroup: targetGroup,
            timestamp:   block.timestamp,
            uploader:    msg.sender
        }));

        docExists[fileHash] = true;
        emit DocumentRegistered(id, fileHash, fileName, targetGroup, block.timestamp, msg.sender);
    }

    function verifyDocument(string calldata fileHash) external view returns (bool) {
        return docExists[fileHash];
    }

    function getDocument(uint256 id) external view returns (Document memory) {
        require(id < documents.length, "DocumentRegistry: id invalide");
        return documents[id];
    }

    function getCount() external view returns (uint256) {
        return documents.length;
    }
}