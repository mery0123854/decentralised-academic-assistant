// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AnnouncementLog is AccessControl {

    bytes32 public constant PROFESSOR_ROLE = keccak256("PROFESSOR_ROLE");

    struct Announcement {
        uint256 id;
        string  contentHash;
        string  category;
        string  targetGroup;
        uint256 timestamp;
        address publisher;
    }

    Announcement[] private announcements;
    mapping(string => bool) private hashExists;

    event AnnouncementPublished(
        uint256 indexed id,
        string  contentHash,
        string  category,
        string  indexed targetGroup,
        uint256 timestamp,
        address indexed publisher
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROFESSOR_ROLE, msg.sender);
    }

    function publish(
        string calldata contentHash,
        string calldata category,
        string calldata targetGroup
    ) external onlyRole(PROFESSOR_ROLE) {
        uint256 id = announcements.length;

        announcements.push(Announcement({
            id:          id,
            contentHash: contentHash,
            category:    category,
            targetGroup: targetGroup,
            timestamp:   block.timestamp,
            publisher:   msg.sender
        }));

        hashExists[contentHash] = true;
        emit AnnouncementPublished(id, contentHash, category, targetGroup, block.timestamp, msg.sender);
    }

    function verify(string calldata contentHash) external view returns (bool) {
        return hashExists[contentHash];
    }

    function getAnnouncement(uint256 id) external view returns (Announcement memory) {
        require(id < announcements.length, "AnnouncementLog: id invalide");
        return announcements[id];
    }

    function getCount() external view returns (uint256) {
        return announcements.length;
    }
}