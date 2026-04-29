
// isto diz que o app pode 

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('SW registado'))
        .catch(err => console.log('Erro SW:', err));
}


/*Tenta Buscar tarefas guardadas, se nao existir Iniciar vazio
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || []
*/

//Se ja existe categoria usa, se nao começa com Geral
let categorias = JSON.parse(localStorage.getItem("categorias")) || []

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

let filtro = "todas" // Uma variavel que guarda qual tipo de tarefa quero ver
let pesquisa = "" // Esta variavel vai guardar o texto que escrever no  input de pesquisa
let input = document.querySelector('#taskInput') // Pegar o valor do Input.
let btnAdicionar = document.querySelector('#addBtn')   // Chamar o btnAdicionar.
let lista = document.querySelector('#taskList') // Chamada do que vai criar.

let modal = document.querySelector('#meuModal') // Chamada do Id do Dialog.
let btnFechar = document.querySelector('#btnfecharModal') // Chamada do Botao para fechar o Dialog.

let progReal = document.querySelector('.progReal') // Chamada para a Div do progresso real/“vai buscar aquela div para eu poder mexer nela”
let pendentes = document.querySelector('#pendentes') // Chamada para a Div do pendetne para eu mexer nela
let totalizada = document.querySelector('#totalizada')
let modalTexto = document.querySelector('#modalTexto') // chamada para mexer esta div
let btnConfirmar = document.querySelector('#btnConfirmar') // chamada para mexer nesta div
let categoriaAberta = null // uma categoria nula 
let barra = document.querySelector('.progresso-barra') //vai buscar a barra no HTML para eu poder mexer nela
let modoSelecao = false
let isLongPress = false
let barraAcoes = document.querySelector('#barra-acoes')// vai buscar aquela variavel
let jaAdicionou = false // variavel para nao duplicar o blur
let contador = document.querySelector('#contadorSelecionados') //vaibuscar aquele span para eu mexer nele// span para conta numero que selecionno nos cards
let btnRemoverSelecionados = document.querySelector('#btnRemoverSelecionados') // vai vuscar aquele elemento para mexer nele
let btnPartilhar = document.querySelector('#btnPartilhar') // vai buscar aquele elmento para eu mexer nele
let toast = document.querySelector('#toast') // vai buscar aquele elemente para eu mexer nele 
let btnTema = document.querySelector('#btnTema')// vai buscar aquele elemento para eu mexer nele




