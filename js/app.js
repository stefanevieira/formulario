import { validates } from "./validation.js"

const inputs = document.querySelectorAll('input')

inputs.forEach(input => {
    input.addEventListener('blur', (evento) =>
        validates(evento.target))
})
