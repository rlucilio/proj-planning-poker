export interface IRoom {
    roomName: string;
    user?: {
        uuid?: string;
        socketID?: string;
        name?: string;
    };
    task?: {
        id: string
    };
}
