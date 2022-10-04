import { ITaskRoom } from './task-room';
import { IUser } from './user';
import { IRoomSettings } from './room-settings';
import { IObserver } from './observer';

export interface IRoom {
    name: string;
    description: string;
    tasks: ITaskRoom[];
    users: IUser[];
    observers: IObserver[];
    settingsRoom?: IRoomSettings;
}
