//Tenta Buscar tarefas guardadas, se nao existir Iniciar vazio
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || []

//
let filtro = "todas"




let input = document.querySelector('#taskInput') // Pegar o valor do Input.
let btnAdicionar = document.querySelector('#addBtn')   // Chamar o btnAdicionar.
let lista = document.querySelector('#taskList') // Chamada do que vai criar.

let modal = document.querySelector('#meuModal') // Chamada do Id do Dialog.
let btnFechar = document.querySelector('#btnfecharModal') // Chamada do Botao para fechar o Dialog.

let progReal = document.querySelector('.progReal') // Chamada para a Div do progresso real/“vai buscar aquela div para eu poder mexer nela”



//Botao Adicionar Tarefa
btnAdicionar.addEventListener('click', function () {  // Evento ao carregar o btnAdicionar.

    let texto = input.value    // Chama apenas o valor dentro do input.

    if (texto.trim() === "" || !/[a-zA-Z0-9]/.test(texto)) {  // Verifica se esta vazio o input.
        modal.showModal() // Se estiver envia esta mensagem.
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

})

// Botao Fechar o Dialogo
btnFechar.addEventListener('click', function () { //este codigo adiciona o evento do botao Entendido
    modal.close() // e este fecha o botao.
})

//Aqui muda tudo, muda os filtros.
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

        let li = document.createElement("li") // Criação: O código cria um elemento <li></li>.

        let checkbox = document.createElement("input") // Criação: O código cria um elemento <input>.
        checkbox.type = "checkbox" // Aplica o tipo
        checkbox.checked = tarefa.concluida //Aqui marca que a tarefa ja esta concluida

        // Dando Evento ao chamado checkbox 
        checkbox.addEventListener('change', function () {
            tarefa.concluida = !tarefa.concluida
            salvarTarefas()
            mostrarTarefas()
        })


        li.textContent = `${posicao + 1} - ${tarefa.texto}` // transforma o elemento, ou faz aparecer este elemento no HTML.

        if (tarefa.concluida) {
            li.style.textDecoration = "line-through"
            li.style.opacity = "0.6"
        }

        li.prepend(checkbox)

        //Criação de Botao Remover as tarefas adicionadas.
        let btnRemover = document.createElement("button")
        btnRemover.textContent = "❌"

        //Dando uma funcao ao Botao "❌".
        btnRemover.addEventListener('click', function () {
            removeTarefa(posicao)
        })


        li.appendChild(btnRemover)
        lista.appendChild(li) // Pega o item e coloca na minha lista.
    })


    //---------------------Aqui vamos contruir o Progresso das Tarefas
    let total = tarefas.length // aqui o total recebe o objeto todo.length para correr toda length

    let concluidas = tarefas.filter(function (tarefa) {
        return tarefa.concluida === true
    }).length

    progReal.textContent = `${concluidas} / ${total}` // aqui diz mostra o meu progresso no html

    let barra = document.querySelector('.progresso-barra') // “vai buscar aquela div para eu poder mexer nela”
    let percentagem = (concluidas / total) * 100  // o calculo para achar a percentagem 

    barra.style.width = percentagem + "%"


}



// Dando Função ao chamado removeTarefa...............................REMOVER
function removeTarefa(posicao) {
    tarefas.splice(posicao, 1)
    salvarTarefas()
    mostrarTarefas()
}

// Fucão inserir apenas com Botao "Enter"
input.addEventListener('keydown', function (e) {
    if (e.key === "Enter") {
        btnAdicionar.click()
    }
})

//Funcao para chamar quando gravar as minhas tarefas, onde tarefa é meu objeto
function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas))
}

