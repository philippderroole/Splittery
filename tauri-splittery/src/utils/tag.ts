export interface Tag {
    id: string;
    name: string;
    color: string;
    type: TagType;
}

export type TagType = "AllTag" | "UserTag" | "CustomTag";

export interface CreateTagDto {
    name: string;
    color: string;
    type: TagType;
}

export interface EditTagDto {
    name: string;
    color: string;
    isPredefined?: boolean;
}
