import z from "zod";
import { ConversationMessage } from "./ConversationMessage";

export type AIConversationData = z.infer<typeof AIConversation._schemas.plainConversationSchema>;

export class AIConversation {
    static readonly _schemas = {
        createConversationSchema: z.object({
            title: z.string().min(1).max(255),
            userId: z.uuid(),
            metadata: z.object().optional(),
            project_id: z.number().optional(),
            idea_id: z.number().optional(),
            initial_messages: ConversationMessage._schemas.createMessageSchema.array().optional()
        }),

        updateConversationSchema: z.object({
            title: z.string().min(1).max(255).optional(),
            userId: z.uuid().optional(),
            metadata: z.object().optional(),
        }),

        plainConversationSchema: z.object({
            id: z.uuid(),
            title: z.string().min(1).max(255),
            userId: z.uuid(),
            metadata: z.object(),
            createdAt: z.iso.datetime(),
            updatedAt: z.iso.datetime(),
            project_id: z.number().optional(),
            idea_id: z.number().optional(),
        }),
    };

    constructor(
        private id: string,
        private title: string,
        private userId: string,
        private metadata: Record<string, any> = {},
        private createdAt: Date,
        private updatedAt: Date,
        private projectId?: number,
        private ideaId?: number,
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

    getProjectId() {
        return this.projectId;
    }

    getIdeaId() {
        return this.ideaId;
    }

    static fromJSONData(data: AIConversationData): AIConversation {
        return new AIConversation(
            data.id,
            data.title,
            data.userId,
            data.metadata,
            new Date(data.createdAt),
            new Date(data.updatedAt),
            data.project_id,
            data.idea_id,
        );
    }
}