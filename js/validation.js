export function validates(input) {
    const typeOfInput = input.dataset.type

    if (validators[typeOfInput]) {
        validators[typeOfInput](input)
    }

    if (input.validity.valid) {
        input.parentElement.classList.remove("input-container-invalid")
        input.parentElement.querySelector(".input-error-message").innerHTML = `<span></span>`
    } else {
        input.parentElement.classList.add("input-container-invalid")
        input.parentElement.querySelector(".input-error-message").innerHTML = showErrorMessage(typeOfInput, input)
    }
}

const typesOfError = [
    "valueMissing",
    "typeMismatch",
    "patternMismatch",
    "customError"
]

const errorMessage = {
    name: {
        valueMissing: "Field can't be empty."
    },
    email: {
        valueMissing: "Field can't be empty.",
        typeMismatch: 'Invalid e-mail.'
    },
    phone: {
        valueMissing: "Field can't be empty."
    },
    password: {
        valueMissing: "Field can't be empty.",
        patternMismatch: "The password must contain 6 to 12 characters, with at least one capital letter, a number and must not contain symbols."
    },
    birthDate: {
        valueMissing: "Field can't be empty.",
        customError: "You should be older than 18 to register."
    },
    cpf: {
        valueMissing: "Field can't be empty",
        customError: "Invalid CPF."
    },

    zipcode: {
        valueMissing: "Field can't be empty.",
        patternMismatch: "Invalid Zip Code.",
        customError: "Zip Code doesn't exist."
    },

    city: {
        valueMissing: "Field can't be empty."
    },

    state: {
        valueMissing: "Field can't be empty."
    }
}

const validators = {
    birthDate:input => validatesBirthDate(input),
    cpf:input => validatesCPF(input),
    zipcode:input => findZipCode(input)
}

function showErrorMessage(typeOfInput, input) {
    let message = ""

    typesOfError.forEach(error => {
        if (input.validity[error]) {
            message = errorMessage[typeOfInput][error]
        }
    })

    return message
}

function validatesBirthDate(input) {
    const incomeDate = new Date(input.value)
    let message = ""

    const currentDate = new Date()
    const datePlus18 = new Date(incomeDate.getUTCFullYear() + 18, incomeDate.getUTCMonth(), incomeDate.getUTCDate())

    const isOlderThan18 = datePlus18 <= currentDate
    if (!isOlderThan18) {
        message = "You should be older than 18 to register"
    }

    input.setCustomValidity(message)
}

function validatesCPF(input) {
    
    const formartedCPF = input.value.replace(/[\s.-]*/igm, '')
    let message = ""

    if (!isValidCPF(formartedCPF)) {
        message = "Invalid CPF."
    }

    input.setCustomValidity(message)
}


function isValidCPF(cpf) {
    if (typeof cpf !== "string") return false
    if (
        !cpf ||
        cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999" 
    ) {
        return false
    }
    var sum = 0
    var rest
    for (var i = 1; i <= 9; i++) 
        sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i)
    rest = (sum * 10) % 11
    if ((rest == 10) || (rest == 11))  rest = 0
    if (rest != parseInt(cpf.substring(9, 10)) ) return false
    sum = 0
    for (var i = 1; i <= 10; i++) 
        sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i)
    rest = (sum * 10) % 11
    if ((rest == 10) || (rest == 11))  rest = 0
    if (rest != parseInt(cpf.substring(10, 11) ) ) return false
    return true
}

function findZipCode(input){
    const zipCode = input.value.replace(/\D/g, '')
    const url = `https://viacep.com.br/ws/${zipCode}/json`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;chartset=utf-8'
        }
    }
    if(!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url,options).then(
            response => response.json()
        ).then(
            data => {
                console.log(data);
                if(data.erro){
                    input.setCustomValidity(true)
                    return
                }
                input.setCustomValidity('')
                fillFieldsWithZipCode(data)
                return
            }
        )

    }    
}

function fillFieldsWithZipCode(data){
    const city = document.querySelector('[data-type="city"]')
    const state = document.querySelector('[data-type="state"]')

    city.value = data.localidade
    state.value = data.uf
}

