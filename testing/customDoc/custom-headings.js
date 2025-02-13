document.addEventListener("DOMContentLoaded", function() {
  const headings = document.querySelectorAll("h3.subsection-title");
  headings.forEach((heading) => {
      // Replace "Member" with "Tests" in the text content of each heading
      if (heading.textContent.includes("Members"))
        heading.textContent = heading.textContent.replace(/Members/g, "Tests");
  });
});