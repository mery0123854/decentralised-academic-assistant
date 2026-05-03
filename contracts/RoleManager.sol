// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract RoleManager is AccessControl {

    bytes32 public constant PROFESSOR_ROLE = keccak256("PROFESSOR_ROLE");
    bytes32 public constant STUDENT_ROLE   = keccak256("STUDENT_ROLE");

    mapping(address => string) private studentGroups;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function assignRole(address user, bytes32 role) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(role, user);
    }

    function requestStudentRole() external {
        require(!hasRole(STUDENT_ROLE, msg.sender), "RoleManager: deja etudiant");
        _grantRole(STUDENT_ROLE, msg.sender);
    }

    function assignGroup(address student, string calldata group) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(hasRole(STUDENT_ROLE, student), "RoleManager: pas un etudiant");
        studentGroups[student] = group;
    }

    function getGroup(address student) external view returns (string memory) {
        return studentGroups[student];
    }

    function isProfessor(address user) external view returns (bool) {
        return hasRole(PROFESSOR_ROLE, user);
    }

    function isStudent(address user) external view returns (bool) {
        return hasRole(STUDENT_ROLE, user);
    }
}