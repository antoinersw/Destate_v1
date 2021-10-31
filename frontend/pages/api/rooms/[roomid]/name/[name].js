//get square by name
import { getSquareByName } from "../../../../../script/roomsService/roomsService";

export default async function profil(req, res) {
  const { method, query, body } = req;

  if (method) {
    if (method === "GET" && query.roomid && query.name) {
      try {
        const square = await getSquareByName(query.roomid, query.name);
        res.status(200).json({ square });
      } catch (e) {
        res.status(400).json({ error: e.toString() });
      }
    }
  }
}
//test Data
//http://localhost:3000/api/rooms/length?roomid=Rb48c9a4
