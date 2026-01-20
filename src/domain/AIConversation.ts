import z from "zod";

export type AIConversationData = z.infer<typeof AIConversation._schemas.plainConversationSchema>;

export class AIConversation {
    static readonly _schemas = {
        createConversationSchema: z.object({
            id: z.string().uuid(),
            title: z.string().min(1).max(255),
            userId: z.string().uuid(),
            metadata: z.object({}).passthrough(),
        }),

        updateConversationSchema: z.object({
            title: z.string().min(1).max(255).optional(),
            userId: z.string().uuid(),
            metadata: z.object({}).passthrough(),
        }),

        plainConversationSchema: z.object({
            id: z.string().uuid(),
            title: z.string().min(1).max(255),
            userId: z.string().uuid(),
            metadata: z.object({}).passthrough(),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
        }),
    };

    constructor(
        private id: string,
        private title: string,
        private userId: string,
        private metadata: Record<string, any> = {},
        private createdAt: Date,
        private updatedAt: Date,
    ) { }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }

    getUserId() {
        return this.userId;
    }

    getMetadata() {
        return this.metadata;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getUpdatedAt() {
        return this.updatedAt;
    }

    static fromJSONData(data: AIConversationData): AIConversation {
        return new AIConversation(
            data.id,
            data.title,
            data.userId,
            data.metadata,
            new Date(data.createdAt),
            new Date(data.updatedAt),
        );
    }
}