//------------------ 👉 Criando o DARK E O LIGHT MODE
btnTema.addEventListener('click', function () { //dando o evento ao meu Botao do tema, mas aguarda o click

    document.body.classList.toggle('light-mode') // quando clicar, deve adicionar se nao tem se tiver remover o que sera estilizado no css



    if (document.body.classList.contains('light-mode')) {

        localStorage.setItem('tema', 'light')
        btnTema.innerHTML = svgLua


    } else {
        localStorage.setItem('tema', 'dark')
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
    btn.innerHTML = svgSol
}

if (categorias.length === 0) {
    categorias.push({
        nome: "Geral",
        tarefas: []
    })
    localStorage.setItem("categorias", JSON.stringify(categorias))
}

//funcao para o card quando selecionado
function toggleSelecionado(card) { // quando for chamado esta funcao tem que passar um card
    card.classList.toggle("card-selecionado") // aqui se nao tem o tick passa a ter se tiver desmarca

    let check = card.querySelector(".check-card") // encontra este elemente com esta classe

    if (card.classList.contains("card-selecionado")) { // este card esta selecionado
        check.style.opacity = "1" //se estiver mostra selecionado 
    } else {
        check.style.opacity = "0" // se nao estiver esconde
    }
}

// aqui criamos uma barra e contamos quantos foram selecionados na barra

function atualizarBarraAcoes() {
    let selecionados = document.querySelectorAll('.card-selecionado') // procura todos elementos com esta classe
    let total = selecionados.length // quantos cards estao selecionados

    let contador = document.querySelector('#contadorSelecionados') // vai buscar o elemento no html para mexer nele

    if (total === 1) {
        contador.textContent = `1 selecionado`
    } else {
        contador.textContent = ` ${total} selecionados`
    }


    if (selecionados.length > 0) { // aqui quantas existem? se tiver pelo menos 1
        barraAcoes.classList.add('ativa') // adiciona esta classe e a barra aparece
    } else {
        barraAcoes.classList.remove('ativa')
        modoSelecao = false
    }
    toggleSelecionado(card)
    atualizarBarraAcoes()
}



// aqui limpamos quando clicamos fora quando ainda esta selecionado o card
document.addEventListener('click', function (e) { // se clicar em toda pagina inteira.document

    let clicouDentro = e.target.closest('.categoria-card')// este click veio dentro de um card? se sim, marca se nao retorna null
    let clicouNaBarra = e.target.closest('#barra-acoes')

    if (!clicouDentro && !clicouNaBarra) { // se nao limpou dentro

        let selecionados = document.querySelectorAll('.card-selecionado')

        selecionados.forEach(card => {
            card.classList.remove('card-selecionado')

            let check = card.querySelector('.check-card')
            if (check) check.style.opacity = "0"

        })

        modoSelecao = false

        document.querySelector('#barra-acoes').classList.remove('ativa')

    }

})



//-----------------------aqui criamos o remover selecionados--------
btnRemoverSelecionados.addEventListener('click', function () { // criar a funcao do botao click
    let selecionados = document.querySelectorAll('.card-selecionado') // pegar os selecionados

    let indices = [] // criamos uma caixa vazia para guardar varios valores

    /*traducação:
    1. Vai buscar o data-index
    2. transforma em numero
    3. guarda dentro do array vazio que criamos de nome indices
    */
    selecionados.forEach(card => {
        indices.push(Number(card.dataset.index))
        console.log('funcionou')
    })



    indices.sort((a, b) => b - a)

    abrirModalConfirmacao("Eliminar esta categoria?", () => {
        indices.forEach(index => {
            categorias.splice(index, 1)
        })

        salvarCategorias()
        mostrarCategorias()
    })





})




//-----------------  👉  Aqui vamos criar o evento que deve acontecer ao clicar no botao partilhar
btnPartilhar.addEventListener('click', function () {

    let selecionados = document.querySelectorAll('.card-selecionado')
    let texto = ""

    selecionados.forEach(card => { // para cada categoria

        let categoria = categorias[card.dataset.index] // ele serve para guardar o indice

        texto += "📁 " + categoria.nome + " \n" // isto \n significa quebra de linha
        categoria.tarefas.forEach(function (tarefa) { // para cada tarefa dessa categoria
            texto += "- " + tarefa.texto + "\n"
        })
        texto += "\n"
    })

    navigator.clipboard.writeText(texto)// serve para copiar ou copiar a variavel texto

    navigator.share({ // serve para partilhar com os app tradicionais(nativos) que ja existem no telemovel
        title: "TaskFlow Pro",
        text: texto
    })


    toast.style.opacity = "1" // para mostrar assim que o texto for copiado pelo navigator.clipboard

    setTimeout(() => { // esperas um pouco depois de 2 segundos 
        toast.style.opacity = "0"   // opacity zero, ele desaparece de novo
    }, 1000)
})





//-------------------  👉  Aqui vamos mostrar as categorias
function mostrarCategorias() {
    lista.innerHTML = "" // Limpa tudo
    document.body.classList.remove("modo-foco") // isto diz para mim sempre que redesenhar, limpa o modo foco antigo
    lista.classList.remove('modo-foco')

    categorias.forEach(function (categoria, index) { // este é o forEach dos card todos

        let card = document.createElement("div") // cria uma variavel que vai guardar uma div
        card.classList.add("categoria-card")// atribui um nome a esta class de categoria-card

        card.dataset.index = index // serve para dar uma etiqueta ao array, exemplo passa a ter index = 0

        if (categoria.nome === categoriaAberta) {
            card.classList.add('aberta')
            lista.classList.add('modo-foco')
            document.body.classList.add("modo-foco")
        }

        //-----------------------------------------
        //-----------------------------------------
        //----------------Abaixo disto tudo estao os eventos todos 
        //------------------------- vamos adicionar o pressionar e segurar
        let pressTimer // uma variavel para guardar o tempo

        // 👉 Telefone
        card.addEventListener('touchstart', function () { //touchstart quando o dedo tocar no ecra
            pressTimer = setTimeout(() => { // o setTimeOut é o tempo de espera que é de 500ms
                isLongPress = true
                modoSelecao = true
                toggleSelecionado(card)
                atualizarBarraAcoes()


            }, 500) // 500ms = meio segundo
        })
        card.addEventListener('touchend', function () {
            clearTimeout(pressTimer) // quando tirar o dedo ele vai cancelar 

        })


        // 👉 Pc rato 

        card.addEventListener('mousedown', function () {
            pressTimer = setTimeout(() => {
                isLongPress = true
                modoSelecao = true
                toggleSelecionado(card)
                atualizarBarraAcoes()
            }, 500) // 500ms = meio segundo
        })
        card.addEventListener('mouseup', function () {
            clearTimeout(pressTimer)

        })



        //--------------------aqui vou criar o check visual com checkbox
        let checkSelecionado = document.createElement("div")
        checkSelecionado.textContent = "✔"
        checkSelecionado.classList.add("check-card")

        card.appendChild(checkSelecionado)

        //---------------------- 👉 BOTÃO VOLTAR (criado sempre no render)
        //------------vamos adicionar um botao de voltar quando ele esta dentro do card
        let btnVoltar = document.createElement('button') // cria o botao
        btnVoltar.textContent = " ← " // define o texto que vai aparecer no html
        btnVoltar.classList.add("btnVoltar")// cria uma class

        btnVoltar.addEventListener('click', function (e) {
            e.stopPropagation() // evita reabrir o card ao clicar

            card.classList.remove('aberta') // fecha o card
            lista.classList.remove('modo-foco') // volta ao modo normal
            categoriaAberta = null // Limpa o estado

            mostrarCategorias()
        })

        card.prepend(btnVoltar) // Coloca o botao no topo do card


        //------------criando uma div para guardar o titulo e o botao de eliminar o card (criar estilizacao)
        let cardHeader = document.createElement("div") // crie uma variavel que recebe uma div
        cardHeader.classList.add("card-header") // adicionei uma class de nome card-header


        let titulo = document.createElement("h3") // cria um h3
        titulo.textContent = categoria.nome

        //-------------------  👉  Aqui vou tornar o titulo editavel
        titulo.addEventListener('click', function () {
            let textoOriginal = titulo.textContent // guarda o nome antigo caso o utilizador cancele

            titulo.contentEditable = true // transforma em campo editavel

            titulo.focus() // coloca o cursor a piscar

            let cancelado = false // controla o ESC

            titulo.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault
                    titulo.blur() // forca a guardar
                }
                if (e.key === 'Escape') {
                    cancelado = true
                    titulo.textContent = textoOriginal // se cancelado voltao ao texto original

                    titulo.blur()
                }
            })

            titulo.addEventListener('blur', function () {

                titulo.contentEditable = false
                // sai do modo edição

                if (cancelado) return
                // se cancelou, não guarda

                let novoNome = titulo.textContent.trim()

                if (novoNome === "") {
                    titulo.textContent = textoOriginal
                    return
                }

                categoria.nome = novoNome // atualiza o nome da Categoria
                salvarCategorias()// guarda no localstorage

            })

        })

        cardHeader.appendChild(titulo) // mete o titulo no header

        //-------------------------Aqui vamos criar o Botao para apagar os Card
        let btnApagar = document.createElement('button') //criando um botao
        btnApagar.textContent = "🗑️"                    // o botao recebe esta iamgem como texto
        btnApagar.classList.add("btnApagarCategoria")   //aqui atribuimos esta class para o botao

        btnApagar.addEventListener('click', function (e) {
            e.stopPropagation() // evita abrir o card ao mesmo tempo

            abrirModalConfirmacao("Apagar esta categoria?", () => { // vai abrir o meu modal, e so usa o arrow function quando confirmar    
                categorias.splice(index, 1)

                salvarCategorias()  // guarda no localStorage
                mostrarCategorias() // redesenha tudo
            })

        })

        cardHeader.appendChild(btnApagar) // mete o titulo no header    
        card.appendChild(cardHeader)    // mete o header no card


        let listaTarefas = document.createElement('ul') // cria uma ul demtrp dp card

        //cria uma copia das tarefas
        let tarefasParaMostrar = categoria.tarefas// criando a variavel com todas as tarefas

        // se nao estiver aberto limita a 5
        if (categoria.nome !== categoriaAberta) {// verifica se o card nao esta aberto
            tarefasParaMostrar = categoria.tarefas.slice(0, 5)// corta o array so fica com 5 tarefas. do indice de 0 a 5
        }

        tarefasParaMostrar.forEach(function (tarefa, index) { // percorre as tarefas da categor
            let li = criarElementosTarefa(tarefa, index, categoria)
            listaTarefas.appendChild(li)
        })


        //  👉 se houver mais tarefas que 3 tarefas mostrar ...
        if (categoria.nome !== categoriaAberta && categoria.tarefas.length > 5) {

            let mais = document.createElement("p")// cria texto
            mais.textContent = "... "// conteudo

            mais.style.opacity = "0.6" // deixa mais discreto
            mais.style.textAlign = "center"

            listaTarefas.appendChild(mais) // aparece no final da lista
        }


        card.appendChild(listaTarefas)


        //-----------------------👉 aqui sao as funçoes quando abrimos os CaRD
        card.addEventListener('click', function (e) {
            // 👉 bloqueia o click depois do long press
            if (isLongPress) {
                isLongPress = false
                return
            }



            e.stopPropagation() // impede que o clique afete outros elementos exemplo o body


            //👉 comportamento normal (de abrir o card)

            //regra para ignorar os cliques em elementos internos 
            if (
                e.target.tagName === "BUTTON" || // se clicar no botao ignora
                e.target.tagName === "INPUT" || // se clicar no input ignora
                e.target.isContentEditable // se estiver a editar o span ignora
            ) {
                return
            }

            //👉 se estiver em modo selecao
            if (modoSelecao) {
                toggleSelecionado(card)
                atualizarBarraAcoes()
                return
            }


            // alterna abrir ou fechar
            if (categoriaAberta === categoria.nome) {
                categoriaAberta = null
            } else {
                categoriaAberta = categoria.nome
            }

            mostrarCategorias()

        })

        let btnAdd = document.createElement("button")
        btnAdd.textContent = " ➕ "
        btnAdd.classList.add("btnAddInline")


        //-------------------------- Aqui onde damos um evento ao botao Adicionar
        function abrirInputInline(e) {

            e.stopPropagation()



            let li = document.createElement("li")// Vai criar uma linha que vamos escrever a nova tarefa
            li.classList.add("editing") // Adiciona uma classe editing para depois por estilo

            let existeEdicao = document.querySelector(".editing")
            if (existeEdicao) return // se ja existir edição volta e nao aumenta outras linhas

            let span = document.createElement("span") // cria uma span para funcionar depois como input

            li.appendChild(span) // coloca o span dentro do li
            listaTarefas.appendChild(li)// coloca o li dentro da lista (porque agora ja existe no DOM)

            span.contentEditable = true // Torna o texto editavel tipo no input
            span.focus()    //  coloca o cursor a piscar dentro do span

            setTimeout(() => {
                span.scrollIntoView({ //leva este elemento para a zona visivel
                    behavior: "smooth",
                    block: "center" // tenta por a meio
                })

            }, 200)



            let cancelado = false // variavel para controlar se o utilizador cancelou com ESC

            //------------------- 👉 EVENTO TECLADO
            span.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault() // previne quebra de linha
                    // span.blur() // força a sair do campo obriga a gravar

                    let texto = span.textContent.trim()

                    if (texto === "") return

                    jaAdicionou = true

                    categoria.tarefas.push({
                        texto: texto,
                        concluida: false
                    })

                    console.log(categoriaAberta)
                    console.log(categoria.nome)

                    salvarCategorias()
                    mostrarCategorias()

                    // aqui cria uma nova linha automatica
                    setTimeout(() => {
                        let cardAtual = document.querySelector('.categoria-card.aberta')
                        let btn = cardAtual.querySelector('.btnAddInline')

                        if (btn) btn.click()

                    }, 100)
                }

                if (e.key === 'Escape') {
                    cancelado = true //  marca que foi cancelado
                    li.remove() // removi a linha do Li e nao grava nada
                }
            })

            //------------------- 👉 EVENTO QUANDO SAI DO CAMPO
            span.addEventListener('blur', function () {

                if (cancelado) return // se foi cancelado com ESC, nao faz nada

                if (jaAdicionou) return

                let texto = span.textContent.trim() // vai buscar o texto escrito e remove os espaços



                if (texto === "") {
                    li.remove() // se estiver vazio apaga a linha
                    return
                }

                categoria.tarefas.push({ // adiciona a tarefa dentro da categoria
                    texto: texto,
                    concluida: false
                })

                salvarCategorias() // guarda no localstorage
                mostrarCategorias() // redesenha a interface
            })

        }


        btnAdd.addEventListener('click', abrirInputInline)



        card.appendChild(btnAdd)

        lista.appendChild(card)

        //---------------------Aqui vamos mostrar o historio das tarefas em cada card, quando tenho isso significa que ja tenho um card aberto
        if (categoria.nome === categoriaAberta) {
            let tarefas = categoria.tarefas
            let total = tarefas.length
            let concluidas = tarefas.filter(function (tarefa) {
                return tarefa.concluida === true
            }).length

            // -*--------------Aqui em baixo deve mostrar o total e mostrar as tarefas concluidas
            progReal.textContent = `${concluidas} / ${total}` // aqui para mostrar a diferenca de quantas tarefas faltam

            let numPendentes = total - concluidas //aqui uma variavel antes para calcular 
            pendentes.textContent = `${numPendentes}`// aqui depois de calcular pegar a variavel e mostrar no html

            let numConcluidas = concluidas
            totalizada.textContent = numConcluidas

            let percentagem = (concluidas / total) * 100
            barra.style.width = percentagem + "%"
        }



        //--------------------------aqui vou mostrar o contador de cada card selecionado


    })

    let btnNovaCategoria = document.createElement("button") // criar um botao novo
    btnNovaCategoria.textContent = "+" // Texto do Botao
    btnNovaCategoria.classList.add("btnNovaCategoria") // atribuimos uma classe ao botao

    btnNovaCategoria.addEventListener('click', function () {
        let card = document.createElement("div")//cria um novo card igual aos outros
        card.classList.add("categoria-card", "editing") // styling + modo de edição

        let titulo = document.createElement("h3") // titulo da categoria nova que sera criada
        card.appendChild(titulo) // coloca o titulo dentro do card

        lista.appendChild(card)// mostra o card no ecra

        titulo.contentEditable = true // Torna editavel

        titulo.focus() // cursor ativo a piscar

        let cancelado = false // controla o ESC quando acionado nao faz nada

        //------------------------------- 👉 teclado
        titulo.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault()
                titulo.blur()
            }
            if (e.key === 'Escape') {
                cancelado = true
                card.remove()
            }
        })


        //------------------------------- 👉 Quando ativa o BLUR
        titulo.addEventListener('blur', function () {
            if (cancelado) return

            let nome = titulo.textContent.trim()
            if (nome === "") {
                card.remove()
                return
            }

            // Cria nova Categoria
            categorias.push({
                nome: nome,
                tarefas: []
            })

            salvarCategorias()// guarda
            mostrarCategorias() // redesenha
        })
    })
    lista.appendChild(btnNovaCategoria)



}

