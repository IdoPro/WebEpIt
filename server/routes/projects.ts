import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Simulated database (replace with MongoDB/PostgreSQL)
interface StoredProject {
  projectId: string;
  config: any;
  files: any[];
  url: string;
  customDomain: string;
  createdAt: string;
  status: 'pending' | 'active' | 'failed';
}

const projects: Map<string, StoredProject> = new Map();

/**
 * POST /api/projects/deploy
 * Receives site data and saves it, returns unique URL
 * Request body should contain:
 * - config: SiteConfig object with all user input data
 * - result: GenerationResult with generated files
 * - timestamp: ISO timestamp of deployment
 */
router.post('/deploy', (req: Request, res: Response) => {
  try {
    const { config, result, timestamp } = req.body;

    // Validate required fields
    if (!config) {
      return res.status(400).json({
        success: false,
        message: 'Missing site configuration',
      });
    }

    // Generate unique project ID
    const projectId = uuidv4();
    
    // Create custom domain slug from deceased name or site name
    const baseSlug = (config.deceasedName || config.appName || config.name || 'memorial')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 30);
    
    const uniqueSlug = `${baseSlug}-${projectId.substring(0, 6)}`;
    const customDomain = `${uniqueSlug}.memorial-cloud.com`;
    const publicUrl = `https://${customDomain}`;

    // Store project data with all configuration
    const storedProject: StoredProject = {
      projectId,
      config: {
        // Basic Info
        name: config.name || '',
        prototype: config.prototype || '',
        language: config.language || 'en',
        description: config.description || '',
        contactEmail: config.contactEmail || '',
        
        // Colors & Design
        primaryColor: config.primaryColor || '#000000',
        secondaryColor: config.secondaryColor || '#ffffff',
        
        // Memorial Specific Fields
        deceasedName: config.deceasedName || '',
        dateOfPassing: config.dateOfPassing || '',
        hebrewDate: config.hebrewDate || '',
        relationship: config.relationship || '',
        spiritualText: config.spiritualText || '',
        appName: config.appName || '',
        yearsLife: config.yearsLife || '',
        hebrewYears: config.hebrewYears || '',
        motto: config.motto || '',
        milestones: config.milestones || [],
        memorialImage: config.memorialImage || '',
        
        // Additional configs
        features: config.features || [],
        mongodbUri: config.mongodbUri || '',
        backblazeKey: config.backblazeKey || '',
      },
      files: result?.files || [],
      url: publicUrl,
      customDomain,
      createdAt: timestamp || new Date().toISOString(),
      status: 'active',
    };

    projects.set(projectId, storedProject);

    // Log for debugging
    console.log(`✅ Project deployed: ${projectId}`);
    console.log(`📍 Custom Domain: ${customDomain}`);
    console.log(`📍 Public URL: ${publicUrl}`);
    console.log(`👤 Deceased Name: ${config.deceasedName || 'N/A'}`);
    console.log(`🌐 Language: ${config.language || 'en'}`);

    return res.status(201).json({
      success: true,
      projectId,
      url: publicUrl,
      customDomain,
      message: `Site deployed successfully to ${customDomain}`,
    });
  } catch (error) {
    console.error('Deployment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Deployment failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/projects/:projectId
 * Retrieve project data by ID
 */
router.get('/:projectId', (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = projects.get(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve project',
    });
  }
});

/**
 * DELETE /api/projects/:projectId
 * Remove project
 */
router.delete('/:projectId', (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    if (!projects.has(projectId)) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    projects.delete(projectId);

    return res.status(200).json({
      success: true,
      message: 'Project deleted',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete project',
    });
  }
});

export default router;
