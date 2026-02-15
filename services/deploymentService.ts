import { SiteConfig, GenerationResult } from '../types';

export interface DeploymentPayload {
  config: SiteConfig;
  result: GenerationResult;
  timestamp: string;
}

export interface DeploymentResponse {
  success: boolean;
  projectId: string;
  url: string;
  customDomain?: string;
  message: string;
}

/**
 * Send site data and configuration to backend for deployment
 * Returns unique project ID and public URL
 */
export const deployProject = async (
  config: SiteConfig,
  result: GenerationResult
): Promise<DeploymentResponse> => {
  const payload: DeploymentPayload = {
    config,
    result,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch('/api/projects/deploy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Deployment failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data as DeploymentResponse;
  } catch (error) {
    console.error('Deployment service error:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to deploy project'
    );
  }
};

/**
 * Get deployment status by project ID
 */
export const getDeploymentStatus = async (projectId: string) => {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get deployment status error:', error);
    throw error;
  }
};
