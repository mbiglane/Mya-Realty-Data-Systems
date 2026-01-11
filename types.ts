
export enum Status {
    Operational = 'OPERATIONAL',
    Warning = 'WARNING',
    Fixed = 'FIXED',
    NeedsAttention = 'NEEDS ATTENTION',
}

export enum Priority {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
}

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'pending' | 'blocked';
export type MyaPersona = 'front_desk' | 'transaction_desk' | 'analyst_desk' | 'creative_director';

export type Tab = 'Overview' | 'Interactive Book' | 'Sandbox' | 'Marketing Studio' | 'Collaboration Room' | 'Business ROI' | 'User Manual' | 'Roadmap' | 'Beta Admin' | 'System Manual' | 'Technical Health';

export type TourStepId = 'welcome' | 'personas' | 'curriculum' | 'sandbox' | 'marketing' | 'admin' | 'finish';

export interface TourState {
    isActive: boolean;
    currentStep: TourStepId;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    joinedAt: string;
}

export interface AppConfig {
    title: string;
    brandPrimary: string;
    brandSecondary: string;
}

export interface StatusItem {
    name: string;
    status: Status;
    details?: string;
}

export interface ActionItem {
    priority: Priority;
    title: string;
    details: string;
    time: string;
}

export interface TechStackItem {
    name: string;
    version?: string;
    status: '✅' | '⚠️';
}

export interface PerformanceMetric {
    name: string;
    value: string;
}

export interface FeatureStatus {
    name: string;
    completeness: number;
}

export interface MaintenanceTask {
    period: string;
    tasks: string[];
}

export interface ChatMessage {
    role: 'user' | 'model' | 'system' | 'tool';
    text: string;
    audio?: string;
    image?: string;
    groundingSources?: { title: string; uri: string }[];
}

export interface FeedbackItem {
    id: string;
    user: string;
    type: 'bug' | 'feature' | 'general';
    message: string;
    date: string;
    status: 'new' | 'reviewed' | 'resolved';
}

export interface LogEntry {
    id: string;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    source: string;
    message: string;
}

export interface BetaConfig {
    isLive: boolean;
    maxUsers: number;
    knowledgeBase?: string;
    activePersona: MyaPersona;
    features: {
        voiceAssistant: boolean;
        marketAnalysis: boolean;
        negotiationSim: boolean;
        valuationTool: boolean;
        visionAudit: boolean;
        marketingGen: boolean;
    };
    apiIntegration: {
        enabled: boolean;
        endpointUrl: string;
        apiKey: string;
    };
    safetyLevel: 'strict' | 'standard' | 'relaxed';
}

export interface ReportData {
    executiveSummary: {
        status: Status;
        lastAnalysis: string;
        overallHealth: number;
    };
    systemStatus: {
        operational: StatusItem[];
        issues: StatusItem[];
    };
    techArchitecture: {
        frontendStack: TechStackItem[];
        backendIntegration: TechStackItem[];
    };
    security: {
        posture: number;
    };
    features: {
        core: FeatureStatus[];
        advanced: FeatureStatus[];
        admin: FeatureStatus[];
    };
    performance: {
        frontend: PerformanceMetric[];
        database: PerformanceMetric[];
    };
    ux: {
        strengths: string[];
    };
    aiSystem: {
        features: string[];
    };
    scalability?: {
        projections: string[];
    };
    codeQuality?: {
        strengths: string[];
    };
    testing?: {
        strategy: string[];
    };
    mobile?: {
        features: string[];
    };
    privacy?: {
        features: string[];
    };
    actionItems: ActionItem[];
    successMetrics: {
        technical: {
            performance: number;
        };
    };
    businessReadiness: {
        featureCompleteness: number;
    };
    roadmap: {
        phase2: string[];
        phase3: string[];
    };
    maintenance: MaintenanceTask[];
    conclusion: {
        title: string;
        summary: string;
        achievements: string[];
        recommendation: string;
    };
}