//------------------- 👉  Aqui vamos criar um modal de confirmação dinamico
/**
 * Uma função com dois paramentos
 * Mensagem: Texto que vai aparecer no modal
 * callback: função que vai executar depois (ex: apagar tarefa)
 */
function abrirModalConfirmacao(mensagem, callback) {
    modalTexto.textContent = mensagem // Coloca o texto dentro do Modal (ex: apagar esta tarefa?)

    modal.showModal()

    function confirmar() { // esta funcao crianda so existe aqui dentro
        callback()  // executa ação que passamos mais em frente (ex: () => removeTarefa(posicao))
        fechar() // fecha o modal depois de confirmar
    }

    function fechar() { // outra funcao interna
        modal.close() // fecha o model
        btnConfirmar.removeEventListener('click', confirmar) // remove o evento antigo
    }

    btnConfirmar.addEventListener('click', confirmar) // quando clicar confirmar executa a funcao confirmar
}

// Botao Fechar o Dialogo
btnFechar.addEventListener('click', function () { //este codigo adiciona o evento do botao Entendido
    modal.close() // e este fecha o botao.
})

//Aqui muda tudo, muda os filtros, conforme for chamando pendentes, todos, ou concluidas.
function mudarFiltro(novoFiltro) {
    filtro = novoFiltro
    mostrarCategorias()
}

