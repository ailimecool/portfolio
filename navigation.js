const navigation = {
  navItemE: [
    {
      navTitle: "HOME",
      navLink: "index.html",
    },
    { navTitle: "MY WORK", navLink: "workpage.html" },
    { navTitle: "ABOUT ME", navLink: "about-me.html" },
    { navTitle: "CONTACT", navLink: "contact.html" },
  ],
  navItemsS: [
    {
      navTitle: "HEM",
      navLink: "index-swedish.html",
    },
    {
      navTitle: "MINA ARBETEN",
      navLink: "workpage-swedish.html",
    },
    {
      navTitle: "OM MIG",
      navLink: "about-me-swedish.html",
    },
    { navTitle: "KONTAKT", navLink: "contact-swedish.html" },
  ],
};

const navTemplate = Handlebars.templates.nav(navigation);

$("body").prepend(navTemplate);
