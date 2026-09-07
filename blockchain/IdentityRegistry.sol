// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IdentityRegistry
 * @dev Anchors decentralized identity cryptographic hashes on an EVM-compatible blockchain.
 * Absolutely NO personally identifiable information (PII) is stored on-chain.
 * Only cryptographic identity hashes and public key hashes are registered.
 */
contract IdentityRegistry {
    enum IdentityStatus {
        Inactive,
        Active,
        Suspended,
        Revoked
    }

    struct IdentityRecord {
        address owner;
        IdentityStatus status;
        uint256 registeredAt;
        uint256 updatedAt;
        bytes32 publicKeyHash;
    }

    // Mapping: keccak256(did) => IdentityRecord
    mapping(bytes32 => IdentityRecord) private _identities;

    // Events
    event IdentityRegistered(
        bytes32 indexed identityHash,
        address indexed owner,
        bytes32 publicKeyHash,
        uint256 timestamp
    );

    event IdentityStatusChanged(
        bytes32 indexed identityHash,
        IdentityStatus previousStatus,
        IdentityStatus newStatus,
        uint256 timestamp
    );

    modifier onlyIdentityOwner(bytes32 identityHash) {
        require(
            _identities[identityHash].owner == msg.sender,
            "IdentityRegistry: Caller is not the identity controller"
        );
        _;
    }

    /**
     * @notice Registers a new decentralized identity proof.
     * @param identityHash keccak256 hash of the DID string (e.g. keccak256("did:idone:..."))
     * @param publicKeyHash keccak256 hash of the Ed25519 or secp256k1 public key
     */
    function registerIdentity(bytes32 identityHash, bytes32 publicKeyHash) external {
        require(
            _identities[identityHash].owner == address(0),
            "IdentityRegistry: Identity already registered"
        );
        require(publicKeyHash != bytes32(0), "IdentityRegistry: Invalid public key hash");

        _identities[identityHash] = IdentityRecord({
            owner: msg.sender,
            status: IdentityStatus.Active,
            registeredAt: block.timestamp,
            updatedAt: block.timestamp,
            publicKeyHash: publicKeyHash
        });

        emit IdentityRegistered(identityHash, msg.sender, publicKeyHash, block.timestamp);
    }

    /**
     * @notice Updates the status of an existing identity.
     * @param identityHash keccak256 hash of the DID
     * @param newStatus The updated IdentityStatus (Active, Suspended, Revoked)
     */
    function updateIdentityStatus(bytes32 identityHash, IdentityStatus newStatus)
        external
        onlyIdentityOwner(identityHash)
    {
        require(
            _identities[identityHash].status != IdentityStatus.Revoked,
            "IdentityRegistry: Revoked identity cannot be altered"
        );

        IdentityStatus previousStatus = _identities[identityHash].status;
        _identities[identityHash].status = newStatus;
        _identities[identityHash].updatedAt = block.timestamp;

        emit IdentityStatusChanged(identityHash, previousStatus, newStatus, block.timestamp);
    }

    /**
     * @notice Retrieves the registered record for a given identity hash.
     */
    function getIdentity(bytes32 identityHash)
        external
        view
        returns (
            address owner,
            IdentityStatus status,
            uint256 registeredAt,
            uint256 updatedAt,
            bytes32 publicKeyHash
        )
    {
        IdentityRecord memory record = _identities[identityHash];
        return (
            record.owner,
            record.status,
            record.registeredAt,
            record.updatedAt,
            record.publicKeyHash
        );
    }

    /**
     * @notice Checks if an identity is currently active.
     */
    function isIdentityActive(bytes32 identityHash) external view returns (bool) {
        return _identities[identityHash].status == IdentityStatus.Active;
    }
}