// -------------------- 👉  Aqui criamos uma função para filtrar as tarefas
function filtrarTarefas() {
    return tarefas.filter(function (tarefa) {
        if (filtro === "concluidas") {
            return tarefa.concluida === true
        }

        if (filtro === "pendentes") {
            return tarefa.concluida === false
        }

        return true
    })
}

/*---------------------- 👉 Aqui vamos criar uma funcção para criar os nossos elementos:
criar li
criar checkbox
criar texto
criar botões
adicionar eventos
*/
function criarElementosTarefa(tarefa, posicao, categoria) {
    let li = document.createElement("li") // Criação: O código cria um elemento <li></li>, para cada tarefa.
    li.classList.add("task")// atribuir o nome a class li de task, nesse caso todas as tarefas.

    let spanTexto = document.createElement("span")// criando uma variavel com elemento span
    spanTexto.classList.add("texto-tarefa") // atibui uma class para meu span

    let checkbox = document.createElement("input") // // criando uma variavel com elemento input
    checkbox.type = "checkbox" // Aplica o tipo
    checkbox.checked = tarefa.concluida // Aqui o checkbox recebe o atributo tarefa.concluida, onnde concluida inicia sempre com false

    // Dando Evento ao chamado checkbox 
    checkbox.addEventListener('change', function () {
        tarefa.concluida = !tarefa.concluida
        salvarCategorias()
        mostrarCategorias()
    })


    //spanTexto.textContent = tarefa.texto // transforma o elemento, ou faz aparecer este elemento no HTML.
    //------------------- 👉 Aqui vamos dar ao input pesquisar uma nova forma de verificar assim uqe for encontrado o texto

    let textoOriginal = tarefa.texto // esta variavel guarda um novo texto. que vira do tarefa.texto
    if (pesquisa !== "") {
        let regex = new RegExp(`(${pesquisa})`, "gi") // procura todo texto, gi, g-> global, i -> ingnore case maisculas ou minusculas

        let textoComHighLight = textoOriginal.replace(regex, '<span class= "highlight">$1</span>')
        spanTexto.innerHTML = textoComHighLight
    } else {
        spanTexto.textContent = textoOriginal
    }

    if (tarefa.concluida) {
        li.classList.add("task-concluida")
    } else {
        li.classList.remove("task-concluida")
    }

    li.prepend(checkbox)
    li.appendChild(spanTexto)

    //------------------👉 Aqui criamos o Botao Remover
    let btnRemover = document.createElement("button")
    btnRemover.textContent = "❌"

    btnRemover.addEventListener('click', function () {

        abrirModalConfirmacao("Apagar esta tarefa?", () => {

            li.classList.add("remover")

            setTimeout(() => {
                categoria.tarefas.splice(posicao, 1)
                salvarCategorias()
                mostrarCategorias()
            }, 300)

        })


    })



    //------------------👉 Aqui criamos o Botao Editar
    let btnEditar = document.createElement("button")
    btnEditar.textContent = "✏️"

    btnEditar.addEventListener('click', function () { // cria uma funcção quando o eevento de clicar o botao for acionado
        if (tarefa.concluida) { // nao deixa editar se o texto concluido como true
            return
        }


        li.classList.add("editing") // atribui uma class de nome editing


        let textoOriginal = spanTexto.textContent //atribuir a esta nova variavel o texto do span
        spanTexto.contentEditable = true // torna agora este texto do spantexto em editavel
        spanTexto.focus()
        spanTexto.addEventListener('blur', function () {
            li.classList.remove("editing") //remove esta class depois do blur no editing
        })

        spanTexto.addEventListener('keydown', function (e) { // cria uma function,sera acionado quando carregar o enter 
            if (e.key === 'Enter') { // se a funcao(e), for o Enter
                e.preventDefault() // previne que nao quebre a linha, mas sim adicione
                spanTexto.blur()// span texto tambem pode ser adicionado se perder o blur do mouse
                li.classList.remove("editing")
            }
            if (e.key === 'Escape') { // se a funcao(e), for o ESC
                e.preventDefault() // previne a quebra o cancelamento
                spanTexto.textContent = textoOriginal // agora o spanTexto passa a receber o texto original porque foiu cancelado e nao foi adicionado nada 
                spanTexto.blur() // o mesmo para quando clicar fora e perder o blur
                li.classList.remove("editing")

            }
        })
        let range = document.createRange() // cria a ferramenta para selecionar
        range.selectNodeContents(spanTexto) // diz seleciona o texto todo dentro da minha variavel Span
        range.collapse(false) // ruduz a selecão toda para apenas 1 ponto e false o final

        let selecao = window.getSelection() // vai buscar a seleção atual do browser
        selecao.removeAllRanges() // Limpa qualquer seleção anterior
        selecao.addRange(range) // Aplica a nova seleção com o cursor no fim
    })

    li.appendChild(btnEditar) // aqui faz aparecer o botao de editar na tela 
    li.appendChild(btnRemover) // aqui faz aparecer o botao de remover na tela
    return li

}






//------------------ 👉  Dando Função ao chamado removeTarefa...............................REMOVER
function removeTarefa(posicao) {
    tarefas.splice(posicao, 1)
    salvarCategorias()
    mostrarCategorias()
}

// Fucão inserir apenas com Botao "Enter"
input.addEventListener('input', function (e) { // Porque o input vai disparar sempre que eu escrever qualquer coisa no input pesquisar
    pesquisa = input.value.toLowerCase() // vai buscar a variavel pesquisa, o valor dela ce transforma tudo em letras minusculas
    mostrarCategorias() // Redesenha a lista com base na pesquisa
})

//Funcao para chamar quando gravar as minhas tarefas, onde tarefa é meu objeto
function salvarCategorias() {
    localStorage.setItem("categorias", JSON.stringify(categorias))
}

mostrarCategorias()


