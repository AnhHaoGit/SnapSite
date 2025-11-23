const add_new_page = (newPage: object) => {
  const storedPages = localStorage.getItem("pages");

  let pagesArray = [];

  if (storedPages) {
    pagesArray = JSON.parse(storedPages);
  }

  pagesArray.unshift(newPage);

  localStorage.setItem("pages", JSON.stringify(pagesArray));
};

export default add_new_page;
