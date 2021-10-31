import { getRoomCapacityValidation } from "../../../../../script/roomsService/roomsService";

export default async function length(req, res) {
  const { method, query, body } = req;

  if (method) {
    if (method === "GET" && query.roomid) {
      const room = await getRoomCapacityValidation(query.roomid);
      res.status(200).json({ ismMaxed: room });
    }
  }
}
