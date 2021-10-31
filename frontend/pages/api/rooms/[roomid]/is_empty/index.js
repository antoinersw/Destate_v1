import { isRoomEmpty } from "../../../../../script/roomsService/roomsService"

export default async function length(req, res) {
  const { method, query, body } = req;

  if (method) {
    if (method === "GET" && query.roomid) {
      const isEmpty = await isRoomEmpty(query.roomid);
      res.status(200).json({ isEmpty });
    }
  }
}
//test Data
//http://localhost:3000/api/rooms/length?roomid=Rb48c9a4
