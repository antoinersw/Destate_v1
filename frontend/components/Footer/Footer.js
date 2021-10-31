import React from "react";
import Link from "next/dist/client/link";

export default function Footer() {
  const footer = [
    { name: "Home", dest: "/" },
    {name:"Features",dest:"/features"},
    {name:"Pricing",dest:"/pricing"},
    {name:"FAQs",dest:"/faq"},
    {name:"About",dest:"about"},
  ];

  return (
    <div class="container">
      <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <p class="col-md-4 mb-0 text-muted">&copy; 2021 Company, Inc</p>

        <a
          href="/"
          class="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
        ></a>

        <ul class="nav col-md-4 justify-content-end">
          {footer.map((e) => (
            <li class="nav-item">
              <Link href={e.dest}>
                <a class="nav-link px-2 text-muted">{e.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
