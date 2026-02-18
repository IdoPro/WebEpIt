/**
 * Server Integration Service
 * Helper functions for the React client to communicate with the SiteForg server
 */

export const SERVER_URL = 
  (typeof window !== 'undefined' && (window as any).VITE_SERVER_URL) ||
  ((import.meta as any).env?.VITE_SERVER_URL) ||
  'http://localhost:5000';

// Store credentials in localStorage
export const storeClientCredentials = (clientId: string, uniqueKey: string) => {
  localStorage.setItem('siteforg_clientId', clientId);
  localStorage.setItem('siteforg_uniqueKey', uniqueKey);
};

export const getClientCredentials = () => {
  return {
    clientId: localStorage.getItem('siteforg_clientId'),
    uniqueKey: localStorage.getItem('siteforg_uniqueKey'),
  };
};

export const clearClientCredentials = () => {
  localStorage.removeItem('siteforg_clientId');
  localStorage.removeItem('siteforg_uniqueKey');
};

/**
 * Create request headers with authentication
 */
const getAuthHeaders = (clientId?: string, uniqueKey?: string) => {
  const creds = getClientCredentials();
  const id = clientId || creds.clientId;
  const key = uniqueKey || creds.uniqueKey;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (id && key) {
    headers['x-client-id'] = id;
    headers['x-unique-key'] = key;
  }

  return headers;
};

/**
 * Create a new client website
 * This is called during Step 2 (after user fills in the form)
 */
export const createClientWebsite = async (
  clientName: string,
  email: string,
  websiteType: string,
  website: { title: string; description: string; content: any }
) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/clients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        clientName,
        email,
        websiteType,
        website,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    // Store credentials for future API calls
    storeClientCredentials(
      data.data.clientId,
      data.data.uniqueKey
    );

    return data.data;
  } catch (error) {
    console.error('Failed to create website:', error);
    throw error;
  }
};

/**
 * Get client website details (requires auth)
 */
export const getClientWebsite = async (clientId?: string, uniqueKey?: string) => {
  try {
    const creds = getClientCredentials();
    const id = clientId || creds.clientId;

    if (!id) throw new Error('Client ID not found');

    const response = await fetch(`${SERVER_URL}/api/clients/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(clientId, uniqueKey),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error('Failed to fetch website:', error);
    throw error;
  }
};

/**
 * Get public website (no auth required)
 */
export const getPublicWebsite = async (serialNumberOrDomain: string) => {
  try {
    const response = await fetch(
      `${SERVER_URL}/api/clients/public/${serialNumberOrDomain}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error('Failed to fetch public website:', error);
    throw error;
  }
};

/**
 * Update client website
 */
export const updateClientWebsite = async (
  website: { title: string; description: string; content: any },
  clientId?: string,
  uniqueKey?: string
) => {
  try {
    const creds = getClientCredentials();
    const id = clientId || creds.clientId;

    if (!id) throw new Error('Client ID not found');

    const response = await fetch(`${SERVER_URL}/api/clients/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(clientId, uniqueKey),
      body: JSON.stringify({ website }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error('Failed to update website:', error);
    throw error;
  }
};

/**
 * Upload media file to Backblaze
 */
export const uploadMedia = async (
  file: File,
  clientId?: string,
  uniqueKey?: string
) => {
  try {
    const creds = getClientCredentials();
    const id = clientId || creds.clientId;

    if (!id) throw new Error('Client ID not found');

    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    const authCreds = getClientCredentials();
    const authClientId = clientId || authCreds.clientId;
    const authUniqueKey = uniqueKey || authCreds.uniqueKey;

    if (authClientId && authUniqueKey) {
      headers['x-client-id'] = authClientId;
      headers['x-unique-key'] = authUniqueKey;
    }

    const response = await fetch(`${SERVER_URL}/api/media/${id}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error('Failed to upload media:', error);
    throw error;
  }
};

/**
 * Get all media for client
 */
export const getClientMedia = async (clientId?: string, uniqueKey?: string) => {
  try {
    const creds = getClientCredentials();
    const id = clientId || creds.clientId;

    if (!id) throw new Error('Client ID not found');

    const response = await fetch(`${SERVER_URL}/api/media/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(clientId, uniqueKey),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error('Failed to fetch media:', error);
    throw error;
  }
};

/**
 * Delete media
 */
export const deleteMedia = async (
  assetId: string,
  clientId?: string,
  uniqueKey?: string
) => {
  try {
    const creds = getClientCredentials();
    const id = clientId || creds.clientId;

    if (!id) throw new Error('Client ID not found');

    const response = await fetch(`${SERVER_URL}/api/media/${id}/${assetId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(clientId, uniqueKey),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error('Failed to delete media:', error);
    throw error;
  }
};

/**
 * Delete client account
 */
export const deleteClientAccount = async (
  clientId?: string,
  uniqueKey?: string
) => {
  try {
    const creds = getClientCredentials();
    const id = clientId || creds.clientId;

    if (!id) throw new Error('Client ID not found');

    const response = await fetch(`${SERVER_URL}/api/clients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(clientId, uniqueKey),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    // Clear credentials after deletion
    clearClientCredentials();

    return data;
  } catch (error) {
    console.error('Failed to delete account:', error);
    throw error;
  }
};

export default {
  createClientWebsite,
  getClientWebsite,
  getPublicWebsite,
  updateClientWebsite,
  uploadMedia,
  getClientMedia,
  deleteMedia,
  deleteClientAccount,
  storeClientCredentials,
  getClientCredentials,
  clearClientCredentials,
};
