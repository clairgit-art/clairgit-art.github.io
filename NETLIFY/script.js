// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    // Example: Add a click event to a button
    const button = document.getElementById("myButton");
    if (button) {
        button.addEventListener("click", () => {
            alert("Button clicked! Welcome to your website!");
        });
    }

    // Example: Change the text of an element
    const heading = document.getElementById("mainHeading");
    if (heading) {
        heading.textContent = "Welcome to My Fun Website!";
    }
});