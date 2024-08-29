const of = document.querySelector(".form-mailing");
document.querySelector(".btn-mailing").addEventListener("click", (event) => {
  event.preventDefault();
  of.classList.add("close");
  document.querySelector(".open").style.display = "block";
  document.querySelector(".btn-mailing").style.display = "none";
});
