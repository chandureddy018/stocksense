import { logOut } from "./auth.js";

export function initSidebar(activePage) {
  const toggle = document.getElementById("sidebar-toggle");
  const shell = document.querySelector(".app-shell");
  const overlay = document.getElementById("mobile-overlay");

  // Restore collapse state
  if (localStorage.getItem("sidebar-collapsed") === "true") {
    shell.classList.add("sidebar-collapsed");
  }

  toggle?.addEventListener("click", () => {
    const isCollapsed = shell.classList.toggle("sidebar-collapsed");
    localStorage.setItem("sidebar-collapsed", isCollapsed);
    if (overlay) overlay.classList.remove("active");
  });

  overlay?.addEventListener("click", () => {
    document.querySelector(".sidebar")?.classList.remove("open");
    overlay.classList.remove("active");
  });

  // Mobile hamburger (topbar)
  document.getElementById("mobile-menu")?.addEventListener("click", () => {
    document.querySelector(".sidebar")?.classList.toggle("open");
    overlay?.classList.toggle("active");
  });

  // Logout
  document.getElementById("btn-logout")?.addEventListener("click", logOut);

  // Set active nav link
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.dataset.page === activePage) link.classList.add("active");
  });
}

export function showToast(message, duration = 2500) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}
