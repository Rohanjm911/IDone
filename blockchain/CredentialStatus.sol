// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CredentialStatus
 * @dev Manages on-chain revocation and verification status for W3C Verifiable Credentials.
 * No credential contents or subject identity attributes are stored on-chain.
 * Only the SHA-256/Keccak-256 fingerprint of the canonical credential is registered.
 */
contract CredentialStatus {
    enum Status {
        Unregistered,
        Active,
        Revoked,
        Suspended
    }

    struct CredentialRecord {
        address issuer;
        bytes32 issuerHash;
        Status status;
        uint256 issuedAt;
        uint256 revokedAt;
        bytes32 revocationReasonHash;
    }

    // Mapping: keccak256(credentialId) => CredentialRecord
    mapping(bytes32 => CredentialRecord) private _credentials;

    // Events
    event CredentialRegistered(
        bytes32 indexed credentialHash,
        address indexed issuer,
        bytes32 issuerHash,
        uint256 timestamp
    );

    event CredentialRevoked(
        bytes32 indexed credentialHash,
        address indexed issuer,
        bytes32 reasonHash,
        uint256 timestamp
    );

    event CredentialStatusUpdated(
        bytes32 indexed credentialHash,
        Status previousStatus,
        Status newStatus,
        uint256 timestamp
    );

    modifier onlyIssuer(bytes32 credentialHash) {
        require(
            _credentials[credentialHash].issuer == msg.sender,
            "CredentialStatus: Caller is not the credential issuer"
        );
        _;
    }

    /**
     * @notice Registers a new credential hash anchor.
     * @param credentialHash The cryptographic hash of the canonical credential.
     * @param issuerHash The cryptographic hash of the issuer's DID string.
     */
    function registerCredential(bytes32 credentialHash, bytes32 issuerHash) external {
        require(
            _credentials[credentialHash].status == Status.Unregistered,
            "CredentialStatus: Credential hash already registered"
        );

        _credentials[credentialHash] = CredentialRecord({
            issuer: msg.sender,
            issuerHash: issuerHash,
            status: Status.Active,
            issuedAt: block.timestamp,
            revokedAt: 0,
            revocationReasonHash: bytes32(0)
        });

        emit CredentialRegistered(credentialHash, msg.sender, issuerHash, block.timestamp);
    }

    /**
     * @notice Revokes an existing credential.
     * @param credentialHash The cryptographic hash of the credential to revoke.
     * @param reasonHash The cryptographic hash of the revocation reason.
     */
    function revokeCredential(bytes32 credentialHash, bytes32 reasonHash)
        external
        onlyIssuer(credentialHash)
    {
        require(
            _credentials[credentialHash].status != Status.Revoked,
            "CredentialStatus: Credential already revoked"
        );

        Status prev = _credentials[credentialHash].status;
        _credentials[credentialHash].status = Status.Revoked;
        _credentials[credentialHash].revokedAt = block.timestamp;
        _credentials[credentialHash].revocationReasonHash = reasonHash;

        emit CredentialRevoked(credentialHash, msg.sender, reasonHash, block.timestamp);
        emit CredentialStatusUpdated(credentialHash, prev, Status.Revoked, block.timestamp);
    }

    /**
     * @notice Checks if a credential hash is active and unrevoked.
     */
    function isCredentialValid(bytes32 credentialHash) external view returns (bool) {
        return _credentials[credentialHash].status == Status.Active;
    }

    /**
     * @notice Returns full status record for a given credential hash.
     */
    function getCredentialRecord(bytes32 credentialHash)
        external
        view
        returns (
            address issuer,
            bytes32 issuerHash,
            Status status,
            uint256 issuedAt,
            uint256 revokedAt,
            bytes32 revocationReasonHash
        )
    {
        CredentialRecord memory record = _credentials[credentialHash];
        return (
            record.issuer,
            record.issuerHash,
            record.status,
            record.issuedAt,
            record.revokedAt,
            record.revocationReasonHash
        );
    }
}
