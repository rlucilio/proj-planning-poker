import { EventsEmmiterSocket } from '../../../events-emmiter';

export interface IConnectRoomResult {
    event: EventsEmmiterSocket;
    msg: string;
    user: string;
    uuid?: string;
}
