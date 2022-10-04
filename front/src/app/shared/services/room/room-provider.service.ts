import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IGetListTasksResponse, IGetRoomResponse, IGetUserResponse, IGetLastTask, ICreateRoomRequest, IGetHistoryTask } from './models/provider-room-responses';

@Injectable()
export class RoomProviderService {

  constructor(
    private http: HttpClient
  ) { }

  getListTasks(room: string): Observable<IGetListTasksResponse[]> {
    return this.http.get<IGetListTasksResponse[]>(`${environment.api.baseUrl}${environment.api.tasks}/${room}`);
  }

  getHistoryTasks(room: string): Observable<IGetHistoryTask[]> {
    return this.http.get<IGetHistoryTask[]>(`${environment.api.baseUrl}${environment.api.tasks}/${room}/history`);
  }

  getRoom(room: string, user?: string): Observable<IGetRoomResponse> {
    return this.http
    .get<IGetRoomResponse>(`${environment.api.baseUrl}${environment.api.room}/find/${room}${user ? `?user=${user}` : ''}`);
  }

  getUsers(room: string): Observable<IGetUserResponse[]> {
    return this.http.get<IGetUserResponse[]>(`${environment.api.baseUrl}${environment.api.user}/${room}`);
  }

  getLastTask(room: string): Observable<IGetLastTask>{
    return this.http.get<IGetLastTask>(`${environment.api.baseUrl}${environment.api.tasks}/${room}/last`);
  }

  createRoom(createRoom: ICreateRoomRequest): Observable<IGetRoomResponse>{
    return this.http.post<IGetRoomResponse>(`${environment.api.baseUrl}${environment.api.room}`, createRoom);
  }

  getObservers(room: string): Observable<{idSocket: string}[]> {
    return this.http.get<{idSocket: string}[]>(`${environment.api.baseUrl}${environment.api.room}/${room}/observers`);
  }
}
