//Tenta Buscar tarefas guardadas, se nao existir Iniciar vazio
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || []

//
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

//Botao Adicionar Tarefa
/*btnAdicionar.addEventListener('click', function () {  // Evento ao carregar o btnAdicionar.

    let texto = input.value    // Chama apenas o valor dentro do input.

    if (texto.trim() === "" || !/[a-zA-Z0-9]/.test(texto)) {  // Verifica se esta vazio o input.
        modal.showModal() // Se estiver envia esta mensagem que esta criado no HTML
        return
    }

    //Se nao estiver vazio o (.push), adiciona ao objeto. --------------------------ADICIONAR
    tarefas.push({
        texto: texto.trim(),
        concluida: false
    })

    salvarTarefas() //Para chamar a funcao logo apos gravar com push

    mostrarTarefas()  // Faz aparecer o que escrevemos no input

    input.value = "" // Logo que aparecer, ele Limpa o input com este campo

})*/

// Botao Fechar o Dialogo
btnFechar.addEventListener('click', function () { //este codigo adiciona o evento do botao Entendido
    modal.close() // e este fecha o botao.
})

//Aqui muda tudo, muda os filtros, conforme for chamando pendentes, todos, ou concluidas.
function mudarFiltro(novoFiltro) {
    filtro = novoFiltro
    mostrarTarefas()
}


