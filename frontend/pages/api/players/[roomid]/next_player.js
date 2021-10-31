//get first player
import { getNextPlayer } from "../../../../script/playersServices/playersServices"
//get player profil
export default async function profil(req, res) {
  const { method, query, body } = req;

  if (method) {
    if (method === "GET" && query.roomid) {

        try{

            const player = await getNextPlayer(query.roomid);
            res.status(200).json({ player});
        }
      catch(e){
          res.status(400).json({error:e.toString()})
      }
    }
  }
}
//test Data
//http://localhost:3000/api/rooms/length?roomid=Rb48c9a4
