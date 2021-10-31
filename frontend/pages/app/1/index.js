import styles from "./1.module.css";


export default function Home({ data }) {
  return (
    <>
      <div className="container">
        <div className="grid-wrapper">
          <h1>Empty room Id</h1>
          <h1>{data}</h1>

          <form action="/">
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <button>Play</button>
          </form>
          
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const ftc = await fetch("http://localhost:3000/api/emptyroom");
  const { rooms } = await ftc.json();

  return {
    props: { data: rooms },
  };
}
