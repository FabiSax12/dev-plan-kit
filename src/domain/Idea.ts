import z from "zod";

export type IdeaData = z.infer<typeof Idea._schemas.plainIdeaSchema>;

export class Idea {

    static readonly _schemas = {
        createIdeaSchema: z.object({
            title: z.string().min(1).max(255),
            description: z.string().min(1).max(5000),
            user_id: z.string().uuid(),
        }),

        updateIdeaSchema: z.object({
            title: z.string().min(1).max(255).optional(),
            description: z.string().min(1).max(5000).optional(),
        }),

        plainIdeaSchema: z.object({
            id: z.string().uuid(),
            title: z.string().min(1).max(255),
            description: z.string().min(1).max(5000),
            user_id: z.string().uuid(),
            created_at: z.string().datetime(),
        }),
    };

    constructor(
        private id: string,
        private title: string,
        private description: string,
        private createdAt: Date,
    ) { }

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    static fromJSONData(data: IdeaData): Idea {
        return new Idea(
            data.id,
            data.title,
            data.description,
            new Date(data.created_at)
        );
    }
}

