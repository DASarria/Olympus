import { Room } from "@/models/Room";
import axios from "axios";

const API_URL='/rooms';

export const getRoomById = (roomId:string)=> axios.get<Room>(`${API_URL}/id/${roomId}`);

export const getRoomsByBuilding = (building:string)=> axios.get<Room[]>(`${API_URL}/building/${building}`);

export const getRoomByCapacity = (capacity:number)=> axios.get<Room[]>(`${API_URL}/capacity/${capacity}`);

export const getAll = () => axios.get<Room[]>(`${API_URL}`);

export const createRoom = (room:Room) => axios.post<Room>(`${API_URL}`); 

export const updateRoom = (roomId:string,room:Room) => axios.put<Room>(`${API_URL}/${roomId}`); 

export const deleteRoom = (roomId:string) => axios.delete<boolean>(`${API_URL}/${roomId}`); 