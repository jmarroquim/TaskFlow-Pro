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