import axios from 'axios';
import { SiteConfig } from '@/types';
import serverIntegrationService from './serverIntegrationService';

export interface DeploymentResponse {
  success: boolean;
  projectId?: string;
  url?: string;
  customDomain?: string;
  serialNumber?: string;
  uniqueKey?: string;
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
      // Validate required fields
      if (!config.email || !config.email.trim()) {
        return {
          success: false,
          message: 'Email address is required to publish the website',
          error: 'Missing email',
        };
      }

      if (!config.projectName || !config.projectName.trim()) {
        return {
          success: false,
          message: 'Project name is required to publish the website',
          error: 'Missing project name',
        };
      }

      // Map SiteConfig to our server's client creation format
      // לעכשיו הDefault הוא memorial, אבל אפשר להוסיף לוגיקה שתבחר את סוג האתר לפי config.prototypeType
      const websiteData = {
        clientName: config.projectName || config.deceasedName || 'Unnamed Project',
        email: config.email.trim(),
        websiteType: config.prototypeType?.toLowerCase() === 'memorial' ? 'memorial' : 
                     config.prototypeType?.toLowerCase() === 'portfolio' ? 'portfolio' :
                     config.prototypeType?.toLowerCase() === 'ecommerce' ? 'business' : 'memorial',
        website: {
          title: config.projectName || config.deceasedName || 'My Website',
          description: config.description || 'Created with SiteForg',
          content: {
            ...config,
            generationResult: result,
          },
        },
      };

      // Use the serverIntegrationService to create the website
      const clientData = await serverIntegrationService.createClientWebsite(
        websiteData.clientName,
        websiteData.email,
        websiteData.websiteType,
        websiteData.website
      );

      return {
        success: true,
        projectId: clientData.clientId,
        uniqueKey: clientData.uniqueKey,
        url: clientData.url || clientData.websiteUrl,
        customDomain: clientData.customDomain || clientData.serialNumber,
        message: 'Project deployed successfully',
      };
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
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        error: String(error),
      };
    }
  },

  /**
   * Fetch project details by ID (clientId)
   * @param clientId - The client/project ID
   * @returns Project data
   */
  async getProject(clientId: string): Promise<any> {
    try {
      const data = await serverIntegrationService.getClientWebsite(clientId);
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Failed to fetch project:', error);
      throw error;
    }
  },

  /**
   * Delete a project (client account)
   * @param clientId - The client/project ID
   */
  async deleteProject(clientId: string): Promise<void> {
    try {
      await serverIntegrationService.deleteClientAccount(clientId);
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
