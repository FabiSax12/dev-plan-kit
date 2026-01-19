import z from "zod"

export type ProjectData = z.infer<typeof Project._schemas.plainProjectSchema>;
export type ProjectStatus = z.infer<typeof Project._schemas.plainProjectSchema.shape.status>;
export type ProjectType = z.infer<typeof Project._schemas.plainProjectSchema.shape.project_type>;

export class Project {

    static readonly _schemas = {
        createProjectSchema: z.object({
            userId: z.string().uuid(),
            name: z.string().min(1).max(100),
            description: z.string().min(1).max(2000),
            status: z.enum(["planning", "in_development", "completed", "on_hold"]),
            projectType: z.enum(["personal", "work"]),
            productionUrl: z.string().url().optional(),
            repositoryUrl: z.string().url().optional(),
            techStack: z.array(z.string().min(1).max(50)).optional(),
            extraUrls: z.array(z.object({
                name: z.string().min(1).max(100),
                url: z.string().url(),
            })).optional(),
        }),

        updateProjectSchema: z.object({
            id: z.number().int().positive().or(z.string()),
            name: z.string().min(1).max(100).optional(),
            description: z.string().min(1).max(2000).optional(),
            status: z.enum(["planning", "in_development", "completed", "on_hold"]).optional(),
            projectType: z.enum(["personal", "work"]).optional(),
            productionUrl: z.string().url().optional(),
            repositoryUrl: z.string().url().optional(),
            techStack: z.array(z.string().min(1).max(50)).optional(),
            extraUrls: z.array(z.object({
                name: z.string().min(1).max(100),
                url: z.string().url(),
            })).optional(),
        }),

        plainProjectSchema: z.object({
            id: z.number().int().positive().or(z.string()),
            userId: z.string().uuid(),
            name: z.string().min(1).max(100),
            description: z.string().min(1).max(2000),
            status: z.enum(["planning", "in_development", "completed", "on_hold"]),
            project_type: z.enum(["personal", "work"]),
            production_url: z.string().url().optional(),
            repository_url: z.string().url().optional(),
            tech_stack: z.array(z.string().min(1).max(50)).optional(),
            extra_urls: z.array(z.object({
                name: z.string().min(1).max(100),
                url: z.string().url(),
            })),
            updated_at: z.string().datetime(),
            created_at: z.string().datetime(),
        }),
    };


    private id: ProjectData["id"]
    private name: string
    private description: string
    private status: ProjectStatus
    private projectType: ProjectType
    private url?: string
    private repoUrl?: string
    private techStack: string[]
    private extraUrls: { name: string; url: string }[]
    private updatedAt: Date
    private createdAt: Date

    constructor(data: ProjectData) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.status = data.status
        this.projectType = data.project_type
        this.url = data.production_url
        this.repoUrl = data.repository_url
        this.techStack = data.tech_stack || []
        this.extraUrls = data.extra_urls || []
        this.updatedAt = new Date(data.updated_at)
        this.createdAt = new Date(data.created_at)
    }

    getId() {
        return this.id
    }

    getName() {
        return this.name
    }

    getDescription() {
        return this.description
    }

    getStatus() {
        return this.status
    }

    getProjectType() {
        return this.projectType
    }

    getUrl() {
        return this.url
    }

    getRepoUrl() {
        return this.repoUrl
    }

    getTechStack() {
        return this.techStack
    }

    getExtraUrls() {
        return this.extraUrls
    }

    getUpdatedAt() {
        return this.updatedAt
    }

    getCreatedAt() {
        return this.createdAt
    }

    static fromJSONData(data: ProjectData): Project {
        return new Project({
            id: data.id,
            name: data.name,
            userId: data.userId,
            description: data.description,
            status: data.status,
            project_type: data.project_type,
            production_url: data.production_url,
            repository_url: data.repository_url,
            tech_stack: data.tech_stack || [],
            extra_urls: data.extra_urls || [],
            updated_at: data.updated_at,
            created_at: data.created_at,
        })
    }
}