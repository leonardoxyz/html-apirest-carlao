// artigo base : https://diegomagalhaes-dev.medium.com/como-consumir-uma-api-rest-utilizando-javascript-e2728c207eb

const ul = document.querySelector('[data-js="alunos"]');

const filterImput = document.querySelector("#filter");

const timeStamp = Date.now().toString();

const getPosts = async (param) => {
    const response = await fetch(`http://localhost/dsi/aula-3/apirest.php/person`)
    return response.json();
}

const alunosFromFedd = alunos => alunos.map( item => `
    <li class="card ${'normal'}">
    <img class="card-image" alt=${item.nome} src="usuario.png"/>
    <h2 class="card-title">${item.nome}</h2>
    <p class="card-email">${item.email}</p>
    </li>
`).join('')

const alunosFromSearch = alunos => alunos.map( item => `
    <li class="card ${'normal'}">
    <img class="card-image" alt=${item.nome} src="usuario.png"/>
    <h2 class="card-title">${item.nome}</h2>
    <p class="card-email">${item.email}</p>
    </li>
`
).join('')

const earlyFedd = async () =>{
    const alunos = await getPosts('orderBy=name&limite=20')
    const postsTemplate = alunosFromFedd(alunos)
    ul.innerHTML = postsTemplate ;
}

const searchAlunosIntoDOM = async (search) =>{
    const alunos = await getPosts(`${'nome = '}${search}`)
    const postsTemplate = alunosFromSearch(alunos)
    ul.innerHTML = postsTemplate ;
}

// funçção que verifica o input "pesquisar alunos"
const modifyInputValue = event => {
    const inputvalue = event.target.value.toLowerCase();
    if( inputvalue != '' ){
        searchAlunosIntoDOM(inputvalue);
    }else if (inputvalue=='' || inputvalue == null) {
        earlyFedd();
    }
}

earlyFedd();

filterImput.addEventListener('input', modifyInputValue)