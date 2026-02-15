import axios from 'axios';
import { SiteConfig } from '@/types';

export interface DeploymentResponse {
  success: boolean;
  projectId?: string;
  url?: string;
  customDomain?: string;
  message: string;
  error?: string;
}

/**
 * Service for handling project deployment to the server
 */
export const projectService = {
  /**
   * Deploy a new project to the server
   * @param config - The site configuration
   * @param result - The generation result with files
   * @returns Deployment response with projectId and URL
   */
  async deployProject(
    config: SiteConfig,
    result: any
  ): Promise<DeploymentResponse> {
    try {
      const response = await axios.post<DeploymentResponse>(
        '/api/projects/deploy',
        {
          config,
          result,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Deployment error:', error);
      
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: error.response?.data?.message || 'Deployment failed',
          error: error.message,
        };
      }

      return {
        success: false,
        message: 'An unexpected error occurred',
        error: String(error),
      };
    }
  },

  /**
   * Fetch project details by ID
   * @param projectId - The project ID
   * @returns Project data
   */
  async getProject(projectId: string): Promise<any> {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch project:', error);
      throw error;
    }
  },

  /**
   * Delete a project
   * @param projectId - The project ID
   */
  async deleteProject(projectId: string): Promise<void> {
    try {
      await axios.delete(`/api/projects/${projectId}`);
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  },

  /**
   * Copy project URL to clipboard
   * @param url - The URL to copy
   */
  async copyToClipboard(url: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  },
};

export default projectService;
