import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

export default function Container(props) {
  //

  return (
    <>
      <Navbar />
      {props.children}
      <Footer/>
    </>
  );
}
