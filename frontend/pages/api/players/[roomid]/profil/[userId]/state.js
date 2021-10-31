import { getPlayerState } from "../../../../../../script/playersService/playersService"
//get player profil and square
export default async function playerState(req, res) {
  const { method, query, body } = req;

  if (method) {
    if (method === "GET" && query.roomid && query.userId) {

        try{
            const playerState = await getPlayerState(query.roomid, query.userId);
            res.status(200).json({playerState});
        }
      catch(e){
          res.status(400).json({error:e.toString()})
      }
    }
  }
}
//test Data
//http://localhost:3000/api/rooms/length?roomid=Rb48c9a4
