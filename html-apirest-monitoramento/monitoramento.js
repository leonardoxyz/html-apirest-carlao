// artigo base : https://diegomagalhaes-dev.medium.com/como-consumir-uma-api-rest-utilizando-javascript-e2728c207eb

const ul = document.querySelector('[data-js="monitoramento"]');

const filterImput = document.querySelector("#filter");

const timeStamp = Date.now().toString();

const getPosts = async (param) => {
    const response = await fetch(`http://localhost:8000/monitoramento/${param}`) 
    return response.json();
}

const monitoramentosFromFedd = monitoramentos => monitoramentos.map( item => `
    <li class="card ${'normal'}">
    <img class="card-image" alt=${item.dispositivo} src="assets/carlosfilho.jpg"/>
    <h2 class="card-title">Dispositivo: ${item.dispositivo}</h2>
    <p class="card-description">Temperatura: ${item.temperatura}°</p>
    <p class="card-description">Umidade: ${item.umidade}%</p>
    </li>
`).join('')

const monitoramentosFromSearch = monitoramentos => monitoramentos.map( item => `
    <li class="card ${'normal'}">
    <img class="card-image" alt=${item.dispositivo} src="assets/avatar.jpg"/>
    <h2 class="card-title">Dispositivo: {item.dispositivo}</h2>
    <p class="card-description">Temperatura: ${item.temperatura}°</p>
    <p class="card-description">Umidade: ${item.umidade}%</p>
    </li>
`
).join('')

const earlyFedd = async () =>{
    const monitoramentos = await getPosts('last20')
    const postsTemplate = monitoramentosFromFedd(monitoramentos)
    ul.innerHTML = postsTemplate ;
}

const searchMonitoramentosIntoDOM = async (search) =>{
    const monitoramentos = await getPosts(`${search}`)
    const postsTemplate = monitoramentosFromSearch(monitoramentos)
    ul.innerHTML = postsTemplate ;
}

// funçção que verifica o input "pesquisar alunos"
const modifyInputValue = event => {
    const inputvalue = event.target.value.toLowerCase();
    if( inputvalue != '' ){
        searchMonitoramentosIntoDOM(inputvalue);
    }else if (inputvalue=='' || inputvalue == null) {
        earlyFedd();
    }
}

earlyFedd();

filterImput.addEventListener('input', modifyInputValue)