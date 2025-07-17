export interface Tag {
    id: string;
    name: string;
    color: string;
    isPredefined: boolean;
}

export interface CreateTagDto {
    name: string;
    color: string;
    isPredefined?: boolean;
}
