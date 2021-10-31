//get square by pos
import { getSquareByPos } from "../../../../../script/roomsService/roomsService";

export default async function profil(req, res) {
  const { method, query, body } = req;

  if (method) {
    if (method === "GET" && query.roomid && query.pos) {
      try {
        const square = await getSquareByPos(query.roomid, Number(query.pos));
        res.status(200).json({ square });
      } catch (e) {
        res.status(400).json({ error: e.toString() });
      }
    }
  }
}
//test Data
//http://localhost:3000/api/rooms/length?roomid=Rb48c9a4
