/*Tenta Buscar tarefas guardadas, se nao existir Iniciar vazio
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || []
*/

//Se ja existe categoria usa, se nao começa com Geral
let categorias = JSON.parse(localStorage.getItem("categorias")) || []

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


//------------------ 👉 Criando uma Categoria Global
/**
 * Isto abaixo diz, se nao existir nada cria uma categoria Geral
 */
if (categorias.length === 0) {
    categorias.push({
        nome: "Geral",
        tarefas: []
    })
    localStorage.setItem("categorias", JSON.stringify(categorias))
}


//-------------------  👉  Aqui vamos mostrar as categorias
function mostrarCategorias() {
    lista.innerHTML = "" // Limpa tudo
    document.body.classList.remove("modo-foco") // isto diz para mim sempre que redesenhar, limpa o modo foco antigo
    lista.classList.remove('modo-foco')

    categorias.forEach(function (categoria) { // Percorre categorias
        let card = document.createElement("div") // cria uma div
        card.classList.add("categoria-card")// atribui um nome a esta class de categoria-card

        if (categoria.nome === categoriaAberta) {
            card.classList.add('aberta')
            lista.classList.add('modo-foco')
            document.body.classList.add("modo-foco")
        }

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

        card.appendChild(titulo)

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
            e.stopPropagation() // impede que o clique afete outros elementos exemplo o body



            //regra para ignorar os cliques em elementos internos 
            if (
                e.target.tagName === "BUTTON" || // se clicar no botao ignora
                e.target.tagName === "INPUT" || // se clicar no input ignora
                e.target.isContentEditable // se estiver a editar o span ignora
            ) {
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
        btnAdd.addEventListener('click', function (e) {
            e.stopPropagation()

            let li = document.createElement("li")// Vai criar uma linha que vamos escrever a nova tarefa
            li.classList.add("editing") // Adiciona uma classe editing para depois por estilo



            let span = document.createElement("span") // cria uma span para funcionar depois como input

            li.appendChild(span) // coloca o span dentro do li
            listaTarefas.appendChild(li)// coloca o li dentro da lista (porque agora ja existe no DOM)

            span.contentEditable = true // Torna o texto editavel tipo no input
            span.focus()    //  coloca o cursor a piscar dentro do span

            let cancelado = false // variavel para controlar se o utilizador cancelou com ESC

            //------------------- 👉 EVENTO TECLADO
            span.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault() // previne quebra de linha
                    span.blur() // força a sair do campo obriga a gravar
                }

                if (e.key === 'Escape') {
                    cancelado = true //  marca que foi cancelado
                    li.remove() // removi a linha do Li e nao grava nada
                }
            })

            //------------------- 👉 EVENTO QUANDO SAI DO CAMPO
            span.addEventListener('blur', function () {

                if (cancelado) return // se foi cancelado com ESC, nao faz nada

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



        })

        card.appendChild(btnAdd)

        lista.appendChild(card)

        //---------------------Aqui vamos mostrar o historio das tarefas em cada card, quando tenho isso significa que ja tenho um card aberto
        if (categoria.nome === categoriaAberta) {
            console.log("ENTROU NO IF")
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


// Funcão chamar as tarefas
function mostrarTarefas() {

    lista.innerHTML = "" // Inicia vazio a lista no HTML.

    //sera criado novo array de nome tarefa, com filter passara verificar e retornar apenas se concluida for true.
    let tarefasFiltradas = filtrarTarefas() //assim tarefasFiltradas recebe os filtros da function acima.

    tarefasFiltradas.forEach(function (tarefa, posicao) { // Criamos o Loop, passa a pegar a primeira tarefa no loop.

        let li = criarElementosTarefa(tarefa, posicao)
        lista.appendChild(li)

    })

    //----------------- 👉 Criando um Botão para adicionar Inline


    let btnAddInline = document.createElement('button')
    btnAddInline.classList.add("btnAddInline")
    btnAddInline.textContent = "➕"

    lista.appendChild(btnAddInline)

    //----------------- 👉 Aqui vamos dar a função para o Botao adicionar.

    btnAddInline.addEventListener('click', function () {
        let criaLiAfterAdd = document.createElement("li") // Criar meu elemento Li
        criaLiAfterAdd.classList.add("editing") // Vai me criar uma class com o nome editing
        let spanTexto = document.createElement("span") // Criar o meu elemento Span

        let existeEdicao = document.querySelector(".editing") // chama esta class para eu poder mecher nela
        if (existeEdicao) { // se ja existe edição, retorna 
            return
        }

        let cancelado = false // uma variavel recebendo falso

        //----------------- 👉  Criando o evento Blur, que é acabou de editar e sai do foco
        spanTexto.addEventListener('blur', function () { // spanTexto é a minha variavel do input
            criaLiAfterAdd.classList.remove("editing") // Aqui estou a dizer para remover a class adicionada quando clicamos o botao add
            spanTexto.contentEditable = false // o false faz o texto parar de ser editavel.
            let novoTexto = spanTexto.textContent.trim()
            if (novoTexto === "") {
                criaLiAfterAdd.remove()
                return
            }

            if (cancelado) {
                return
            }

            categorias[0].tarefas.push({ // Dentro da categoria principal
                texto: novoTexto,
                concluida: false,

            })

            salvarCategorias()
            mostrarCategorias()

        })


        spanTexto.textContent = ""              // Faz aparecer no HTML vazio
        criaLiAfterAdd.appendChild(spanTexto)   // faz mostrar no HTML o meu spanTexto, que é o meu 

        // Faz aparecer dentro da minha Lista
        lista.insertBefore(criaLiAfterAdd, btnAddInline)
        spanTexto.contentEditable = true
        spanTexto.focus()




        //----------------- 👉 aqui crio a keydown( Quando carrego no Enter, ele adicina)
        spanTexto.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {    // se carregar no botao ESC
                cancelado = true
                criaLiAfterAdd.remove() // apaga a minha linha que criou quando carregue no botao +
            }

            if (e.key === 'Enter') {
                e.preventDefault()
                spanTexto.blur()

                let novoTexto = spanTexto.textContent.trim()// isto vai pegar o que utilizador escreveu no campo spanTexto

                if (novoTexto === "") {
                    modalTexto.textContent = "⚠️ Por favor, digite uma tarefa válida"
                    btnConfirmar.style.display = "none"
                    modal.showModal()
                }

                salvarCategorias()
                mostrarCategorias()
            }


        })


    })



    //--------------------- 👉 Aqui vamos contruir o Progresso das Tarefas
    /* let total = tarefas.length // aqui o total recebe o objeto todo.length para correr toda length
 
     let concluidas = tarefas.filter(function (tarefa) {
         return tarefa.concluida === true
     }).length
 
     progReal.textContent = `${concluidas} / ${total}` // aqui diz mostra o meu progresso no html
 
     let barra = document.querySelector('.progresso-barra') // “vai buscar aquela div para eu poder mexer nela”
     let percentagem = (concluidas / total) * 100  // o calculo para achar a percentagem, onde divide concluidas que recebe o filter
 
     barra.style.width = percentagem + "%"
 
 
    //----------------------- 👉 Aqui vamos Mostrar o numero de tarefas pendentes e numero de tarefas concluidas
 
    let numPendente = tarefas.filter(function (tarefa) {
        return tarefa.concluida === false
    }).length
 
    pendentes.textContent = `⏳${numPendente} `
 
    //----------------------- 👉  Aqui vamos Mostrar o numero de tarefas concluidas-------------------------
 
    let numConcluidas = tarefas.filter(tarefa => tarefa.concluida === true).length
    totalizada.textContent = `✔ ${numConcluidas}`
*/

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


