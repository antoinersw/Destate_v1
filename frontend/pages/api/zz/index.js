import { getRooms } from "../../../script/roomsService/roomsService";

export default async (req, res) => {
  const { method, query, body } = req;
  if (method === "GET") {
    try {
      const allRooms = await getRooms();
      res.status(200).json({ allRooms });
    } catch (e) {
      res.status(400).json({ notCool: e.toString() });
      console.log(e);
    }
  }
};
