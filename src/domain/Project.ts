export type ProjectStatus = "planning" | "in-development" | "completed" | "on-hold"
export type ProjectType = "personal" | "client"

export interface ProjectData {
    id: string
    name: string
    description: string
    status: ProjectStatus
    project_type: ProjectType
    production_url?: string
    repository_url?: string
    tech_stack: string[]
    updated_at: string
}

export class Project {
  private id: string
  private name: string
  private description: string
  private status: ProjectStatus
  private projectType: ProjectType
  private url?: string
  private repoUrl?: string
  private techStack: string[]
  private updatedAt: string

    constructor(data: {
        id: string
        name: string
        description: string
        status: ProjectStatus
        projectType: ProjectType
        url?: string
        repoUrl?: string
        techStack: string[]
        updatedAt: string
    }) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.status = data.status
        this.projectType = data.projectType
        this.url = data.url
        this.repoUrl = data.repoUrl
        this.techStack = data.techStack
        this.updatedAt = data.updatedAt
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

    getUpdatedAt() {
        return this.updatedAt
    }
}