import z from "zod"

// ============================================
// Type Exports
// ============================================
export type LearningRoadmapData = z.infer<typeof LearningRoadmap._schemas.plainRoadmapSchema>;
export type LearningPhaseData = z.infer<typeof LearningPhase._schemas.plainPhaseSchema>;
export type LearningItemData = z.infer<typeof LearningItem._schemas.plainItemSchema>;
export type LearningItemStatus = z.infer<typeof LearningItem._schemas.statusSchema>;

// ============================================
// LearningItem Domain Class
// ============================================
export class LearningItem {
    static readonly _schemas = {
        statusSchema: z.enum(["pending", "in_progress", "completed"]),

        createItemSchema: z.object({
            phase_id: z.coerce.number().int(),
            name: z.string().min(1).max(255),
            status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
            order_index: z.number().int().nonnegative().default(0),
        }),

        updateItemSchema: z.object({
            id: z.coerce.number().int(),
            name: z.string().min(1).max(255).optional(),
            status: z.enum(["pending", "in_progress", "completed"]).optional(),
            order_index: z.number().int().nonnegative().optional(),
        }),

        plainItemSchema: z.object({
            id: z.coerce.number().int(),
            phase_id: z.coerce.number().int(),
            name: z.string().min(1).max(255),
            status: z.enum(["pending", "in_progress", "completed"]),
            order_index: z.number().int(),
            created_at: z.string().datetime(),
        }),
    };

    private id: number
    private phaseId: number
    private name: string
    private status: LearningItemStatus
    private orderIndex: number
    private createdAt: Date

    constructor(data: LearningItemData) {
        this.id = data.id
        this.phaseId = data.phase_id
        this.name = data.name
        this.status = data.status
        this.orderIndex = data.order_index
        this.createdAt = new Date(data.created_at)
    }

    getId() { return this.id }
    getPhaseId() { return this.phaseId }
    getName() { return this.name }
    getStatus() { return this.status }
    getOrderIndex() { return this.orderIndex }
    getCreatedAt() { return this.createdAt }

    static fromJSONData(data: LearningItemData): LearningItem {
        return new LearningItem(data)
    }
}

// ============================================
// LearningPhase Domain Class
// ============================================
export class LearningPhase {
    static readonly _schemas = {
        createPhaseSchema: z.object({
            roadmap_id: z.coerce.number().int(),
            name: z.string().min(1).max(100),
            order_index: z.number().int().nonnegative().default(0),
        }),

        updatePhaseSchema: z.object({
            id: z.coerce.number().int(),
            name: z.string().min(1).max(100).optional(),
            order_index: z.number().int().nonnegative().optional(),
        }),

        plainPhaseSchema: z.object({
            id: z.coerce.number().int(),
            roadmap_id: z.coerce.number().int(),
            name: z.string().min(1).max(100),
            order_index: z.number().int(),
            created_at: z.string().datetime(),
        }),
    };

    private id: number
    private roadmapId: number
    private name: string
    private orderIndex: number
    private createdAt: Date
    private items: LearningItem[] = []

    constructor(data: LearningPhaseData) {
        this.id = data.id
        this.roadmapId = data.roadmap_id
        this.name = data.name
        this.orderIndex = data.order_index
        this.createdAt = new Date(data.created_at)
    }

    getId() { return this.id }
    getRoadmapId() { return this.roadmapId }
    getName() { return this.name }
    getOrderIndex() { return this.orderIndex }
    getCreatedAt() { return this.createdAt }
    getItems() { return this.items }

    setItems(items: LearningItem[]) {
        this.items = items.sort((a, b) => a.getOrderIndex() - b.getOrderIndex())
    }

    static fromJSONData(data: LearningPhaseData): LearningPhase {
        return new LearningPhase(data)
    }
}

// ============================================
// LearningRoadmap Domain Class
// ============================================
export class LearningRoadmap {
    static readonly _schemas = {
        createRoadmapSchema: z.object({
            user_id: z.string().uuid(),
            name: z.string().min(1).max(100),
            description: z.string().max(2000),
        }),

        updateRoadmapSchema: z.object({
            id: z.int(),
            name: z.string().min(1).max(100).optional(),
            description: z.string().max(2000).optional(),
        }),

        plainRoadmapSchema: z.object({
            id: z.int(),
            user_id: z.string().uuid(),
            name: z.string().min(1).max(100),
            description: z.string().nullable(),
            created_at: z.string().datetime(),
            updated_at: z.string().datetime(),
        }),
    };

    private id: number
    private userId: string
    private name: string
    private description: string | null
    private createdAt: Date
    private updatedAt: Date
    private phases: LearningPhase[] = []

    constructor(data: LearningRoadmapData) {
        this.id = data.id
        this.userId = data.user_id
        this.name = data.name
        this.description = data.description
        this.createdAt = new Date(data.created_at)
        this.updatedAt = new Date(data.updated_at)
    }

    getId() { return this.id }
    getUserId() { return this.userId }
    getName() { return this.name }
    getDescription() { return this.description }
    getCreatedAt() { return this.createdAt }
    getUpdatedAt() { return this.updatedAt }
    getPhases() { return this.phases }

    setPhases(phases: LearningPhase[]) {
        this.phases = phases.sort((a, b) => a.getOrderIndex() - b.getOrderIndex())
    }

    getProgress(): { completed: number; total: number; percentage: number } {
        let completed = 0
        let total = 0

        for (const phase of this.phases) {
            for (const item of phase.getItems()) {
                total++
                if (item.getStatus() === 'completed') completed++
            }
        }

        return {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
    }

    static fromJSONData(data: LearningRoadmapData): LearningRoadmap {
        return new LearningRoadmap(data)
    }
}