// Funcão chamar as tarefas
function mostrarTarefas() {

    lista.innerHTML = "" // Inicia vazio a lista no HTML.

    //sera criado novo array de nome tarefa, com filter passara verificar e retornar apenas se concluida for true.
    let tarefasFiltradas = tarefas.filter(function (tarefa) {
        if (filtro === "concluidas") {
            return tarefa.concluida === true
        }

        if (filtro === "pendentes") {
            return tarefa.concluida === false
        }

        return true // todas
    })

    tarefasFiltradas.forEach(function (tarefa, posicao) { // Criamos o Loop, passa a pegar a primeira tarefa no loop.

        let spanTexto = document.createElement("span") // criando uma variavel com elemento span
        spanTexto.classList.add("texto-tarefa") // atibui uma class para meu span
        let li = document.createElement("li") // Criação: O código cria um elemento <li></li>, para cada tarefa.

        let checkbox = document.createElement("input") // Criação: O código cria um elemento <input>.
        checkbox.type = "checkbox" // Aplica o tipo
        checkbox.checked = tarefa.concluida //Aqui marca que a tarefa ja esta concluida

        // Dando Evento ao chamado checkbox 
        checkbox.addEventListener('change', function () {
            tarefa.concluida = !tarefa.concluida
            salvarTarefas()
            mostrarTarefas()
        })


        //---------------------------------Aqui vamos dar ao input pesquisar uma nova forma de verificar assim uqe for encontrado o texto

        let textoOriginal = tarefa.texto // esta variavel guarda um novo texto. que vira do tarefa.texto
        if (pesquisa !== "") {
            let regex = new RegExp(`(${pesquisa})`, "gi") // procura todo texto, gi, g-> global, i -> ingnore case maisculas ou minusculas

            let textoComHighLight = textoOriginal.replace(regex, '<span class= "highlight">$1</span>')
            spanTexto.innerHTML = textoComHighLight
        } else {
            spanTexto.textContent = textoOriginal
        }




        /**spanTexto.textContent = `${tarefa.texto}` // transforma o elemento, ou faz aparecer este elemento no HTML. */
        li.appendChild(spanTexto)

        if (tarefa.concluida) {
            li.style.textDecoration = "line-through"
            li.style.opacity = "0.6"
        }

        li.prepend(checkbox)

        //--------------------------------------criar o botao para editar as tarefas
        let btnEditar = document.createElement("button")
        btnEditar.textContent = "✏️"

        // Dando um Evento ao Bot "✏️".
        btnEditar.addEventListener('click', function () {

            li.classList.add("editing")    // cria uma class para minha li,( nesse caso para cada tarefa da minha tarefa.)

            let textoOriginal = spanTexto.textContent
            spanTexto.contentEditable = true
            spanTexto.focus()

            //-----------------------------------------aqui crio a keydown( Quando carrego no Enter, ele adicina)
            spanTexto.addEventListener('keydown', function (e) {


                if (e.key === 'Enter') {
                    e.preventDefault()  // Previne a quebra de linha quando carregar enter
                    spanTexto.blur()
                }
                if (e.key === 'Escape') {
                    e.preventDefault() //PRevine a quebra de linha

                    spanTexto.textContent = textoOriginal // Para voltar ao texto Original
                    spanTexto.blur() // Para sair da edição
                }



            })


            let range = document.createRange() // cria a ferramenta para selecionar
            range.selectNodeContents(spanTexto) // diz seleciona o texto todo dentro da minha variavel Span
            range.collapse(false) // ruduz a selecão toda para apenas 1 ponto e false o final

            let selecao = window.getSelection() // vai buscar a seleção atual do browser
            selecao.removeAllRanges() // Limpa qualquer seleção anterior
            selecao.addRange(range) // Aplica a nova seleção com o cursor no fim





        })

        li.appendChild(btnEditar)
        lista.appendChild(li)







        //----------------------------------------------------------------------------
        //Criação de Botao Remover as tarefas adicionadas.
        let btnRemover = document.createElement("button")
        btnRemover.textContent = "❌"

        //Dando uma funcao ao Botao "❌".
        btnRemover.addEventListener('click', function () {
            removeTarefa(posicao)
        })


        li.appendChild(btnRemover) // aqui faz aparecer o botao na tela 
        lista.appendChild(li) // Pega o item e coloca na minha lista.


    })

    //-----------------------------------Criando um Botão para adicionar Inline


    let btnAddInline = document.createElement('button')
    btnAddInline.classList.add("btnAddInline")
    btnAddInline.textContent = "➕"

    lista.appendChild(btnAddInline)

    //-----------------------------------Aqui vamos dar a função para o Botao adicionar.

    btnAddInline.addEventListener('click', function () {
        let criaLiAfterAdd = document.createElement("li") // Criar meu elemento Li
        criaLiAfterAdd.classList.add("editing") // Vai me criar uma class com o nome editing
        let spanTexto = document.createElement("span") // Criar o meu elemento Span

        let existeEdicao = document.querySelector(".editing") // chama esta class para eu poder mecher nela
        if (existeEdicao) { // se ja existe edição, retorna 
            return
        }

        let cancelado = false // uma variavel recebendo falso

        //------------------------------------------- Criando o evento Blur, que é acabou de editar e sai do foco
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

            tarefas.push({
                texto: novoTexto,
                concluida: false
            })

            salvarTarefas()
            mostrarTarefas()

        })


        spanTexto.textContent = ""              // Faz aparecer no HTML vazio
        criaLiAfterAdd.appendChild(spanTexto)   // faz mostrar no HTML o meu spanTexto, que é o meu 

        // Faz aparecer dentro da minha Lista
        lista.insertBefore(criaLiAfterAdd, btnAddInline)
        spanTexto.contentEditable = true
        spanTexto.focus()




        //-----------------------------------------aqui crio a keydown( Quando carrego no Enter, ele adicina)
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
                    modal.showModal()
                    return
                }

                salvarTarefas()
                mostrarTarefas()
            }


        })


    })



    //---------------------Aqui vamos contruir o Progresso das Tarefas
    let total = tarefas.length // aqui o total recebe o objeto todo.length para correr toda length

    let concluidas = tarefas.filter(function (tarefa) {
        return tarefa.concluida === true
    }).length

    progReal.textContent = `${concluidas} / ${total}` // aqui diz mostra o meu progresso no html

    let barra = document.querySelector('.progresso-barra') // “vai buscar aquela div para eu poder mexer nela”
    let percentagem = (concluidas / total) * 100  // o calculo para achar a percentagem, onde divide concluidas que recebe o filter

    barra.style.width = percentagem + "%"


    //-----------------------Aqui vamos Mostrar o numero de tarefas pendentes e numero de tarefas concluidas

    let numPendente = tarefas.filter(function (tarefa) {
        return tarefa.concluida === false
    }).length

    pendentes.textContent = `⏳${numPendente} `

    //----------------------- Aqui vamos Mostrar o numero de tarefas concluidas-------------------------

    let numConcluidas = tarefas.filter(tarefa => tarefa.concluida === true).length
    totalizada.textContent = `✔ ${numConcluidas}`


}



// Dando Função ao chamado removeTarefa...............................REMOVER
function removeTarefa(posicao) {
    tarefas.splice(posicao, 1)
    salvarTarefas()
    mostrarTarefas()
}

// Fucão inserir apenas com Botao "Enter"
input.addEventListener('input', function (e) { // Porque o input vai disparar sempre que eu escrever qualquer coisa no input pesquisar
    pesquisa = input.value.toLowerCase() // vai buscar a variavel pesquisa, o valor dela ce transforma tudo em letras minusculas
    mostrarTarefas() // Redesenha a lista com base na pesquisa
})

//Funcao para chamar quando gravar as minhas tarefas, onde tarefa é meu objeto
function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas))
}




