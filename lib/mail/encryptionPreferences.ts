import { OpenPGPKey } from 'pmcrypto';
import { DRAFT_MIME_TYPES, PGP_SCHEMES } from '../constants';
import { Address, PublicKeyModel } from '../interfaces';

enum EncryptionPreferencesError {
    INTERNAL_USER_DISABLED = 0,
    INTERNAL_USER_NO_API_KEY = 1,
    INTERNAL_USER_NO_VALID_API_KEY = 2,
    INTERNAL_USER_PRIMARY_NOT_PINNED = 3,
    WKD_USER_NO_VALID_WKD_KEY = 4,
    WKD_USER_PRIMARY_NOT_PINNED = 5,
    EXTERNAL_USER_NO_VALID_PINNED_KEY = 6
}

export interface EncryptionPreferences {
    encrypt: boolean;
    sign: boolean;
    mimeType: DRAFT_MIME_TYPES;
    scheme: PGP_SCHEMES;
    publicKey?: OpenPGPKey;
    isPublicKeyPinned?: boolean;
    isInternal: boolean;
    hasApiKeys: boolean;
    hasPinnedKeys: boolean;
    warnings?: any[];
    error?: EncryptionPreferencesError;
}

const extractEncryptionPreferencesOwnAddress = (
    ownAddress: Address,
    publicKeyModel: PublicKeyModel
): EncryptionPreferences => {
    const { publicKeys: { api: apiKeys } = { api: [] }, scheme, mimeType, pgpAddressDisabled } = publicKeyModel;
    const hasApiKeys = !!apiKeys.length;
    const hasPinnedKeys = false;
    const canAddressReceive = !!ownAddress.Receive && !pgpAddressDisabled;
    const result = { encrypt: true, sign: true, scheme, mimeType, isInternal: true, hasApiKeys, hasPinnedKeys };
    if (!canAddressReceive) {
        return { ...result, error: EncryptionPreferencesError.INTERNAL_USER_DISABLED };
    }
    if (!hasApiKeys) {
        return {
            ...result,
            error: EncryptionPreferencesError.INTERNAL_USER_NO_API_KEY
        };
    }
    return { ...result, publicKey: apiKeys[0], isPublicKeyPinned: false };
};

const extractEncryptionPreferencesInternal = (publicKeyModel: PublicKeyModel): EncryptionPreferences => {
    const {
        publicKeys: { api: apiKeys, pinned: pinnedKeys } = { api: [], pinned: [] },
        scheme,
        mimeType,
        trustedFingerprints,
        revokedFingerprints,
        expiredFingerprints,
        verifyOnlyFingerprints
    } = publicKeyModel;
    const hasApiKeys = !!apiKeys.length;
    const hasPinnedKeys = !!pinnedKeys.length;
    const result = { encrypt: true, sign: true, scheme, mimeType, isInternal: true, hasApiKeys, hasPinnedKeys };
    if (!hasApiKeys) {
        return {
            ...result,
            error: EncryptionPreferencesError.INTERNAL_USER_NO_API_KEY
        };
    }
    // API keys are ordered in terms of preference. Make sure the primary is valid
    const primaryKeyFingerprint = apiKeys[0].getFingerprint();
    const isPrimaryValid =
        !verifyOnlyFingerprints.has(primaryKeyFingerprint) &&
        !revokedFingerprints.has(primaryKeyFingerprint) &&
        !expiredFingerprints.has(primaryKeyFingerprint);
    if (!isPrimaryValid) {
        return {
            ...result,
            error: EncryptionPreferencesError.INTERNAL_USER_NO_VALID_API_KEY
        };
    }
    if (!hasPinnedKeys) {
        return { ...result, publicKey: apiKeys[0], isPublicKeyPinned: false };
    }
    // Make sure the primary api key is trusted
    if (!trustedFingerprints.has(primaryKeyFingerprint)) {
        return {
            ...result,
            error: EncryptionPreferencesError.INTERNAL_USER_PRIMARY_NOT_PINNED
        };
    }
    // return the pinned key, not the API one
    const publicKey = pinnedKeys.find((key) => key.getFingerprint() === primaryKeyFingerprint);
    return { ...result, publicKey, isPublicKeyPinned: true };
};

