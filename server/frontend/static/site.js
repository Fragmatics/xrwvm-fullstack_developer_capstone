// Shared behaviour for the Django-rendered pages (Home, About, Contact)

const logout = async (e) => {
// Build logout URL and Make GET request to logout endpoint
  if (e) e.preventDefault();
  let logout_url = window.location.origin+"/djangoapp/logout";
  const res = await fetch(logout_url, {
    method: "GET",
  });

  const json = await res.json();
  if (json) {
	// Clear session storage and reload page
    let username = sessionStorage.getItem('username');
    sessionStorage.removeItem('username');
    window.location.href = window.location.origin;
    window.location.reload();
	 // Notify user of logout
    alert("Logging out "+username+"...")
  }
  else {
    alert("The user could not be logged out.")
  }
};

let checkSession = ()=>{
  let curr_user = sessionStorage.getItem("username");
  let html;

  if (curr_user && curr_user !== "") {
    let initial = curr_user.charAt(0).toUpperCase();
    html =
    '<div class="flex items-center gap-3">' +
      '<span class="flex items-center gap-2 text-sm font-medium text-slate-200">' +
        '<span class="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">' + initial + '</span>' +
        '<span class="homepage_links"></span>' +
      '</span>' +
      '<a class="btn-ghost-light" onclick="logout(event)" href="/">Logout</a>' +
    '</div>';
  } else {
    html =
    '<div class="flex items-center gap-2">' +
      '<a class="btn-ghost-light" href="/login">Login</a>' +
      '<a class="btn-primary" href="/register">Register</a>' +
    '</div>';
  }

  document.querySelectorAll("[data-loginlogout]").forEach((el) => {
    el.innerHTML = html;
    // Set the username as text so it is never interpreted as HTML
    let name = el.querySelector(".homepage_links");
    if (name) name.textContent = curr_user;
  });
 }

let toggleMenu = ()=>{
  let menu = document.getElementById("mobile-menu");
  let open = menu.classList.toggle("hidden") === false;
  document.getElementById("menu-button").setAttribute("aria-expanded", open);
}

document.addEventListener("DOMContentLoaded", checkSession);
