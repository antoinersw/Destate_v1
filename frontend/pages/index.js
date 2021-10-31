import Form from "../components/Form/Form";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <>

<Form/>
</>

  );
}

// export async function getServerSideProps() {

//   const ftc = await fetch("http://localhost:3000/api/rooms/empty");
//   const { emptyRoom } = await ftc.json();

//   return {
//     props: { data: emptyRoom },
//   };
// }
