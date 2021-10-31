import { getEmptyRoom } from "../../../../script/roomsService/roomsService"


export default async function findEmptyRoom(req, res) {
  
  const { method } = req;

  switch (method) {
    case "GET":

    try{
      const emptyRoom = await getEmptyRoom();
      
      res.status(200).json({ emptyRoom});
    }
    catch(e){
      res.status(400).json({error:e.toString()})
    }
      break;

    case "POST":
      return;
  }
}
