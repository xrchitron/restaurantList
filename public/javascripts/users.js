const cta = document.querySelector(".cta");
let check = 0;

cta.addEventListener("click", function (e) {
  const text = document.querySelector(".text");
  const loginText = document.querySelector(".login-text");
  text.classList.toggle("show-hide");
  loginText.classList.toggle("expand");
  if (check == 0) {
    cta.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
    check++;
  } else {
    cta.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
    check = 0;
  }
});
