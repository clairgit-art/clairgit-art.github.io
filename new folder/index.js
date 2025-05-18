let body = document.getElementsByTagName("body")[0];
body.style.backgroundColor = "blue";
function setColor(name) {
  body.style.backgroundColor = name;

}
function randomColor(){
    let red = Math.round(Math.random() * 256);
    let green = Math.round(Math.random() * 256);
    let blue = Math.round(Math.random() * 256);
   let purple = Math.round(Math.random() * 256);
    let yellow = Math.round(Math.random() * 256);
let color = `rgb(${red}, ${green}, ${blue})`;
body.style.backgroundColor = color;

}

let input = document.getElementById("input");
function Enter() {
  let value = input.value
  alert(value)
}
