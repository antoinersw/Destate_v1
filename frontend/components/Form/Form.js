import React, { useState, useEffect } from "react";

const axios = require("axios");
export default function Form() {
  const [room, setRoom] = useState([]);

  const getRoom = async () => {
   
    try {
      // const res = await fetch(`/api/rooms/${event.target.roomid.value}`);
      const res = await axios.get(`/api/rooms/test`);

      const result = res.data.room;
      console.log(result.squares)
      setRoom(result.squares);


    } catch (e) {
      console.log(e.toString());
    }
  };

  useEffect(() => {
    getRoom();
  }, []);

  return (
    <>
   
      <div>{room.map(r=>(
          <p>{r.name}</p>
      )
      )}</div>
    </>
  );
}

// export default function App() {
//     const [products, setProducts] = useState([]);
  
//     const fetchProducts = async () => {
//       const { data } = await axios.get(
//         "https://jsonplaceholder.typicode.com/todos/"
//       );
//       const products = data;
//       setProducts(products);
//       console.log(products);
//     };
  
//     useEffect(() => {
//       fetchProducts();
//     }, []);
  
//     return (
//       <div>
//         {products.map((product) => (
//           <p>{product.title}</p>
//         ))}
//       </div>
//     );
//   }
  