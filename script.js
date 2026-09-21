document.addEventListener("DOMContentLoaded", () => {
  console.log("AI With Rony website loaded successfully!");
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      console.log("Navigating to:", link.getAttribute("href"));
    });
  });
});
