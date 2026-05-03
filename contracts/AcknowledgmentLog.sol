// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AcknowledgmentLog is AccessControl {

    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");

    struct Acknowledgment {
        uint256 announcementId;
        address student;
        uint256 timestamp;
    }

    Acknowledgment[] private acknowledgments;
    mapping(uint256 => mapping(address => bool)) private signed;

    event Acknowledged(
        uint256 indexed announcementId,
        address indexed student,
        uint256 timestamp
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function acknowledge(uint256 announcementId) external onlyRole(STUDENT_ROLE) {
        require(!signed[announcementId][msg.sender], "AcknowledgmentLog: deja signe");

        acknowledgments.push(Acknowledgment({
            announcementId: announcementId,
            student:        msg.sender,
            timestamp:      block.timestamp
        }));

        signed[announcementId][msg.sender] = true;
        emit Acknowledged(announcementId, msg.sender, block.timestamp);
    }

    function hasSigned(uint256 announcementId, address student) external view returns (bool) {
        return signed[announcementId][student];
    }

    function getAcknowledgments(uint256 announcementId) external view returns (Acknowledgment[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < acknowledgments.length; i++) {
            if (acknowledgments[i].announcementId == announcementId) {
                count++;
            }
        }
        
        Acknowledgment[] memory result = new Acknowledgment[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < acknowledgments.length; i++) {
            if (acknowledgments[i].announcementId == announcementId) {
                result[index] = acknowledgments[i];
                index++;
            }
        }
        
        return result;
    }

    function getCount() external view returns (uint256) {
        return acknowledgments.length;
    }
}