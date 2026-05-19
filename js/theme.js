let svgSol = ` <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-sun-icon lucide-sun">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                        <path d="m4.93 4.93 1.41 1.41" />
                        <path d="m17.66 17.66 1.41 1.41" />
                        <path d="M2 12h2" />
                        <path d="M20 12h2" />
                        <path d="m6.34 17.66-1.41 1.41" />
                        <path d="m19.07 4.93-1.41 1.41" />
                    </svg>`

let svgLua = ` <svg viewBox="-5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
            xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
            fill="#000000" stroke="#000000">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <title>moon</title>
                <desc>Created with Sketch Beta.</desc>
                <defs> </defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                    <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-575.000000, -829.000000)"
                        fill="#000000">
                        <path
                            d="M586.256,845 C586.256,838.1 590.735,832.236 597,829.991 C595.243,829.361 593.353,829 591.372,829 C582.33,829 575,836.164 575,845 C575,853.837 582.33,861 591.372,861 C593.353,861 595.243,860.639 597,860.009 C590.735,857.764 586.256,851.901 586.256,845"
                            id="moon" sketch:type="MSShapeGroup"> </path>
                    </g>
                </g>
            </g>
        </svg> `

let btnTema = document.querySelector('#btnTema')

function salvarTema(tema) {
    localStorage.setItem('tema', tema)
}


//------------------ 👉 Criando o DARK E O LIGHT MODE
btnTema.addEventListener('click', function () { //dando o evento ao meu Botao do tema, mas aguarda o click

    document.body.classList.toggle('light-mode') // quando clicar, deve adicionar se nao tem se tiver remover o que sera estilizado no css



    if (document.body.classList.contains('light-mode')) {


        salvarTema('light')
        btnTema.innerHTML = svgLua


    } else {

        salvarTema('dark')
        btnTema.innerHTML = svgSol

    }
})




//------------------ 👉 Criando uma Categoria Global
/**
 * Isto abaixo diz, se nao existir nada cria uma categoria Geral
 */
let temaGuardado = localStorage.getItem('tema')
if (temaGuardado === 'light') {
    document.body.classList.add('light-mode')
    btnTema.innerHTML = svgLua
} else {
    document.body.classList.remove('light-mode')
    btnTema.innerHTML = svgSol
}

if (categorias.length === 0) { // se categorias do array esta vazia
    categorias.push({ // se estiver vazio entao inicia com uma categoria vazia chamada Geral onde nao contem nenhuma tarega
        nome: "Geral",
        tarefas: []
    })
    localStorage.setItem("categorias", JSON.stringify(categorias)) // e grava categorias dentro do armazenamento do browser
}


console.log("theme loaded")