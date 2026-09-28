import React, { useState } from 'react';

const nav_links = [
  { label: "Home", href: "/" },
  { label: "Dealers", href: "/dealers" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async (e) => {
    e.preventDefault();
    let logout_url = window.location.origin+"/djangoapp/logout";
    const res = await fetch(logout_url, {
      method: "GET",
    });

    const json = await res.json();
    if (json) {
      let username = sessionStorage.getItem('username');
      sessionStorage.removeItem('username');
      window.location.href = window.location.origin;
      window.location.reload();
      alert("Logging out "+username+"...")
    }
    else {
      alert("The user could not be logged out.")
    }
  };

  //Gets the username in the current session
  let curr_user = sessionStorage.getItem('username')
  let isLoggedIn = curr_user !== null && curr_user !== "";

  let path = window.location.pathname.replace(/\/$/, "") || "/";
  const isActive = (href) => href === "/" ? path === "/" : path.startsWith(href);

  //If the user is logged in, show the username and logout option, otherwise login and register
  let home_page_items = isLoggedIn ? (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-xs font-bold uppercase text-white">
          {curr_user.charAt(0)}
        </span>
        <span className="username">{curr_user}</span>
      </span>
      <a className="btn-ghost-light" href="/djangoapp/logout" onClick={logout}>Logout</a>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <a className="btn-ghost-light" href="/login">Login</a>
      <a className="btn-primary" href="/register">Register</a>
    </div>
  );

  return (
    <header className="site-nav">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2.5 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-lg shadow-brand-900/40">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 17h14M5 17a2 2 0 1 1-4 0v-4l2.5-5.5A2 2 0 0 1 5.3 6h13.4a2 2 0 0 1 1.8 1.5L23 13v4a2 2 0 1 1-4 0" />
              <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight">Best<span className="text-brand-400">Cars</span></span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {nav_links.map(link => (
            <a key={link.href} href={link.href} className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}>{link.label}</a>
          ))}
        </div>

        <div className="hidden md:block" id="loginlogout">
          {home_page_items}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {nav_links.map(link => (
              <a key={link.href} href={link.href} className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}>{link.label}</a>
            ))}
          </div>
          <div className="mt-3 border-t border-white/10 pt-3">{home_page_items}</div>
        </div>
      )}
    </header>
  )
}

export default Header
