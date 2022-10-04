import { IVote } from './votes';

export interface IUser {
    idSocket: string;
    name: string;
    votes?: IVote[];
    uuid?: string;
}
