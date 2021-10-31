import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {

  const nav= [
    {name:"Home",dest:"/",},
    {name:"Profil",dest:"/profil"},
    {name:"App",dest:"/app"}
  ]
  return (
    <div>
      <nav className={styles.navbar}>
      {nav.map(e=>(
        <Link href={e.dest}>
        <a>{e.name}</a>
      </Link>

      ))}</nav>
      
      
    </div>
  );
}
