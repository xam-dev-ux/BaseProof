// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title BaseProof
 * @notice Decentralized document certification and timestamping platform
 * @dev Provides immutable proof of existence and ownership for documents
 */
contract BaseProof is ReentrancyGuard, Ownable2Step, Pausable {

    // ============ Enums ============

    enum Category {
        LEGAL,
        INTELLECTUAL_PROPERTY,
        CREATIVE,
        ACADEMIC,
        BUSINESS,
        IDENTITY,
        REAL_ESTATE,
        MEDICAL,
        GOVERNMENT,
        OTHER
    }

    // ============ Structs ============

    struct TransferRecord {
        address from;
        address to;
        uint256 timestamp;
    }

    struct Certificate {
        uint256 id;
        bytes32 documentHash;
        address issuer;
        address owner;
        string title;
        string descriptionIPFS;
        Category category;
        uint256 certificationTimestamp;
        string metadataIPFS;
        bool isPublic;
        bool isRevoked;
        string revocationReasonIPFS;
        uint256 revocationTimestamp;
        address[] coCertifiers;
        address[] pendingCoCertifiers;
        uint256 expirationDate;
        uint256 renewalCount;
        string[] tags;
        string originalFilename;
        string fileExtension;
    }

    struct ChallengeData {
        address challenger;
        string challengeIPFS;
        uint256 bondAmount;
        uint256 timestamp;
        bool resolved;
        bool challengerWon;
    }

    // ============ State Variables ============

    uint256 private _certificateIdCounter;

    // Configuration
    uint256 public certificationFee;
    uint256 public transferFee;
    uint256 public revocationCooldown;
    uint256 public disputePeriod;
    uint256 public challengeBond;
    address[] public commissionWallets;

    // Bulk discount tiers
    uint256 public constant TIER1_MIN = 10;
    uint256 public constant TIER1_DISCOUNT = 10; // 10%
    uint256 public constant TIER2_MIN = 50;
    uint256 public constant TIER2_DISCOUNT = 20; // 20%
    uint256 public constant TIER3_MIN = 100;
    uint256 public constant TIER3_DISCOUNT = 30; // 30%

    // Storage
    mapping(uint256 => Certificate) private certificates;
    mapping(bytes32 => uint256) private hashToCertificateId;
    mapping(uint256 => TransferRecord[]) private transferHistory;
    mapping(uint256 => ChallengeData) private challenges;

    // Statistics
    mapping(address => uint256[]) private issuerCertificates;
    mapping(address => uint256[]) private ownerCertificates;
    mapping(Category => uint256[]) private categoryCertificates;

    uint256 public totalCertificates;
    uint256 public totalIssuers;
    uint256 public totalRevoked;

    mapping(address => bool) private hasIssued;

    // ============ Events ============

    event DocumentCertified(
        uint256 indexed certificateId,
        bytes32 indexed documentHash,
        address indexed issuer,
        string title,
        Category category,
        uint256 timestamp,
        bool isPublic
    );

    event BulkCertification(
        address indexed issuer,
        uint256[] certificateIds,
        uint256 totalCount,
        uint256 discount
    );

    event CertificateTransferred(
        uint256 indexed certificateId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    event CertificateRevoked(
        uint256 indexed certificateId,
        address indexed revokedBy,
        string reasonIPFS,
        uint256 timestamp
    );

    event CertificateRenewed(
        uint256 indexed certificateId,
        address indexed renewedBy,
        uint256 newExpirationDate,
        uint256 renewalCount
    );

    event CoCertifierAdded(
        uint256 indexed certificateId,
        address indexed coCertifier,
        address indexed addedBy
    );

    event CoCertifierAccepted(
        uint256 indexed certificateId,
        address indexed coCertifier
    );

    event CertificateChallenged(
        uint256 indexed certificateId,
        address indexed challenger,
        string challengeIPFS,
        uint256 bondAmount
    );

    event ChallengeResolved(
        uint256 indexed certificateId,
        bool challengerWon,
        address resolver
    );

    event FeeCollected(
        uint256 indexed certificateId,
        uint256 amount,
        address[] commissionWallets,
        uint256[] distributions
    );

    event ConfigurationUpdated(
        uint256 certificationFee,
        uint256 transferFee,
        uint256 revocationCooldown,
        uint256 disputePeriod
    );

    // ============ Errors ============

    error InvalidFee();
    error InvalidHash();
    error HashAlreadyExists();
    error InvalidTitle();
    error InvalidCoCertifiers();
    error InvalidExpirationDate();
    error InvalidTags();
    error CertificateNotFound();
    error NotAuthorized();
    error CertificateRevoked();
    error RevocationCooldownNotMet();
    error InvalidRecipient();
    error CertificateNotExpired();
    error InvalidCommissionWallets();
    error TransferFailed();
    error CoCertifierLimitReached();
    error AlreadyCoCertifier();
    error NotPendingCoCertifier();
    error ChallengeBondRequired();
    error ChallengeAlreadyExists();

    // ============ Constructor ============

    constructor(
        uint256 _certificationFee,
        uint256 _transferFee,
        uint256 _revocationCooldown,
        uint256 _disputePeriod,
        uint256 _challengeBond,
        address[] memory _commissionWallets
    ) Ownable(msg.sender) {
        require(_commissionWallets.length > 0 && _commissionWallets.length <= 10, "Invalid commission wallets");

        certificationFee = _certificationFee;
        transferFee = _transferFee;
        revocationCooldown = _revocationCooldown;
        disputePeriod = _disputePeriod;
        challengeBond = _challengeBond;
        commissionWallets = _commissionWallets;
    }

    // ============ Certification Functions ============

    /**
     * @notice Certify a single document
     * @param _documentHash SHA-256 hash of the document
     * @param _title Document title (3-200 characters)
     * @param _category Document category
     * @param _metadataIPFS IPFS hash for metadata
     * @param _descriptionIPFS IPFS hash for description
     * @param _isPublic Whether the certificate is public
     * @param _coCertifiers Array of co-certifier addresses
     * @param _expirationDate Expiration timestamp (0 for no expiration)
     * @param _tags Array of tags (max 5)
     * @param _originalFilename Original filename
     * @param _fileExtension File extension
     * @return certificateId The ID of the created certificate
     */
    function certifyDocument(
        bytes32 _documentHash,
        string memory _title,
        Category _category,
        string memory _metadataIPFS,
        string memory _descriptionIPFS,
        bool _isPublic,
        address[] memory _coCertifiers,
        uint256 _expirationDate,
        string[] memory _tags,
        string memory _originalFilename,
        string memory _fileExtension
    ) external payable whenNotPaused nonReentrant returns (uint256) {
        // Validations
        if (msg.value < certificationFee) revert InvalidFee();
        if (_documentHash == bytes32(0)) revert InvalidHash();
        if (hashToCertificateId[_documentHash] != 0) revert HashAlreadyExists();
        if (bytes(_title).length < 3 || bytes(_title).length > 200) revert InvalidTitle();
        if (_coCertifiers.length > 10) revert InvalidCoCertifiers();
        if (_expirationDate != 0 && _expirationDate <= block.timestamp) revert InvalidExpirationDate();
        if (_tags.length > 5) revert InvalidTags();

        // Validate co-certifiers
        for (uint256 i = 0; i < _coCertifiers.length; i++) {
            if (_coCertifiers[i] == address(0) || _coCertifiers[i] == msg.sender) {
                revert InvalidCoCertifiers();
            }
            for (uint256 j = i + 1; j < _coCertifiers.length; j++) {
                if (_coCertifiers[i] == _coCertifiers[j]) revert InvalidCoCertifiers();
            }
        }

        // Validate tags
        for (uint256 i = 0; i < _tags.length; i++) {
            if (bytes(_tags[i]).length == 0) revert InvalidTags();
        }

        // Create certificate
        uint256 certificateId = ++_certificateIdCounter;

        Certificate storage cert = certificates[certificateId];
        cert.id = certificateId;
        cert.documentHash = _documentHash;
        cert.issuer = msg.sender;
        cert.owner = msg.sender;
        cert.title = _title;
        cert.descriptionIPFS = _descriptionIPFS;
        cert.category = _category;
        cert.certificationTimestamp = block.timestamp;
        cert.metadataIPFS = _metadataIPFS;
        cert.isPublic = _isPublic;
        cert.pendingCoCertifiers = _coCertifiers;
        cert.expirationDate = _expirationDate;
        cert.tags = _tags;
        cert.originalFilename = _originalFilename;
        cert.fileExtension = _fileExtension;

        // Update mappings
        hashToCertificateId[_documentHash] = certificateId;
        issuerCertificates[msg.sender].push(certificateId);
        ownerCertificates[msg.sender].push(certificateId);
        categoryCertificates[_category].push(certificateId);

        // Update statistics
        if (!hasIssued[msg.sender]) {
            hasIssued[msg.sender] = true;
            totalIssuers++;
        }
        totalCertificates++;

        // Distribute fees
        _distributeFees(certificateId, msg.value);

        emit DocumentCertified(
            certificateId,
            _documentHash,
            msg.sender,
            _title,
            _category,
            block.timestamp,
            _isPublic
        );

        return certificateId;
    }

    /**
     * @notice Certify multiple documents in one transaction
     * @param _documentHashes Array of document hashes
     * @param _titles Array of titles
     * @param _categories Array of categories
     * @param _metadataIPFSHashes Array of metadata IPFS hashes
     * @param _descriptionIPFSHashes Array of description IPFS hashes
     * @param _isPublic Whether certificates are public
     * @param _tags Array of tags (same for all)
     * @return certificateIds Array of created certificate IDs
     */
    function certifyBulk(
        bytes32[] memory _documentHashes,
        string[] memory _titles,
        Category[] memory _categories,
        string[] memory _metadataIPFSHashes,
        string[] memory _descriptionIPFSHashes,
        bool _isPublic,
        string[] memory _tags
    ) external payable whenNotPaused nonReentrant returns (uint256[] memory) {
        uint256 count = _documentHashes.length;
        require(count >= 2 && count <= 100, "Bulk count must be 2-100");
        require(
            _titles.length == count &&
            _categories.length == count &&
            _metadataIPFSHashes.length == count &&
            _descriptionIPFSHashes.length == count,
            "Array length mismatch"
        );
        if (_tags.length > 5) revert InvalidTags();

        // Calculate discount
        uint256 discount = _getBulkDiscount(count);
        uint256 totalFee = (certificationFee * count * (100 - discount)) / 100;

        if (msg.value < totalFee) revert InvalidFee();

        uint256[] memory certificateIds = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            if (_documentHashes[i] == bytes32(0)) revert InvalidHash();
            if (hashToCertificateId[_documentHashes[i]] != 0) revert HashAlreadyExists();
            if (bytes(_titles[i]).length < 3 || bytes(_titles[i]).length > 200) revert InvalidTitle();

            uint256 certificateId = ++_certificateIdCounter;
            certificateIds[i] = certificateId;

            Certificate storage cert = certificates[certificateId];
            cert.id = certificateId;
            cert.documentHash = _documentHashes[i];
            cert.issuer = msg.sender;
            cert.owner = msg.sender;
            cert.title = _titles[i];
            cert.descriptionIPFS = _descriptionIPFSHashes[i];
            cert.category = _categories[i];
            cert.certificationTimestamp = block.timestamp;
            cert.metadataIPFS = _metadataIPFSHashes[i];
            cert.isPublic = _isPublic;
            cert.tags = _tags;

            hashToCertificateId[_documentHashes[i]] = certificateId;
            issuerCertificates[msg.sender].push(certificateId);
            ownerCertificates[msg.sender].push(certificateId);
            categoryCertificates[_categories[i]].push(certificateId);

            emit DocumentCertified(
                certificateId,
                _documentHashes[i],
                msg.sender,
                _titles[i],
                _categories[i],
                block.timestamp,
                _isPublic
            );
        }

        if (!hasIssued[msg.sender]) {
            hasIssued[msg.sender] = true;
            totalIssuers++;
        }
        totalCertificates += count;

        _distributeFees(certificateIds[0], msg.value);

        emit BulkCertification(msg.sender, certificateIds, count, discount);

        return certificateIds;
    }

    // ============ Transfer Functions ============

    /**
     * @notice Transfer certificate ownership
     * @param _certificateId Certificate ID
     * @param _newOwner New owner address
     */
    function transferCertificate(
        uint256 _certificateId,
        address _newOwner
    ) external payable whenNotPaused nonReentrant {
        if (msg.value < transferFee) revert InvalidFee();

        Certificate storage cert = certificates[_certificateId];
        if (cert.id == 0) revert CertificateNotFound();
        if (cert.owner != msg.sender) revert NotAuthorized();
        if (cert.isRevoked) revert CertificateRevoked();
        if (_newOwner == address(0) || _newOwner == msg.sender) revert InvalidRecipient();

        address previousOwner = cert.owner;
        cert.owner = _newOwner;

        // Record transfer
        transferHistory[_certificateId].push(TransferRecord({
            from: previousOwner,
            to: _newOwner,
            timestamp: block.timestamp
        }));

        // Update owner certificates
        ownerCertificates[_newOwner].push(_certificateId);

        // Distribute fees
        _distributeFees(_certificateId, msg.value);

        emit CertificateTransferred(_certificateId, previousOwner, _newOwner, block.timestamp);
    }

    /**
     * @notice Batch transfer certificates
     * @param _certificateIds Array of certificate IDs
     * @param _newOwner New owner address
     */
    function batchTransfer(
        uint256[] memory _certificateIds,
        address _newOwner
    ) external payable whenNotPaused nonReentrant {
        uint256 count = _certificateIds.length;
        if (msg.value < transferFee * count) revert InvalidFee();
        if (_newOwner == address(0) || _newOwner == msg.sender) revert InvalidRecipient();

        for (uint256 i = 0; i < count; i++) {
            Certificate storage cert = certificates[_certificateIds[i]];
            if (cert.id == 0) revert CertificateNotFound();
            if (cert.owner != msg.sender) revert NotAuthorized();
            if (cert.isRevoked) revert CertificateRevoked();

            address previousOwner = cert.owner;
            cert.owner = _newOwner;

            transferHistory[_certificateIds[i]].push(TransferRecord({
                from: previousOwner,
                to: _newOwner,
                timestamp: block.timestamp
            }));

            ownerCertificates[_newOwner].push(_certificateIds[i]);

            emit CertificateTransferred(_certificateIds[i], previousOwner, _newOwner, block.timestamp);
        }

        _distributeFees(_certificateIds[0], msg.value);
    }

    // ============ Revocation Functions ============

    /**
     * @notice Revoke a certificate
     * @param _certificateId Certificate ID
     * @param _reasonIPFS IPFS hash explaining revocation reason
     */
    function revokeCertificate(
        uint256 _certificateId,
        string memory _reasonIPFS
    ) external whenNotPaused {
        Certificate storage cert = certificates[_certificateId];
        if (cert.id == 0) revert CertificateNotFound();
        if (cert.isRevoked) revert CertificateRevoked();

        // Authorization check
        bool isAuthorized = msg.sender == cert.issuer ||
                           msg.sender == cert.owner ||
                           msg.sender == owner();
        if (!isAuthorized) revert NotAuthorized();

        // Cooldown check (only for non-owner revocations)
        if (msg.sender != owner() &&
            block.timestamp < cert.certificationTimestamp + revocationCooldown) {
            revert RevocationCooldownNotMet();
        }

        cert.isRevoked = true;
        cert.revocationReasonIPFS = _reasonIPFS;
        cert.revocationTimestamp = block.timestamp;

        totalRevoked++;

        emit CertificateRevoked(_certificateId, msg.sender, _reasonIPFS, block.timestamp);
    }

    /**
     * @notice Batch revoke certificates
     * @param _certificateIds Array of certificate IDs
     * @param _reasonIPFS IPFS hash explaining revocation reason
     */
    function batchRevoke(
        uint256[] memory _certificateIds,
        string memory _reasonIPFS
    ) external whenNotPaused {
        for (uint256 i = 0; i < _certificateIds.length; i++) {
            Certificate storage cert = certificates[_certificateIds[i]];
            if (cert.id == 0) continue;
            if (cert.isRevoked) continue;

            bool isAuthorized = msg.sender == cert.issuer ||
                               msg.sender == cert.owner ||
                               msg.sender == owner();
            if (!isAuthorized) continue;

            if (msg.sender != owner() &&
                block.timestamp < cert.certificationTimestamp + revocationCooldown) {
                continue;
            }

            cert.isRevoked = true;
            cert.revocationReasonIPFS = _reasonIPFS;
            cert.revocationTimestamp = block.timestamp;

            totalRevoked++;

            emit CertificateRevoked(_certificateIds[i], msg.sender, _reasonIPFS, block.timestamp);
        }
    }

    // ============ Renewal Functions ============

    /**
     * @notice Renew an expired certificate
     * @param _certificateId Certificate ID
     * @param _newExpirationDate New expiration date
     */
    function renewCertificate(
        uint256 _certificateId,
        uint256 _newExpirationDate
    ) external payable whenNotPaused nonReentrant {
        if (msg.value < certificationFee) revert InvalidFee();

        Certificate storage cert = certificates[_certificateId];
        if (cert.id == 0) revert CertificateNotFound();
        if (cert.owner != msg.sender) revert NotAuthorized();
        if (cert.isRevoked) revert CertificateRevoked();
        if (cert.expirationDate == 0) revert CertificateNotExpired();
        if (_newExpirationDate <= block.timestamp) revert InvalidExpirationDate();

        cert.expirationDate = _newExpirationDate;
        cert.renewalCount++;

        _distributeFees(_certificateId, msg.value);

        emit CertificateRenewed(_certificateId, msg.sender, _newExpirationDate, cert.renewalCount);
    }

    // ============ Co-Certification Functions ============

    /**
     * @notice Add a co-certifier to a certificate
     * @param _certificateId Certificate ID
     * @param _coCertifier Co-certifier address
     */
    function addCoCertifier(
        uint256 _certificateId,
        address _coCertifier
    ) external whenNotPaused {
        Certificate storage cert = certificates[_certificateId];
        if (cert.id == 0) revert CertificateNotFound();
        if (cert.issuer != msg.sender) revert NotAuthorized();
        if (cert.isRevoked) revert CertificateRevoked();
        if (_coCertifier == address(0) || _coCertifier == cert.issuer) revert InvalidCoCertifiers();
        if (cert.coCertifiers.length + cert.pendingCoCertifiers.length >= 10) {
            revert CoCertifierLimitReached();
        }

        // Check if already a co-certifier
        for (uint256 i = 0; i < cert.coCertifiers.length; i++) {
            if (cert.coCertifiers[i] == _coCertifier) revert AlreadyCoCertifier();
        }
        for (uint256 i = 0; i < cert.pendingCoCertifiers.length; i++) {
            if (cert.pendingCoCertifiers[i] == _coCertifier) revert AlreadyCoCertifier();
        }

        cert.pendingCoCertifiers.push(_coCertifier);

        emit CoCertifierAdded(_certificateId, _coCertifier, msg.sender);
    }

    /**
     * @notice Accept co-certification
     * @param _certificateId Certificate ID
     */
    function acceptCoCertification(uint256 _certificateId) external whenNotPaused {
        Certificate storage cert = certificates[_certificateId];
        if (cert.id == 0) revert CertificateNotFound();

        // Find and remove from pending
        bool found = false;
        for (uint256 i = 0; i < cert.pendingCoCertifiers.length; i++) {
            if (cert.pendingCoCertifiers[i] == msg.sender) {
                // Move to accepted co-certifiers
                cert.coCertifiers.push(msg.sender);

                // Remove from pending
                cert.pendingCoCertifiers[i] = cert.pendingCoCertifiers[cert.pendingCoCertifiers.length - 1];
                cert.pendingCoCertifiers.pop();

                found = true;
                break;
            }
        }

        if (!found) revert NotPendingCoCertifier();

        emit CoCertifierAccepted(_certificateId, msg.sender);
    }

    // ============ Challenge Functions ============

    /**
     * @notice Challenge a certificate's validity
     * @param _certificateId Certificate ID
     * @param _challengeIPFS IPFS hash with evidence
     */
    function challengeCertificate(
        uint256 _certificateId,
        string memory _challengeIPFS
    ) external payable whenNotPaused {
        if (msg.value < challengeBond) revert ChallengeBondRequired();

        Certificate storage cert = certificates[_certificateId];
        if (cert.id == 0) revert CertificateNotFound();
        if (challenges[_certificateId].challenger != address(0)) revert ChallengeAlreadyExists();

        challenges[_certificateId] = ChallengeData({
            challenger: msg.sender,
            challengeIPFS: _challengeIPFS,
            bondAmount: msg.value,
            timestamp: block.timestamp,
            resolved: false,
            challengerWon: false
        });

        emit CertificateChallenged(_certificateId, msg.sender, _challengeIPFS, msg.value);
    }

    /**
     * @notice Resolve a challenge (governance/owner only)
     * @param _certificateId Certificate ID
     * @param _challengerWon Whether challenger won
     */
    function resolveChallenge(
        uint256 _certificateId,
        bool _challengerWon
    ) external onlyOwner nonReentrant {
        ChallengeData storage challenge = challenges[_certificateId];
        require(challenge.challenger != address(0), "No challenge");
        require(!challenge.resolved, "Already resolved");

        challenge.resolved = true;
        challenge.challengerWon = _challengerWon;

        if (_challengerWon) {
            // Revoke certificate
            Certificate storage cert = certificates[_certificateId];
            cert.isRevoked = true;
            cert.revocationReasonIPFS = challenge.challengeIPFS;
            cert.revocationTimestamp = block.timestamp;
            totalRevoked++;

            // Return bond + reward to challenger
            (bool success, ) = challenge.challenger.call{value: challenge.bondAmount * 2}("");
            if (!success) revert TransferFailed();
        } else {
            // Challenger loses bond (stays in contract)
        }

        emit ChallengeResolved(_certificateId, _challengerWon, msg.sender);
    }

    // ============ View Functions ============

    /**
     * @notice Get certificate by ID
     * @param _certificateId Certificate ID
     * @return Certificate data
     */
    function getCertificate(uint256 _certificateId)
        external
        view
        returns (Certificate memory)
    {
        Certificate memory cert = certificates[_certificateId];
        if (cert.id == 0) revert CertificateNotFound();

        // Privacy check - if private, only owner/issuer/co-certifiers can see full details
        if (!cert.isPublic &&
            msg.sender != cert.owner &&
            msg.sender != cert.issuer &&
            !_isCoCertifier(_certificateId, msg.sender)) {
            // Return minimal info
            Certificate memory minimal;
            minimal.id = cert.id;
            minimal.certificationTimestamp = cert.certificationTimestamp;
            minimal.isPublic = false;
            return minimal;
        }

        return cert;
    }

    /**
     * @notice Verify document by hash (public)
     * @param _documentHash Document hash
     * @return exists Whether document exists
     * @return certificateId Certificate ID
     * @return issuer Issuer address
     * @return currentOwner Current owner
     * @return title Document title
     * @return timestamp Certification timestamp
     * @return isRevoked Whether revoked
     * @return isPublic Whether public
     */
    function verifyDocument(bytes32 _documentHash)
        external
        view
        returns (
            bool exists,
            uint256 certificateId,
            address issuer,
            address currentOwner,
            string memory title,
            uint256 timestamp,
            bool isRevoked,
            bool isPublic
        )
    {
        certificateId = hashToCertificateId[_documentHash];
        if (certificateId == 0) {
            return (false, 0, address(0), address(0), "", 0, false, false);
        }

        Certificate storage cert = certificates[certificateId];

        if (!cert.isPublic &&
            msg.sender != cert.owner &&
            msg.sender != cert.issuer &&
            !_isCoCertifier(certificateId, msg.sender)) {
            return (
                true,
                certificateId,
                address(0),
                address(0),
                "",
                cert.certificationTimestamp,
                cert.isRevoked,
                false
            );
        }

        return (
            true,
            certificateId,
            cert.issuer,
            cert.owner,
            cert.title,
            cert.certificationTimestamp,
            cert.isRevoked,
            cert.isPublic
        );
    }

    /**
     * @notice Get transfer history for a certificate
     * @param _certificateId Certificate ID
     * @return Transfer history
     */
    function getTransferHistory(uint256 _certificateId)
        external
        view
        returns (TransferRecord[] memory)
    {
        if (certificates[_certificateId].id == 0) revert CertificateNotFound();
        return transferHistory[_certificateId];
    }

    /**
     * @notice Get certificates by issuer (paginated)
     * @param _issuer Issuer address
     * @param _offset Starting index
     * @param _limit Number of results
     * @return Array of certificate IDs
     */
    function getCertificatesByIssuer(
        address _issuer,
        uint256 _offset,
        uint256 _limit
    ) external view returns (uint256[] memory) {
        uint256[] storage allCerts = issuerCertificates[_issuer];
        return _paginateArray(allCerts, _offset, _limit);
    }

    /**
     * @notice Get certificates by owner (paginated)
     * @param _owner Owner address
     * @param _offset Starting index
     * @param _limit Number of results
     * @return Array of certificate IDs
     */
    function getCertificatesByOwner(
        address _owner,
        uint256 _offset,
        uint256 _limit
    ) external view returns (uint256[] memory) {
        uint256[] storage allCerts = ownerCertificates[_owner];
        return _paginateArray(allCerts, _offset, _limit);
    }

    /**
     * @notice Get certificates by category (paginated)
     * @param _category Category
     * @param _offset Starting index
     * @param _limit Number of results
     * @return Array of certificate IDs
     */
    function getCertificatesByCategory(
        Category _category,
        uint256 _offset,
        uint256 _limit
    ) external view returns (uint256[] memory) {
        uint256[] storage allCerts = categoryCertificates[_category];
        return _paginateArray(allCerts, _offset, _limit);
    }

    /**
     * @notice Check if document hash exists
     * @param _documentHash Document hash
     * @return Whether document exists
     */
    function documentExists(bytes32 _documentHash) external view returns (bool) {
        return hashToCertificateId[_documentHash] != 0;
    }

    /**
     * @notice Get certificate ID by document hash
     * @param _documentHash Document hash
     * @return Certificate ID (0 if not found)
     */
    function getCertificateIdByHash(bytes32 _documentHash) external view returns (uint256) {
        return hashToCertificateId[_documentHash];
    }

    /**
     * @notice Get total certificates count
     * @return Total certificates
     */
    function getTotalCertificates() external view returns (uint256) {
        return totalCertificates;
    }

    /**
     * @notice Get platform statistics
     * @return Platform stats
     */
    function getPlatformStats()
        external
        view
        returns (
            uint256 _totalCertificates,
            uint256 _totalIssuers,
            uint256 _totalRevoked,
            uint256 totalPublic,
            uint256 totalPrivate
        )
    {
        uint256 publicCount = 0;
        uint256 privateCount = 0;

        for (uint256 i = 1; i <= _certificateIdCounter; i++) {
            if (certificates[i].id != 0) {
                if (certificates[i].isPublic) {
                    publicCount++;
                } else {
                    privateCount++;
                }
            }
        }

        return (totalCertificates, totalIssuers, totalRevoked, publicCount, privateCount);
    }

    /**
     * @notice Get issuer statistics
     * @param _issuer Issuer address
     * @return Issuer stats
     */
    function getIssuerStats(address _issuer)
        external
        view
        returns (
            uint256 totalIssued,
            uint256 _totalRevoked,
            uint256 totalTransferred,
            uint256[] memory certificateIds
        )
    {
        certificateIds = issuerCertificates[_issuer];
        totalIssued = certificateIds.length;

        for (uint256 i = 0; i < certificateIds.length; i++) {
            Certificate storage cert = certificates[certificateIds[i]];
            if (cert.isRevoked) _totalRevoked++;
            if (transferHistory[certificateIds[i]].length > 0) totalTransferred++;
        }
    }

    /**
     * @notice Get challenge data
     * @param _certificateId Certificate ID
     * @return Challenge data
     */
    function getChallenge(uint256 _certificateId)
        external
        view
        returns (ChallengeData memory)
    {
        return challenges[_certificateId];
    }

    // ============ Admin Functions ============

    /**
     * @notice Update configuration
     * @param _certificationFee New certification fee
     * @param _transferFee New transfer fee
     * @param _revocationCooldown New revocation cooldown
     * @param _disputePeriod New dispute period
     */
    function updateConfiguration(
        uint256 _certificationFee,
        uint256 _transferFee,
        uint256 _revocationCooldown,
        uint256 _disputePeriod
    ) external onlyOwner {
        certificationFee = _certificationFee;
        transferFee = _transferFee;
        revocationCooldown = _revocationCooldown;
        disputePeriod = _disputePeriod;

        emit ConfigurationUpdated(
            _certificationFee,
            _transferFee,
            _revocationCooldown,
            _disputePeriod
        );
    }

    /**
     * @notice Update commission wallets
     * @param _commissionWallets New commission wallets
     */
    function updateCommissionWallets(address[] memory _commissionWallets) external onlyOwner {
        if (_commissionWallets.length == 0 || _commissionWallets.length > 10) {
            revert InvalidCommissionWallets();
        }
        commissionWallets = _commissionWallets;
    }

    /**
     * @notice Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Withdraw accumulated funds (emergency)
     */
    function emergencyWithdraw() external onlyOwner nonReentrant {
        (bool success, ) = owner().call{value: address(this).balance}("");
        if (!success) revert TransferFailed();
    }

    // ============ Internal Functions ============

    /**
     * @dev Distribute fees to commission wallets
     */
    function _distributeFees(uint256 _certificateId, uint256 _amount) private {
        uint256 perWallet = _amount / commissionWallets.length;
        uint256[] memory distributions = new uint256[](commissionWallets.length);

        for (uint256 i = 0; i < commissionWallets.length; i++) {
            distributions[i] = perWallet;
            (bool success, ) = commissionWallets[i].call{value: perWallet}("");
            if (!success) revert TransferFailed();
        }

        emit FeeCollected(_certificateId, _amount, commissionWallets, distributions);
    }

    /**
     * @dev Get bulk discount percentage
     */
    function _getBulkDiscount(uint256 _count) private pure returns (uint256) {
        if (_count >= TIER3_MIN) return TIER3_DISCOUNT;
        if (_count >= TIER2_MIN) return TIER2_DISCOUNT;
        if (_count >= TIER1_MIN) return TIER1_DISCOUNT;
        return 0;
    }

    /**
     * @dev Check if address is a co-certifier
     */
    function _isCoCertifier(uint256 _certificateId, address _address) private view returns (bool) {
        Certificate storage cert = certificates[_certificateId];
        for (uint256 i = 0; i < cert.coCertifiers.length; i++) {
            if (cert.coCertifiers[i] == _address) return true;
        }
        return false;
    }

    /**
     * @dev Paginate array
     */
    function _paginateArray(
        uint256[] storage _array,
        uint256 _offset,
        uint256 _limit
    ) private view returns (uint256[] memory) {
        if (_offset >= _array.length) {
            return new uint256[](0);
        }

        uint256 end = _offset + _limit;
        if (end > _array.length) {
            end = _array.length;
        }

        uint256 resultLength = end - _offset;
        uint256[] memory result = new uint256[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = _array[_offset + i];
        }

        return result;
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}