const extractEncryptionPreferencesExternalWithWKDKeys = (publicKeyModel: PublicKeyModel): EncryptionPreferences => {
    const {
        publicKeys: { api: apiKeys, pinned: pinnedKeys } = { api: [], pinned: [] },
        scheme,
        mimeType,
        trustedFingerprints,
        revokedFingerprints,
        expiredFingerprints,
        verifyOnlyFingerprints
    } = publicKeyModel;
    const hasApiKeys = true;
    const hasPinnedKeys = !!pinnedKeys.length;
    const result = { encrypt: true, sign: true, scheme, mimeType, isInternal: false, hasApiKeys, hasPinnedKeys };
    // WKD keys are ordered in terms of preference. Make sure the primary is valid
    const primaryKeyFingerprint = apiKeys[0].getFingerprint();
    const isPrimaryValid =
        !verifyOnlyFingerprints.has(primaryKeyFingerprint) &&
        !revokedFingerprints.has(primaryKeyFingerprint) &&
        !expiredFingerprints.has(primaryKeyFingerprint);
    if (!isPrimaryValid) {
        return {
            ...result,
            error: EncryptionPreferencesError.WKD_USER_NO_VALID_WKD_KEY
        };
    }
    if (!hasPinnedKeys) {
        return { ...result, publicKey: apiKeys[0], isPublicKeyPinned: false };
    }
    // Make sure the primary api key is trusted
    if (!trustedFingerprints.has(primaryKeyFingerprint)) {
        return {
            ...result,
            error: EncryptionPreferencesError.WKD_USER_PRIMARY_NOT_PINNED
        };
    }
    // return the pinned key, not the API one
    const publicKey = pinnedKeys.find((key) => key.getFingerprint() === primaryKeyFingerprint);
    return { ...result, publicKey, isPublicKeyPinned: true };
};

const extractEncryptionPreferencesExternalWithoutWKDKeys = (publicKeyModel: PublicKeyModel): EncryptionPreferences => {
    const {
        publicKeys: { pinned: pinnedKeys } = { pinned: [] },
        encrypt,
        sign,
        scheme,
        mimeType,
        revokedFingerprints,
        expiredFingerprints
    } = publicKeyModel;
    const hasPinnedKeys = !!pinnedKeys.length;
    const result = {
        encrypt,
        sign,
        mimeType,
        scheme,
        isInternal: false,
        hasApiKeys: false,
        hasPinnedKeys
    };
    if (!hasPinnedKeys) {
        return result;
    }
    // Pinned keys are ordered in terms of preference. Make sure the first is valid
    const preferredKeyFingerprint = pinnedKeys[0].getFingerprint();
    const isPreferredValid =
        !revokedFingerprints.has(preferredKeyFingerprint) && !expiredFingerprints.has(preferredKeyFingerprint);
    if (!isPreferredValid) {
        return {
            ...result,
            error: EncryptionPreferencesError.EXTERNAL_USER_NO_VALID_PINNED_KEY
        };
    }
    return {
        ...result,
        publicKey: pinnedKeys[0],
        isPublicKeyPinned: true
    };
};

/**
 * Extract the encryption preferences from a public-key model corresponding to a certain email address
 */
const extractEncryptionPreferences = (publicKeyModel: PublicKeyModel, addresses: Address[]): EncryptionPreferences => {
    const ownAddress = addresses.find(({ Email }) => Email === publicKeyModel.email);
    // case of own address
    if (ownAddress) {
        return extractEncryptionPreferencesOwnAddress(ownAddress, publicKeyModel);
    }
    // case of internal user
    if (publicKeyModel.isPGPInternal) {
        return extractEncryptionPreferencesInternal(publicKeyModel);
    }
    // case of external user with WKD keys
    if (publicKeyModel.isPGPExternalWithWKDKeys) {
        return extractEncryptionPreferencesExternalWithWKDKeys(publicKeyModel);
    }
    // case of external user without WKD keys
    return extractEncryptionPreferencesExternalWithoutWKDKeys(publicKeyModel);
};

export default extractEncryptionPreferences;
