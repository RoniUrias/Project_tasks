const loginContainer = document.getElementById('login-container');
const cadastroContainer = document.getElementById('cadastro-container');
const plataforma = document.getElementById('plataforma');
const projetos = document.getElementById('projetos');
const calendarioArea = document.getElementById('calendario-area');
const tarefasArea = document.getElementById('tarefas-area');
const dataInput = document.getElementById('data-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const formularioCadastroProjeto = document.getElementById('formulario-cadastro-projeto');
const novoProjetoInput = document.getElementById('novo-projeto');
const prioridadeTarefa = document.getElementById('prioridade-tarefa');
const listaProjetosConteudo = document.getElementById('lista-projetos-conteudo');
const listaProjetos = document.getElementById('lista-projetos');

let usuarios = [{ usuario: "admin", senha: "123", email: "admin@email.com" }];
let projetosList = [];
let tarefas = {};

function fazerLogin() {
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;
  const valido = usuarios.find(u => u.usuario === usuario && u.senha === senha);

  if (valido) {
    loginContainer.classList.add('hidden');
    plataforma.classList.remove('hidden');
    carregarProjetos();
  } else {
    alert("Usuário ou senha incorretos.");
  }
}

function mostrarCadastro() {
  loginContainer.classList.add('hidden');
  cadastroContainer.classList.remove('hidden');
}

function voltarLogin() {
  cadastroContainer.classList.add('hidden');
  loginContainer.classList.remove('hidden');
}

function validarDominio(email) {
  const dominiosPermitidos = ['gmail.com', 'outlook.com', 'hotmail.com'];
  const dominio = email.split('@')[1]?.toLowerCase();
  return dominiosPermitidos.includes(dominio);
}

function cadastrarUsuario() {
  const novoUsuario = document.getElementById('novo-usuario').value.trim();
  const novaSenha = document.getElementById('nova-senha').value.trim();
  const novoEmail = document.getElementById('novo-email').value.trim().toLowerCase();

  if (!novoUsuario || !novaSenha || !novoEmail) {
    alert("Preencha todos os campos.");
    return;
  }

  if (!validarDominio(novoEmail)) {
    alert("O domínio do email não é permitido.");
    return;
  }

  if (usuarios.find(u => u.email === novoEmail)) {
    alert("Este email já está cadastrado.");
    return;
  }

  usuarios.push({ usuario: novoUsuario, senha: novaSenha, email: novoEmail });
  alert("Usuário cadastrado com sucesso!");
  voltarLogin();
}

function esqueciSenha() {
  const email = prompt("Digite o email cadastrado:");
  if (!email) return;

  const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (usuario) {
    alert(`Sua senha é: ${usuario.senha}`);
  } else {
    alert("Email não encontrado.");
  }
}

function carregarProjetos() {
  projetos.innerHTML = '<option value="">-- Selecione um projeto --</option>';
  listaProjetosConteudo.innerHTML = '';
  listaProjetos.classList.remove('hidden');

  projetosList.forEach(projeto => {
    const option = document.createElement('option');
    option.value = projeto;
    option.textContent = projeto;
    projetos.appendChild(option);

    const div = document.createElement('div');
    div.className = 'projeto-item';
    div.innerHTML = `<span>${projeto}</span><button class="btn-excluir-projeto" onclick="excluirProjeto('${projeto}')">Excluir</button>`;
    listaProjetosConteudo.appendChild(div);
  });
}

function mostrarFormularioCadastroProjeto() {
  formularioCadastroProjeto.classList.remove('hidden');
}

function cancelarCadastroProjeto() {
  formularioCadastroProjeto.classList.add('hidden');
}

function cadastrarProjeto() {
  const novoProjeto = novoProjetoInput.value.trim();
  if (novoProjeto && !projetosList.includes(novoProjeto)) {
    projetosList.push(novoProjeto);
    novoProjetoInput.value = '';
    formularioCadastroProjeto.classList.add('hidden');
    carregarProjetos();
    alert("Projeto cadastrado com sucesso!");
  } else {
    alert("Digite um nome válido e único para o projeto.");
  }
}

function excluirProjeto(nome) {
  if (confirm("Deseja excluir este projeto? Todas as tarefas também serão apagadas.")) {
    projetosList = projetosList.filter(p => p !== nome);
    for (const key in tarefas) {
      if (key.startsWith(nome + "_")) delete tarefas[key];
    }
    carregarProjetos();
    tarefasArea.classList.add('hidden');
    calendarioArea.classList.add('hidden');
  }
}

projetos.addEventListener('change', () => {
  if (projetos.value) {
    calendarioArea.classList.remove('hidden');
  } else {
    calendarioArea.classList.add('hidden');
    tarefasArea.classList.add('hidden');
  }
});

dataInput.addEventListener('change', () => {
  if (dataInput.value) {
    mostrarTarefas();
    tarefasArea.classList.remove('hidden');
  }
});

function adicionarTarefa() {
  const texto = document.getElementById('nova-tarefa').value.trim();
  const projeto = projetos.value;
  const data = dataInput.value;
  const corPrioridade = prioridadeTarefa.value;

  if (!texto) return;

  const chave = `${projeto}_${data}`;
  if (!tarefas[chave]) tarefas[chave] = [];

  tarefas[chave].push({ texto, concluida: false, corPrioridade });
  document.getElementById('nova-tarefa').value = '';
  mostrarTarefas();
}

function mostrarTarefas() {
  const projeto = projetos.value;
  const data = dataInput.value;
  const chave = `${projeto}_${data}`;
  const lista = tarefas[chave] || [];

  listaTarefas.innerHTML = '';

  lista.forEach((tarefa, index) => {
    const card = document.createElement('div');
    card.className = 'task' + (tarefa.concluida ? ' done' : '');
    card.style.borderLeft = `6px solid ${tarefa.corPrioridade}`;

    const header = document.createElement('div');
    header.className = 'task-header';

    const span = document.createElement('span');
    span.textContent = tarefa.texto;

    header.appendChild(span);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = tarefa.concluida;
    checkbox.onchange = () => {
      tarefa.concluida = !tarefa.concluida;
      mostrarTarefas();
    };

    const editarBtn = document.createElement('button');
    editarBtn.className = 'btn-editar';
    editarBtn.textContent = 'Editar';
    editarBtn.onclick = () => {
      const novoTexto = prompt('Editar tarefa:', tarefa.texto);
      if (novoTexto !== null && novoTexto.trim() !== '') {
        tarefa.texto = novoTexto.trim();
        mostrarTarefas();
      }
    };

    const excluirBtn = document.createElement('button');
    excluirBtn.className = 'btn-excluir';
    excluirBtn.textContent = 'Excluir';
    excluirBtn.onclick = () => {
      if (confirm('Deseja excluir esta tarefa?')) {
        lista.splice(index, 1);
        mostrarTarefas();
      }
    };

    actions.appendChild(checkbox);
    actions.appendChild(editarBtn);
    actions.appendChild(excluirBtn);

    card.appendChild(header);
    card.appendChild(actions);

    listaTarefas.appendChild(card);
  });
}
