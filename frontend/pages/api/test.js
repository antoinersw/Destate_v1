import dbConnect from "../../script/utils/dbConnect.mjs";

dbConnect()

export default async (req, res)=>{
    res.json({test:"test"})
}