


//Funcao para chamar quando gravar as minhas tarefas, onde tarefa é meu objeto
function salvarCategorias() {
    localStorage.setItem("categorias", JSON.stringify(categorias))
}


function carregarCategorias() {

    /**
     * json.parse(...) => transform text into array/objet again
     * localStorage.getItem(...) => get saved data
     * 
     */
    return JSON.parse(localStorage.getItem("categorias")) || [] //get saved data
}