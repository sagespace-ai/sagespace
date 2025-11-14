/**
 * Integration Registry - Central definition of all available integrations
 */

export type IntegrationCategory = 'productivity' | 'media' | 'data' | 'workflow'
export type IntegrationType = 
  | 'notion' | 'github' | 'google-drive' | 'jira' | 'slack'
  | 'spotify' | 'youtube' | 'podcast'
  | 'web-search' | 'pdf' | 'csv'
  | 'zapier' | 'make' | 'webhook'

export interface Integration {
  id: IntegrationType
  name: string
  category: IntegrationCategory
  description: string
  icon: string
  authType: 'oauth' | 'api-key' | 'none'
  requiresTier: 'free' | 'explorer' | 'voyager' | 'astral' | 'oracle'
  riskLevel: 'low' | 'medium' | 'high'
  capabilities: string[]
  disabled: boolean // Per Charter: disabled by default
}

export const INTEGRATION_REGISTRY: Integration[] = [
  // Productivity
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    description: 'Access and create Notion pages',
    icon: '📝',
    authType: 'oauth',
    requiresTier: 'voyager',
    riskLevel: 'medium',
    capabilities: ['read', 'write', 'search'],
    disabled: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'productivity',
    description: 'Access repositories and issues',
    icon: '🐙',
    authType: 'oauth',
    requiresTier: 'voyager',
    riskLevel: 'high',
    capabilities: ['read', 'write', 'execute'],
    disabled: true,
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'productivity',
    description: 'Access files and folders',
    icon: '📁',
    authType: 'oauth',
    requiresTier: 'astral',
    riskLevel: 'medium',
    capabilities: ['read', 'write', 'search'],
    disabled: true,
  },
  {
    id: 'jira',
    name: 'Jira',
    category: 'productivity',
    description: 'Manage tasks and issues',
    icon: '📋',
    authType: 'api-key',
    requiresTier: 'oracle',
    riskLevel: 'medium',
    capabilities: ['read', 'write'],
    disabled: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'productivity',
    description: 'Send messages and notifications',
    icon: '💬',
    authType: 'oauth',
    requiresTier: 'oracle',
    riskLevel: 'high',
    capabilities: ['read', 'write'],
    disabled: true,
  },
  
  // Media (Spotify already implemented and enabled)
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'media',
    description: 'Search and play music',
    icon: '🎵',
    authType: 'oauth',
    requiresTier: 'free',
    riskLevel: 'low',
    capabilities: ['read', 'search'],
    disabled: false, // Already working
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'media',
    description: 'Educational content only',
    icon: '📺',
    authType: 'api-key',
    requiresTier: 'explorer',
    riskLevel: 'low',
    capabilities: ['read', 'search'],
    disabled: true,
  },
  {
    id: 'podcast',
    name: 'Podcast RSS',
    category: 'media',
    description: 'Subscribe to podcast feeds',
    icon: '🎙️',
    authType: 'none',
    requiresTier: 'free',
    riskLevel: 'low',
    capabilities: ['read'],
    disabled: true,
  },
  
  // Data
  {
    id: 'web-search',
    name: 'Web Search',
    category: 'data',
    description: 'Search the web for information',
    icon: '🔍',
    authType: 'api-key',
    requiresTier: 'voyager',
    riskLevel: 'medium',
    capabilities: ['search'],
    disabled: true,
  },
  {
    id: 'pdf',
    name: 'PDF Processing',
    category: 'data',
    description: 'Extract text from PDFs',
    icon: '📄',
    authType: 'none',
    requiresTier: 'explorer',
    riskLevel: 'low',
    capabilities: ['read', 'parse'],
    disabled: true,
  },
  {
    id: 'csv',
    name: 'CSV/Excel',
    category: 'data',
    description: 'Parse spreadsheet data',
    icon: '📊',
    authType: 'none',
    requiresTier: 'free',
    riskLevel: 'low',
    capabilities: ['read', 'parse'],
    disabled: true,
  },
  
  // Workflow
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'workflow',
    description: 'Connect to 1000+ apps',
    icon: '⚡',
    authType: 'api-key',
    requiresTier: 'oracle',
    riskLevel: 'high',
    capabilities: ['execute', 'trigger'],
    disabled: true,
  },
  {
    id: 'make',
    name: 'Make.com',
    category: 'workflow',
    description: 'Visual automation platform',
    icon: '🔧',
    authType: 'api-key',
    requiresTier: 'oracle',
    riskLevel: 'high',
    capabilities: ['execute', 'trigger'],
    disabled: true,
  },
  {
    id: 'webhook',
    name: 'Custom Webhook',
    category: 'workflow',
    description: 'HTTP webhooks',
    icon: '🔗',
    authType: 'api-key',
    requiresTier: 'celestial',
    riskLevel: 'high',
    capabilities: ['execute'],
    disabled: true,
  },
]

export class IntegrationManager {
  /**
   * Check if user has access to an integration based on tier
   */
  static hasAccess(integrationId: IntegrationType, userTier: string): boolean {
    const integration = INTEGRATION_REGISTRY.find(i => i.id === integrationId)
    if (!integration) return false
    
    // Check if disabled per Charter
    if (integration.disabled) return false
    
    const tierLevels = ['free', 'explorer', 'voyager', 'astral', 'oracle', 'celestial']
    const requiredLevel = tierLevels.indexOf(integration.requiresTier)
    const userLevel = tierLevels.indexOf(userTier)
    
    return userLevel >= requiredLevel
  }
  
  /**
   * Get all integrations available to user
   */
  static getAvailableIntegrations(userTier: string): Integration[] {
    return INTEGRATION_REGISTRY.filter(integration => 
      this.hasAccess(integration.id, userTier)
    )
  }
  
  /**
   * Validate integration request against ISO 42001 compliance
   */
  static async validateIntegrationUse(params: {
    integrationId: IntegrationType
    agentId: string
    userId: string
    action: string
    data: any
  }): Promise<{ approved: boolean; reason?: string }> {
    const integration = INTEGRATION_REGISTRY.find(i => i.id === params.integrationId)
    if (!integration) {
      return { approved: false, reason: 'Integration not found' }
    }
    
    // Check if action is allowed
    if (!integration.capabilities.includes(params.action)) {
      return { approved: false, reason: `Action '${params.action}' not allowed for ${integration.name}` }
    }
    
    // High-risk integrations require additional validation
    if (integration.riskLevel === 'high') {
      // Check for sensitive data
      const dataStr = JSON.stringify(params.data).toLowerCase()
      if (dataStr.includes('password') || dataStr.includes('secret') || dataStr.includes('token')) {
        return { approved: false, reason: 'Cannot send sensitive data through high-risk integration' }
      }
    }
    
    return { approved: true }
  }
}
