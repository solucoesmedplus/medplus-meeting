// =========================================================
// CONFIGURAÇÃO DO SUPABASE
// Troque os valores abaixo pelos dados do seu projeto.
// Supabase > Project Settings > API
// =========================================================
const SUPABASE_URL = "https://rwhhrjiuaefeahqznzrf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_YDRF707kP3JD8ow8VtgAkg_c5qNe5Qq";

// =========================================================
// CLIENTE SUPABASE
// =========================================================
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =========================================================
// ESTADO DO SISTEMA
// =========================================================
const state = {
  user: null,
  perfil: null,
  usuarios: [],
  grupos: [],
  setores: [],
  setoresGrupos: [],
  adminUsuarios: [],
  novoGrupoSelecionados: [],
  usuarioSelecionado: null,
  conversaAtual: null,
  conversaTipo: null,
  participantesAtual: [],
  mensagensChannel: null,
  notificacoesChannel: null,
  perfilChannel: null,
  jitsiApi: null,
  salaAtualJitsi: null,
  janelaReuniaoExterna: null,

  lousas: [],
  lousaAtual: null,
  lousaChannel: null,
  lousaSalvamentoTimer: null,
  lousaAlterada: false,

  mobileView: "conversas"
};

// =========================================================
// ELEMENTOS
// =========================================================
const $ = (id) => document.getElementById(id);

const els = {
  toast: $("toast"),
  configAlert: $("configAlert"),

  authScreen: $("authScreen"),
  appScreen: $("appScreen"),

  tabLogin: $("tabLogin"),
  tabCadastro: $("tabCadastro"),
  loginForm: $("loginForm"),
  cadastroForm: $("cadastroForm"),

  loginEmail: $("loginEmail"),
  loginSenha: $("loginSenha"),
  cadastroNome: $("cadastroNome"),
  cadastroEmail: $("cadastroEmail"),
  cadastroSenha: $("cadastroSenha"),

  usuarioLogado: $("usuarioLogado"),
  btnSair: $("btnSair"),
  btnAtualizarUsuarios: $("btnAtualizarUsuarios"),
  btnAdmin: $("btnAdmin"),

  buscarUsuario: $("buscarUsuario"),
  usuariosLista: $("usuariosLista"),
  gruposLista: $("gruposLista"),
  totalUsuarios: $("totalUsuarios"),
  contadorUsuarios: $("contadorUsuarios"),
  totalGrupos: $("totalGrupos"),
  btnNovoGrupo: $("btnNovoGrupo"),
  grupoModal: $("grupoModal"),
  btnFecharGrupoModal: $("btnFecharGrupoModal"),
  grupoForm: $("grupoForm"),
  grupoNome: $("grupoNome"),
  grupoBuscaUsuario: $("grupoBuscaUsuario"),
  grupoUsuariosLista: $("grupoUsuariosLista"),
  grupoSelecionadosInfo: $("grupoSelecionadosInfo"),
  btnCriarGrupo: $("btnCriarGrupo"),
  btnCancelarGrupo: $("btnCancelarGrupo"),

  chatTitulo: $("chatTitulo"),
  chatSubtitulo: $("chatSubtitulo"),
  mensagensLista: $("mensagensLista"),
  mensagemForm: $("mensagemForm"),
  mensagemTexto: $("mensagemTexto"),
  btnEnviarMensagem: $("btnEnviarMensagem"),

  btnAbrirLousa: $("btnAbrirLousa"),
  lousaPanel: $("lousaPanel"),
  lousaContexto: $("lousaContexto"),
  btnFecharLousa: $("btnFecharLousa"),
  btnNovaLousa: $("btnNovaLousa"),
  btnSalvarLousa: $("btnSalvarLousa"),
  btnLimparLousa: $("btnLimparLousa"),
  btnExcluirLousa: $("btnExcluirLousa"),
  lousaSelect: $("lousaSelect"),
  lousaTitulo: $("lousaTitulo"),
  lousaTexto: $("lousaTexto"),
  lousaCriadoPor: $("lousaCriadoPor"),
  lousaAtualizadoPor: $("lousaAtualizadoPor"),
  lousaStatus: $("lousaStatus"),

  btnIniciarReuniao: $("btnIniciarReuniao"),
  meetingPanel: $("meetingPanel"),
  meetingRoomName: $("meetingRoomName"),
  btnFecharReuniao: $("btnFecharReuniao"),
  meet: $("meet"),

  adminModal: $("adminModal"),
  btnFecharAdmin: $("btnFecharAdmin"),
  adminTabUsuarios: $("adminTabUsuarios"),
  adminTabSetores: $("adminTabSetores"),
  adminUsuariosPainel: $("adminUsuariosPainel"),
  adminSetoresPainel: $("adminSetoresPainel"),
  btnAtualizarAdminUsuarios: $("btnAtualizarAdminUsuarios"),
  adminUsuariosTabela: $("adminUsuariosTabela"),
  adminUsuarioSelecionadoInfo: $("adminUsuarioSelecionadoInfo"),
  adminUsuarioForm: $("adminUsuarioForm"),
  adminUsuarioId: $("adminUsuarioId"),
  adminUsuarioNome: $("adminUsuarioNome"),
  adminUsuarioCargo: $("adminUsuarioCargo"),
  adminUsuarioSetor: $("adminUsuarioSetor"),
  adminUsuarioAdmin: $("adminUsuarioAdmin"),
  adminUsuarioAtivo: $("adminUsuarioAtivo"),
  btnSalvarAdminUsuario: $("btnSalvarAdminUsuario"),
  btnLimparAdminUsuario: $("btnLimparAdminUsuario"),
  adminSetorForm: $("adminSetorForm"),
  adminSetorId: $("adminSetorId"),
  adminSetorNome: $("adminSetorNome"),
  adminSetorAtivo: $("adminSetorAtivo"),
  btnLimparSetor: $("btnLimparSetor"),
  btnAtualizarSetores: $("btnAtualizarSetores"),
  adminSetoresLista: $("adminSetoresLista"),
  btnSincronizarGrupos: $("btnSincronizarGrupos"),
  adminGruposResultado: $("adminGruposResultado"),

  bloqueioModal: $("bloqueioModal"),
  bloqueioMensagem: $("bloqueioMensagem"),
  btnBloqueioOk: $("btnBloqueioOk"),

  mobileTabConversas: $("mobileTabConversas"),
  mobileTabChat: $("mobileTabChat"),
  mobileTabLousa: $("mobileTabLousa"),
  mobileTabReuniao: $("mobileTabReuniao"),
  mobileTabAdmin: $("mobileTabAdmin")
};

// =========================================================
// INICIALIZAÇÃO
// =========================================================
document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {
  configurarEventos();

  if (!configuracaoSupabaseValida()) {
    els.configAlert.classList.remove("hidden");
    toast("Configure o Supabase no arquivo script.js para começar.");
    return;
  }

  const { data } = await supabaseClient.auth.getSession();

  if (data.session?.user) {
    await carregarSistema(data.session.user);
  }

  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      await carregarSistema(session.user);
    }

    if (event === "SIGNED_OUT") {
      limparEstado();
      mostrarLogin();
    }
  });
}

function configurarEventos() {
  els.tabLogin.addEventListener("click", mostrarAbaLogin);
  els.tabCadastro.addEventListener("click", mostrarAbaCadastro);

  els.loginForm.addEventListener("submit", entrar);
  els.cadastroForm.addEventListener("submit", cadastrar);

  els.btnSair.addEventListener("click", sair);
  els.btnAtualizarUsuarios.addEventListener("click", atualizarConversasLaterais);
  els.btnNovoGrupo.addEventListener("click", abrirModalNovoGrupo);
  els.btnFecharGrupoModal.addEventListener("click", fecharModalNovoGrupo);
  els.btnCancelarGrupo.addEventListener("click", fecharModalNovoGrupo);
  els.grupoForm.addEventListener("submit", criarGrupoPersonalizado);
  els.grupoBuscaUsuario.addEventListener("input", renderizarUsuariosNovoGrupo);
  els.btnAdmin.addEventListener("click", abrirAdmin);
  els.btnFecharAdmin.addEventListener("click", fecharAdmin);
  els.adminTabUsuarios.addEventListener("click", () => mostrarAbaAdmin("usuarios"));
  els.adminTabSetores.addEventListener("click", () => mostrarAbaAdmin("setores"));
  els.btnAtualizarAdminUsuarios.addEventListener("click", carregarAdminUsuarios);
  els.adminUsuarioForm.addEventListener("submit", salvarAdminUsuario);
  els.btnLimparAdminUsuario.addEventListener("click", limparFormularioAdminUsuario);
  els.adminSetorForm.addEventListener("submit", salvarSetor);
  els.btnLimparSetor.addEventListener("click", limparFormularioSetor);
  els.btnAtualizarSetores.addEventListener("click", carregarSetores);
  els.btnSincronizarGrupos.addEventListener("click", sincronizarGruposSetores);
  els.btnBloqueioOk.addEventListener("click", fecharBloqueioUsuario);

  els.buscarUsuario.addEventListener("input", () => {
    renderizarUsuarios();
    renderizarGrupos();
  });
  els.mensagemForm.addEventListener("submit", enviarMensagem);

  els.btnAbrirLousa.addEventListener("click", abrirLousa);
  els.btnFecharLousa.addEventListener("click", () => fecharLousa(true));
  els.btnNovaLousa.addEventListener("click", criarNovaLousa);
  els.btnSalvarLousa.addEventListener("click", salvarLousaAtual);
  els.btnLimparLousa.addEventListener("click", limparLousaAtual);
  els.btnExcluirLousa.addEventListener("click", excluirLousaAtual);
  els.lousaSelect.addEventListener("change", trocarLousaSelecionada);
  els.lousaTitulo.addEventListener("input", marcarLousaAlterada);
  els.lousaTexto.addEventListener("input", marcarLousaAlterada);

  els.btnIniciarReuniao.addEventListener("click", iniciarReuniao);
  els.btnFecharReuniao.addEventListener("click", fecharReuniao);

  document.querySelectorAll("[data-mobile-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.mobileView === "lousa") {
        abrirLousa();
        return;
      }

      selecionarTelaMobile(btn.dataset.mobileView);
    });
  });

  window.addEventListener("resize", ajustarLayoutMobile);

}

function configuracaoSupabaseValida() {
  return (
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("COLE_AQUI") &&
    !SUPABASE_ANON_KEY.includes("COLE_AQUI")
  );
}

// =========================================================
// LOGIN / CADASTRO
// =========================================================
function mostrarAbaLogin() {
  els.tabLogin.classList.add("active");
  els.tabCadastro.classList.remove("active");
  els.loginForm.classList.remove("hidden");
  els.cadastroForm.classList.add("hidden");
}

function mostrarAbaCadastro() {
  els.tabCadastro.classList.add("active");
  els.tabLogin.classList.remove("active");
  els.cadastroForm.classList.remove("hidden");
  els.loginForm.classList.add("hidden");
}

async function entrar(event) {
  event.preventDefault();

  const email = els.loginEmail.value.trim();
  const password = els.loginSenha.value.trim();

  if (!email || !password) {
    toast("Informe o e-mail e a senha.");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    toast("Erro ao entrar: " + traduzirErro(error.message));
    return;
  }

  toast("Login realizado com sucesso.");
}

async function cadastrar(event) {
  event.preventDefault();

  const nome = els.cadastroNome.value.trim();
  const email = els.cadastroEmail.value.trim();
  const password = els.cadastroSenha.value.trim();

  if (!nome || !email || !password) {
    toast("Preencha todos os campos.");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { nome }
    }
  });

  if (error) {
    toast("Erro ao cadastrar: " + traduzirErro(error.message));
    return;
  }

  if (!data.session) {
    toast("Usuário criado. Verifique o e-mail para confirmar a conta, se a confirmação estiver ativa.");
    mostrarAbaLogin();
    return;
  }

  toast("Usuário criado e logado com sucesso.");
}

async function sair() {
  await atualizarStatus("offline");
  await supabaseClient.auth.signOut();
}

function mostrarLogin() {
  els.authScreen.classList.remove("hidden");
  els.appScreen.classList.add("hidden");
}

// =========================================================
// CARREGAR SISTEMA
// =========================================================
async function carregarSistema(user) {
  state.user = user;

  await garantirPerfil();

  const acessoLiberado = await verificarAcessoUsuario();
  if (!acessoLiberado) return;

  els.authScreen.classList.add("hidden");
  els.appScreen.classList.remove("hidden");

  await atualizarStatus("online");
  await carregarPerfil();

  if (!validarUsuarioAtivo()) return;

  atualizarVisibilidadeAdmin();
  els.btnAbrirLousa.disabled = false;
  selecionarTelaMobile("conversas", false);
  await atualizarConversasLaterais();
  assinarNotificacoes();
  assinarMeuPerfil();
  ajustarLayoutMobile();
}

async function garantirPerfil() {
  const nomePadrao =
    state.user.user_metadata?.nome ||
    state.user.email?.split("@")[0] ||
    "Usuário";

  await supabaseClient.from("perfis").upsert({
    id: state.user.id,
    nome: nomePadrao,
    email: state.user.email,
    ultimo_acesso: new Date().toISOString()
  });
}

async function carregarPerfil() {
  const { data, error } = await supabaseClient
    .from("perfis")
    .select("id, nome, email, cargo, status, is_admin, ativo, setor_id")
    .eq("id", state.user.id)
    .single();

  if (error) {
    toast("Erro ao carregar perfil: " + error.message);
    return;
  }

  state.perfil = data;
  els.usuarioLogado.textContent = `${data.nome} • ${data.email}`;
}

async function verificarAcessoUsuario() {
  const { data, error } = await supabaseClient.rpc("verificar_meu_acesso");

  // Fallback para quem ainda não executou o SQL da Etapa 3.5.
  if (error) {
    await carregarPerfil();
    return validarUsuarioAtivo();
  }

  const acesso = data?.[0];

  if (!acesso) {
    mostrarBloqueioUsuario("Não foi possível validar seu acesso. Procure o administrador.");
    await supabaseClient.auth.signOut();
    return false;
  }

  state.perfil = {
    id: acesso.id,
    nome: acesso.nome,
    email: acesso.email,
    cargo: acesso.cargo,
    is_admin: acesso.is_admin,
    ativo: acesso.ativo
  };

  if (acesso.ativo === false) {
    mostrarBloqueioUsuario(acesso.motivo || "Seu usuário está inativo. Procure o administrador.");
    await supabaseClient.auth.signOut();
    return false;
  }

  return true;
}

async function atualizarStatus(status) {
  if (!state.user) return;

  await supabaseClient
    .from("perfis")
    .update({
      status,
      ultimo_acesso: new Date().toISOString()
    })
    .eq("id", state.user.id);
}

// =========================================================
// USUÁRIOS
// =========================================================
async function carregarUsuarios() {
  const { data, error } = await supabaseClient
    .from("perfis")
    .select("id, nome, email, cargo, status, ativo, is_admin, setor_id, setores(nome)")
    .neq("id", state.user.id)
    .eq("ativo", true)
    .order("nome", { ascending: true });

  if (error) {
    toast("Erro ao carregar usuários: " + error.message);
    return;
  }

  state.usuarios = data || [];
  renderizarUsuarios();
}

async function atualizarConversasLaterais() {
  await carregarUsuarios();
  await carregarGrupos();
}

async function carregarGrupos() {
  const { data, error } = await supabaseClient.rpc("listar_grupos_do_usuario");

  if (error) {
    console.warn("Erro ao carregar grupos:", error.message);
    state.grupos = [];
    renderizarGrupos();
    return;
  }

  state.grupos = data || [];
  renderizarGrupos();
}

function renderizarGrupos() {
  const termo = els.buscarUsuario.value.trim().toLowerCase();

  const gruposFiltrados = state.grupos.filter((g) => {
    return (
      g.nome?.toLowerCase().includes(termo) ||
      g.setor_nome?.toLowerCase().includes(termo) ||
      g.tipo_grupo?.toLowerCase().includes(termo)
    );
  });

  els.totalGrupos.textContent = gruposFiltrados.length;
  els.totalUsuarios.textContent = state.usuarios.length + state.grupos.length;

  if (!gruposFiltrados.length) {
    els.gruposLista.innerHTML = `
      <div class="empty">
        Nenhum grupo encontrado.<br>
        Clique em <strong>+ Grupo</strong> para criar um grupo manual ou sincronize grupos por setor no Admin.
      </div>
    `;
    return;
  }

  els.gruposLista.innerHTML = gruposFiltrados
    .map((g) => {
      const ativo = state.conversaTipo === "grupo" && state.conversaAtual?.id === g.conversa_id ? "active" : "";
      const participantes = Number(g.participantes || 0);
      const descricaoParticipantes = participantes === 1
        ? "1 participante"
        : `${participantes} participantes`;

      const tipoGrupo = g.tipo_grupo || (g.setor_id ? "setor" : "personalizado");
      const subtitulo = tipoGrupo === "setor"
        ? `${g.setor_nome || "Setor"} • ${descricaoParticipantes}`
        : `Personalizado • ${descricaoParticipantes}`;

      const icone = tipoGrupo === "setor" ? "#" : "👥";

      return `
        <button class="user-item group ${ativo}" type="button" data-group-id="${g.conversa_id}">
          <div class="avatar">${icone}</div>
          <div class="user-info">
            <strong>${escapeHtml(g.nome || "Grupo")}</strong>
            <span>${escapeHtml(subtitulo)}</span>
          </div>
        </button>
      `;
    })
    .join("");

  document.querySelectorAll(".user-item.group").forEach((btn) => {
    btn.addEventListener("click", () => {
      const grupoId = btn.dataset.groupId;
      const grupo = state.grupos.find((g) => g.conversa_id === grupoId);
      if (grupo) abrirGrupo(grupo);
    });
  });
}

function renderizarUsuarios() {
  const termo = els.buscarUsuario.value.trim().toLowerCase();

  const usuariosFiltrados = state.usuarios.filter((u) => {
    return (
      u.nome?.toLowerCase().includes(termo) ||
      u.email?.toLowerCase().includes(termo) ||
      u.cargo?.toLowerCase().includes(termo)
    );
  });

  els.totalUsuarios.textContent = usuariosFiltrados.length + state.grupos.length;
  els.contadorUsuarios.textContent = usuariosFiltrados.length;

  if (!usuariosFiltrados.length) {
    els.usuariosLista.innerHTML = `<div class="empty">Nenhum usuário encontrado.</div>`;
    return;
  }

  els.usuariosLista.innerHTML = usuariosFiltrados
    .map((u) => {
      const ativo = state.conversaTipo === "individual" && state.usuarioSelecionado?.id === u.id ? "active" : "";
      const inicial = pegarInicial(u.nome || u.email);
      const statusClasse = u.status === "online" ? "online" : "";

      return `
        <button class="user-item ${ativo}" type="button" data-user-id="${u.id}">
          <div class="avatar">${inicial}</div>
          <div class="user-info">
            <strong>${escapeHtml(u.nome || "Sem nome")}</strong>
            <span>${escapeHtml(u.cargo || "Usuário")} • ${escapeHtml(u.setores?.nome || "Sem setor")}</span>
          </div>
          <span class="status-dot ${statusClasse}" title="${u.status || "offline"}"></span>
        </button>
      `;
    })
    .join("");

  document.querySelectorAll(".user-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const usuarioId = btn.dataset.userId;
      const usuario = state.usuarios.find((u) => u.id === usuarioId);
      if (usuario) abrirConversaCom(usuario);
    });
  });
}

// =========================================================
// CONVERSAS
// =========================================================
async function abrirConversaCom(usuario) {
  if (!usuarioPodeUsarSistema()) return;

  state.usuarioSelecionado = usuario;
  state.conversaAtual = null;
  state.conversaTipo = "individual";
  state.participantesAtual = [];

  renderizarUsuarios();
  renderizarGrupos();

  els.chatTitulo.textContent = usuario.nome || usuario.email;
  els.chatSubtitulo.textContent = usuario.email || "Conversa individual";
  els.mensagensLista.innerHTML = `<div class="empty">Preparando conversa...</div>`;

  // Enquanto a conversa não estiver pronta, não deixa enviar mensagem nem iniciar reunião.
  els.btnIniciarReuniao.disabled = true;
  els.mensagemTexto.disabled = true;
  els.btnEnviarMensagem.disabled = true;

  const conversa = await buscarOuCriarConversaIndividual(usuario.id);

  if (!conversa || !conversa.id) {
    els.mensagensLista.innerHTML = `
      <div class="empty">
        Não foi possível abrir a conversa.<br>
        Rode o SQL de correção no Supabase e tente novamente.
      </div>
    `;
    toast("Não foi possível abrir a conversa.");
    return;
  }

  state.conversaAtual = conversa;
  state.participantesAtual = [state.user.id, usuario.id];

  els.btnIniciarReuniao.disabled = false;
  els.btnAbrirLousa.disabled = false;
  els.mensagemTexto.disabled = false;
  els.btnEnviarMensagem.disabled = false;
  await prepararLousaAoTrocarConversa();
  selecionarTelaMobile("chat", false);

  if (!isMobile()) {
    els.mensagemTexto.focus();
  }

  await carregarMensagens();
  assinarMensagensDaConversa();
}


async function abrirGrupo(grupo) {
  if (!usuarioPodeUsarSistema()) return;

  state.usuarioSelecionado = null;
  state.conversaAtual = {
    id: grupo.conversa_id,
    tipo: "grupo",
    nome: grupo.nome,
    setor_id: grupo.setor_id,
    criado_em: grupo.criado_em
  };
  state.conversaTipo = "grupo";
  state.participantesAtual = [state.user.id];

  renderizarUsuarios();
  renderizarGrupos();

  const participantesGrupo = Number(grupo.participantes || 0);
  const tipoGrupo = grupo.tipo_grupo || (grupo.setor_id ? "setor" : "personalizado");
  const descricaoGrupo = tipoGrupo === "setor"
    ? `${grupo.setor_nome || "Setor"} • ${participantesGrupo} participante(s)`
    : `Grupo personalizado • ${participantesGrupo} participante(s)`;

  els.chatTitulo.textContent = grupo.nome || "Grupo";
  els.chatSubtitulo.textContent = descricaoGrupo;
  els.mensagensLista.innerHTML = `<div class="empty">Carregando grupo...</div>`;

  els.btnIniciarReuniao.disabled = false;
  els.btnAbrirLousa.disabled = false;
  els.mensagemTexto.disabled = false;
  els.btnEnviarMensagem.disabled = false;
  await prepararLousaAoTrocarConversa();
  selecionarTelaMobile("chat", false);

  if (!isMobile()) {
    els.mensagemTexto.focus();
  }

  await carregarParticipantesDaConversa(grupo.conversa_id);
  await carregarMensagens();
  assinarMensagensDaConversa();
}


async function carregarParticipantesDaConversa(conversaId) {
  // Se você rodar o SQL complementar da Etapa 3.2, esta função retorna todos os participantes.
  // Se não rodar, o sistema mantém pelo menos o usuário atual e o chat continua funcionando.
  const { data, error } = await supabaseClient.rpc("listar_participantes_conversa_seguro", {
    p_conversa_id: conversaId
  });

  if (error || !data) {
    state.participantesAtual = [state.user.id];
    return;
  }

  state.participantesAtual = data.map((item) => item.usuario_id);
}

async function buscarOuCriarConversaIndividual(outroUsuarioId) {
  // Agora usamos uma função SQL no Supabase para criar/buscar a conversa
  // e gravar os participantes de forma segura, evitando erro de RLS.
  const { data, error } = await supabaseClient.rpc("obter_ou_criar_conversa_individual", {
    p_outro_usuario_id: outroUsuarioId
  });

  if (error) {
    toast("Erro ao abrir conversa: " + error.message);
    console.error("Erro RPC conversa:", error);
    return null;
  }

  if (!data || !data.length) {
    toast("A conversa não foi retornada pelo Supabase.");
    return null;
  }

  return data[0];
}

async function garantirParticipantes(conversaId, outroUsuarioId) {
  const participantes = [
    { conversa_id: conversaId, usuario_id: state.user.id },
    { conversa_id: conversaId, usuario_id: outroUsuarioId }
  ];

  const { error } = await supabaseClient
    .from("participantes_conversa")
    .upsert(participantes, {
      onConflict: "conversa_id,usuario_id",
      ignoreDuplicates: true
    });

  if (error) {
    toast("Erro ao salvar participantes: " + error.message);
  }
}

// =========================================================
// MENSAGENS
// =========================================================
async function carregarMensagens() {
  if (!state.conversaAtual) return;

  const { data, error } = await supabaseClient
    .from("mensagens")
    .select("id, conteudo, tipo, criado_em, remetente_id, perfis(nome, email)")
    .eq("conversa_id", state.conversaAtual.id)
    .order("criado_em", { ascending: true });

  if (error) {
    els.mensagensLista.innerHTML = `<div class="empty">Erro ao carregar mensagens.</div>`;
    toast("Erro ao carregar mensagens: " + error.message);
    return;
  }

  renderizarMensagens(data || []);
}

function renderizarMensagens(mensagens) {
  if (!mensagens.length) {
    els.mensagensLista.innerHTML = `<div class="welcome"><h3>Nenhuma mensagem ainda</h3><p>Envie a primeira mensagem.</p></div>`;
    return;
  }

  els.mensagensLista.innerHTML = mensagens.map(criarHtmlMensagem).join("");
  rolarMensagensParaBaixo();
}

function adicionarMensagemNaTela(mensagem) {
  const welcome = els.mensagensLista.querySelector(".welcome, .empty");
  if (welcome) els.mensagensLista.innerHTML = "";

  const temp = document.createElement("div");
  temp.innerHTML = criarHtmlMensagem(mensagem);
  els.mensagensLista.appendChild(temp.firstElementChild);
  rolarMensagensParaBaixo();
}

function criarHtmlMensagem(m) {
  const minha = m.remetente_id === state.user.id;
  const sistema = m.tipo === "sistema";
  const classe = sistema ? "system" : minha ? "mine" : "";
  const nome = sistema ? "Sistema" : m.perfis?.nome || "Usuário";
  const hora = formatarHora(m.criado_em);

  return `
    <div class="message ${classe}" data-message-id="${m.id}">
      ${!minha && !sistema ? `<span class="name">${escapeHtml(nome)}</span>` : ""}
      <div class="text">${escapeHtml(m.conteudo)}</div>
      <span class="time">${hora}</span>
    </div>
  `;
}

async function enviarMensagem(event) {
  event.preventDefault();

  if (!usuarioPodeUsarSistema()) return;

  if (!state.conversaAtual) {
    toast("Selecione uma conversa primeiro.");
    return;
  }

  const conteudo = els.mensagemTexto.value.trim();

  if (!conteudo) return;

  els.mensagemTexto.value = "";

  const { error } = await supabaseClient.from("mensagens").insert({
    conversa_id: state.conversaAtual.id,
    remetente_id: state.user.id,
    conteudo,
    tipo: "texto"
  });

  if (error) {
    toast("Erro ao enviar mensagem: " + error.message);
    return;
  }

  await notificarOutrosParticipantes("Nova mensagem", conteudo, "mensagem");
}

function assinarMensagensDaConversa() {
  if (state.mensagensChannel) {
    supabaseClient.removeChannel(state.mensagensChannel);
  }

  state.mensagensChannel = supabaseClient
    .channel(`mensagens-${state.conversaAtual.id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "mensagens",
        filter: `conversa_id=eq.${state.conversaAtual.id}`
      },
      async (payload) => {
        const mensagem = await buscarMensagemCompleta(payload.new.id);

        if (!mensagem) return;

        adicionarMensagemNaTela(mensagem);

        if (mensagem.remetente_id !== state.user.id) {
          beep();
          toast("Nova mensagem recebida.");
        }
      }
    )
    .subscribe();
}

async function buscarMensagemCompleta(id) {
  const { data, error } = await supabaseClient
    .from("mensagens")
    .select("id, conteudo, tipo, criado_em, remetente_id, perfis(nome, email)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}


// =========================================================
// LOUSA DE ANOTAÇÕES GERAIS
// =========================================================
async function abrirLousa() {
  if (!usuarioPodeUsarSistema()) return;

  els.lousaPanel.classList.remove("hidden");
  document.querySelector(".layout").classList.add("with-lousa");
  atualizarContextoLousa();

  await carregarLousasGerais();
  assinarLousasGerais();

  selecionarTelaMobile("lousa", false);
}

function fecharLousa(mostrarMensagem = true) {
  if (state.lousaSalvamentoTimer) {
    clearTimeout(state.lousaSalvamentoTimer);
    state.lousaSalvamentoTimer = null;
  }

  if (state.lousaChannel) {
    supabaseClient.removeChannel(state.lousaChannel);
    state.lousaChannel = null;
  }

  els.lousaPanel.classList.add("hidden");
  document.querySelector(".layout").classList.remove("with-lousa");

  if (isMobile() && state.mobileView === "lousa") {
    selecionarTelaMobile(state.conversaAtual ? "chat" : "conversas", false);
  }

  if (mostrarMensagem) {
    toast("Lousa fechada.");
  }
}

async function prepararLousaAoTrocarConversa() {
  atualizarContextoLousa();

  if (!els.lousaPanel.classList.contains("hidden")) {
    await carregarLousasGerais();
    assinarLousasGerais();
  }
}

function atualizarContextoLousa() {
  els.lousaContexto.textContent = "Anotações gerais disponíveis para todos os usuários.";
}

async function carregarLousasGerais() {
  els.lousaStatus.textContent = "Carregando anotações gerais...";

  const { data, error } = await supabaseClient
    .from("lousas_gerais")
    .select(`
      id,
      titulo,
      conteudo,
      criado_por,
      atualizado_por,
      criado_em,
      atualizado_em,
      criador:perfis!lousas_gerais_criado_por_fkey(nome, email),
      atualizador:perfis!lousas_gerais_atualizado_por_fkey(nome, email)
    `)
    .order("atualizado_em", { ascending: false });

  if (error) {
    toast("Erro ao carregar lousa: " + error.message);
    els.lousaStatus.textContent = "Erro ao carregar anotações.";
    travarCamposLousa(true);
    return;
  }

  state.lousas = data || [];

  if (!state.lousas.length) {
    await criarNovaLousa("Anotações gerais");
    return;
  }

  const idAtual = state.lousaAtual?.id;
  const continuarNaMesma = state.lousas.find((l) => l.id === idAtual);
  state.lousaAtual = continuarNaMesma || state.lousas[0];

  renderizarSelectLousas();
  preencherLousaAtual();
  travarCamposLousa(false);
  els.lousaStatus.textContent = "Anotação geral carregada.";
}

function renderizarSelectLousas() {
  if (!state.lousas.length) {
    els.lousaSelect.innerHTML = `<option value="">Nenhuma anotação</option>`;
    return;
  }

  els.lousaSelect.innerHTML = state.lousas
    .map((l) => {
      const autor = obterNomePerfil(l.criador);
      const titulo = l.titulo || "Sem título";
      return `<option value="${l.id}">${escapeHtml(titulo)} • ${escapeHtml(autor)}</option>`;
    })
    .join("");

  els.lousaSelect.value = state.lousaAtual?.id || "";
}

function preencherLousaAtual() {
  const lousa = state.lousaAtual;

  els.lousaTitulo.value = lousa?.titulo || "";
  els.lousaTexto.value = lousa?.conteudo || "";
  els.lousaCriadoPor.textContent = lousa ? obterNomePerfil(lousa.criador) : "-";
  els.lousaAtualizadoPor.textContent = lousa ? obterNomePerfil(lousa.atualizador) : "-";
  state.lousaAlterada = false;
}

function obterNomePerfil(perfil) {
  if (!perfil) return "Usuário não identificado";
  return perfil.nome || perfil.email || "Usuário não identificado";
}

function travarCamposLousa(travar) {
  els.lousaSelect.disabled = travar || !state.lousas.length;
  els.lousaTitulo.disabled = travar || !state.lousaAtual;
  els.lousaTexto.disabled = travar || !state.lousaAtual;
  els.btnSalvarLousa.disabled = travar || !state.lousaAtual;
  els.btnLimparLousa.disabled = travar || !state.lousaAtual;
  els.btnExcluirLousa.disabled = travar || !state.lousaAtual;
}

async function criarNovaLousa(tituloPadrao = "") {
  if (!usuarioPodeUsarSistema()) return;

  const titulo = tituloPadrao || window.prompt("Nome da nova anotação:", "Nova anotação");

  if (!titulo || !titulo.trim()) {
    return;
  }

  const { data, error } = await supabaseClient
    .from("lousas_gerais")
    .insert({
      titulo: titulo.trim(),
      conteudo: "",
      criado_por: state.user.id,
      atualizado_por: state.user.id
    })
    .select(`
      id,
      titulo,
      conteudo,
      criado_por,
      atualizado_por,
      criado_em,
      atualizado_em,
      criador:perfis!lousas_gerais_criado_por_fkey(nome, email),
      atualizador:perfis!lousas_gerais_atualizado_por_fkey(nome, email)
    `)
    .single();

  if (error) {
    toast("Erro ao criar anotação: " + error.message);
    return;
  }

  state.lousaAtual = data;
  await carregarLousasGerais();
  els.lousaTexto.focus();
  toast("Nova anotação geral criada.");
}

function trocarLousaSelecionada() {
  const id = els.lousaSelect.value;
  const lousa = state.lousas.find((item) => item.id === id);

  if (!lousa) return;

  state.lousaAtual = lousa;
  preencherLousaAtual();
  els.lousaStatus.textContent = "Anotação selecionada.";
}

function marcarLousaAlterada() {
  if (!state.lousaAtual) return;

  state.lousaAlterada = true;
  els.lousaStatus.textContent = "Editando...";

  clearTimeout(state.lousaSalvamentoTimer);
  state.lousaSalvamentoTimer = setTimeout(() => {
    salvarLousaAtual(true);
  }, 1200);
}

async function salvarLousaAtual(silencioso = false) {
  if (!state.lousaAtual) return;
  if (!usuarioPodeUsarSistema()) return;

  const titulo = els.lousaTitulo.value.trim() || "Sem título";
  const conteudo = els.lousaTexto.value;

  els.lousaStatus.textContent = "Salvando...";

  const { data, error } = await supabaseClient
    .from("lousas_gerais")
    .update({
      titulo,
      conteudo,
      atualizado_por: state.user.id,
      atualizado_em: new Date().toISOString()
    })
    .eq("id", state.lousaAtual.id)
    .select(`
      id,
      titulo,
      conteudo,
      criado_por,
      atualizado_por,
      criado_em,
      atualizado_em,
      criador:perfis!lousas_gerais_criado_por_fkey(nome, email),
      atualizador:perfis!lousas_gerais_atualizado_por_fkey(nome, email)
    `)
    .single();

  if (error) {
    toast("Erro ao salvar anotação: " + error.message);
    els.lousaStatus.textContent = "Erro ao salvar.";
    return;
  }

  state.lousaAtual = data;
  state.lousas = state.lousas.map((l) => (l.id === data.id ? data : l));
  renderizarSelectLousas();
  preencherLousaAtual();
  state.lousaAlterada = false;
  els.lousaStatus.textContent = `Salvo por ${state.perfil?.nome || state.user.email}.`;

  if (!silencioso) {
    toast("Anotação salva.");
  }
}

async function limparLousaAtual() {
  if (!state.lousaAtual) return;

  const confirmar = window.confirm("Deseja apagar o conteúdo desta anotação?");
  if (!confirmar) return;

  els.lousaTexto.value = "";
  await salvarLousaAtual(false);
  toast("Conteúdo apagado.");
}

async function excluirLousaAtual() {
  if (!state.lousaAtual) return;

  const confirmar = window.confirm("Deseja excluir esta anotação da lousa geral?");
  if (!confirmar) return;

  const { error } = await supabaseClient
    .from("lousas_gerais")
    .delete()
    .eq("id", state.lousaAtual.id);

  if (error) {
    toast("Erro ao excluir anotação: " + error.message);
    return;
  }

  state.lousaAtual = null;
  toast("Anotação excluída.");
  await carregarLousasGerais();
}

function assinarLousasGerais() {
  if (state.lousaChannel) {
    supabaseClient.removeChannel(state.lousaChannel);
  }

  state.lousaChannel = supabaseClient
    .channel("lousas-gerais")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "lousas_gerais"
      },
      async (payload) => {
        const usuarioEditando =
          document.activeElement === els.lousaTexto ||
          document.activeElement === els.lousaTitulo;

        if (payload.eventType === "UPDATE" && payload.new?.id === state.lousaAtual?.id && usuarioEditando) {
          els.lousaStatus.textContent = "Há atualização externa nesta anotação.";
          return;
        }

        await carregarLousasGerais();
      }
    )
    .subscribe();
}

// =========================================================
// NOTIFICAÇÕES
// =========================================================
function assinarNotificacoes() {
  if (state.notificacoesChannel) {
    supabaseClient.removeChannel(state.notificacoesChannel);
  }

  state.notificacoesChannel = supabaseClient
    .channel(`notificacoes-${state.user.id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notificacoes",
        filter: `usuario_id=eq.${state.user.id}`
      },
      (payload) => {
        const n = payload.new;
        beep();
        toast(`${n.titulo}: ${n.mensagem}`);
      }
    )
    .subscribe();
}

async function notificarOutrosParticipantes(titulo, mensagem, tipo) {
  if (!state.participantesAtual.length) return;

  const notificacoes = state.participantesAtual
    .filter((usuarioId) => usuarioId !== state.user.id)
    .map((usuarioId) => ({
      usuario_id: usuarioId,
      titulo,
      mensagem: mensagem.length > 120 ? mensagem.slice(0, 120) + "..." : mensagem,
      tipo
    }));

  if (!notificacoes.length) return;

  await supabaseClient.from("notificacoes").insert(notificacoes);
}

// =========================================================
// REUNIÃO JITSI
// =========================================================
async function iniciarReuniao() {
  if (!usuarioPodeUsarSistema()) return;

  if (!state.conversaAtual) {
    toast("Selecione uma conversa antes de iniciar a reunião.");
    return;
  }

  const sala = criarNomeSalaJitsi();
  const titulo = state.conversaTipo === "grupo"
    ? `Reunião no ${state.conversaAtual.nome || "grupo"}`
    : `Reunião com ${state.usuarioSelecionado.nome || state.usuarioSelecionado.email}`;

  const abrirExterno = deveAbrirReuniaoExterna();

  // No mobile/WebView, tentamos abrir uma aba imediatamente para evitar bloqueio de popup.
  let janelaPreAberta = null;
  if (abrirExterno) {
    try {
      janelaPreAberta = window.open("about:blank", "_blank", "noopener,noreferrer");
    } catch (error) {
      janelaPreAberta = null;
    }
  }

  const { error } = await supabaseClient.from("reunioes").insert({
    conversa_id: state.conversaAtual.id,
    criada_por: state.user.id,
    titulo,
    sala_jitsi: sala,
    status: "ativa"
  });

  if (error) {
    if (janelaPreAberta && !janelaPreAberta.closed) {
      janelaPreAberta.close();
    }

    toast("Erro ao criar reunião: " + error.message);
    return;
  }

  await supabaseClient.from("mensagens").insert({
    conversa_id: state.conversaAtual.id,
    remetente_id: state.user.id,
    conteudo: `📹 Reunião iniciada. Link: ${gerarLinkJitsi(sala)}`,
    tipo: "sistema"
  });

  await notificarOutrosParticipantes("Reunião iniciada", titulo, "reuniao");

  abrirJitsi(sala, {
    abrirExterno,
    janelaPreAberta
  });
}

function abrirJitsi(sala, opcoes = {}) {
  fecharReuniao(false);

  state.salaAtualJitsi = sala;

  els.meetingPanel.classList.remove("hidden");
  document.querySelector(".layout").classList.add("with-meeting");
  els.meetingRoomName.textContent = sala;

  const link = gerarLinkJitsi(sala);

  // Em celulares, WebViews e ambientes sem WebRTC confiável,
  // abrir fora do iframe é mais funcional.
  if (opcoes.abrirExterno) {
    abrirReuniaoExterna(sala, opcoes.janelaPreAberta);
    return;
  }

  if (!ambienteSeguroParaWebRTC()) {
    renderizarFallbackReuniao(
      sala,
      "O navegador bloqueou recursos de áudio/vídeo porque o sistema não está em HTTPS ou localhost."
    );
    return;
  }

  if (!navegadorTemWebRTC()) {
    renderizarFallbackReuniao(
      sala,
      "Este navegador não disponibilizou WebRTC para chamadas de áudio e vídeo."
    );
    return;
  }

  if (typeof JitsiMeetExternalAPI === "undefined") {
    renderizarFallbackReuniao(
      sala,
      "A API do Jitsi não carregou corretamente. Abra a reunião em nova aba."
    );
    return;
  }

  const domain = "meet.jit.si";

  const options = {
    roomName: sala,
    parentNode: els.meet,
    width: "100%",
    height: "100%",
    userInfo: {
      displayName: state.perfil?.nome || state.user.email,
      email: state.user.email
    },
    configOverwrite: {
      prejoinPageEnabled: true,
      disableDeepLinking: false
    },
    interfaceConfigOverwrite: {
      MOBILE_APP_PROMO: false
    }
  };

  try {
    state.jitsiApi = new JitsiMeetExternalAPI(domain, options);

    // Força permissões no iframe para câmera, microfone e tela.
    setTimeout(() => {
      try {
        const iframe = state.jitsiApi?.getIFrame?.();
        if (iframe) {
          iframe.setAttribute(
            "allow",
            "camera; microphone; fullscreen; display-capture; autoplay; clipboard-write; encrypted-media"
          );
        }
      } catch (error) {
        console.warn("Não foi possível ajustar permissões do iframe:", error);
      }
    }, 500);

    state.jitsiApi.addListener("readyToClose", () => fecharReuniao(false));
    state.jitsiApi.addListener("videoConferenceJoined", () => {
      toast("Você entrou na reunião.");
    });
    state.jitsiApi.addListener("errorOccurred", (error) => {
      console.warn("Erro Jitsi:", error);
      renderizarFallbackReuniao(sala, "O Jitsi embutido apresentou erro. Abra a reunião em nova aba.");
    });

    selecionarTelaMobile("reuniao", false);
    atualizarBotaoReuniaoMobile();
    toast("Reunião aberta no painel lateral.");
  } catch (error) {
    console.error("Erro ao abrir Jitsi:", error);
    renderizarFallbackReuniao(sala, "Não foi possível abrir a reunião embutida.");
  }
}

function abrirReuniaoExterna(sala, janelaPreAberta = null) {
  const link = gerarLinkJitsi(sala);

  if (janelaPreAberta && !janelaPreAberta.closed) {
    janelaPreAberta.location.href = link;
    state.janelaReuniaoExterna = janelaPreAberta;
    renderizarFallbackReuniao(
      sala,
      "A reunião foi aberta em uma nova aba para funcionar melhor neste navegador."
    );
  } else {
    renderizarFallbackReuniao(
      sala,
      "Clique no botão abaixo para abrir a reunião em uma nova aba."
    );
  }

  selecionarTelaMobile("reuniao", false);
  atualizarBotaoReuniaoMobile();
}

function renderizarFallbackReuniao(sala, motivo) {
  const link = gerarLinkJitsi(sala);
  state.salaAtualJitsi = sala;

  els.meet.innerHTML = `
    <div class="webrtc-fallback">
      <div class="webrtc-icon">📹</div>
      <h3>Reunião pronta</h3>
      <p>${escapeHtml(motivo || "Abra a reunião em nova aba para usar áudio e vídeo.")}</p>

      <div class="meeting-link-box">
        <span>Link da reunião:</span>
        <strong>${escapeHtml(link)}</strong>
      </div>

      <div class="meeting-fallback-actions">
        <a class="btn meet" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">
          Abrir reunião em nova aba
        </a>
        <button id="btnCopiarLinkReuniao" class="btn ghost" type="button">
          Copiar link
        </button>
      </div>

      <small>
        Recomendado: Chrome, Edge, Firefox ou Safari atualizado. Evite abrir por navegador interno do WhatsApp, Instagram ou Facebook.
      </small>
    </div>
  `;

  const btnCopiar = $("btnCopiarLinkReuniao");
  if (btnCopiar) {
    btnCopiar.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(link);
        toast("Link da reunião copiado.");
      } catch (error) {
        toast("Não foi possível copiar. Selecione e copie o link manualmente.");
      }
    });
  }

  selecionarTelaMobile("reuniao", false);
  atualizarBotaoReuniaoMobile();
}

function fecharReuniao(mostrarMensagem = true) {
  if (state.jitsiApi) {
    state.jitsiApi.dispose();
  }

  state.jitsiApi = null;
  state.salaAtualJitsi = null;
  state.janelaReuniaoExterna = null;

  els.meet.innerHTML = "";
  els.meetingPanel.classList.add("hidden");
  document.querySelector(".layout").classList.remove("with-meeting");
  atualizarBotaoReuniaoMobile();

  if (isMobile() && state.mobileView === "reuniao") {
    selecionarTelaMobile(state.conversaAtual ? "chat" : "conversas", false);
  }

  if (mostrarMensagem) {
    toast("Reunião fechada nesta tela.");
  }
}

function gerarLinkJitsi(sala) {
  return `https://meet.jit.si/${encodeURIComponent(sala)}`;
}

function navegadorTemWebRTC() {
  return Boolean(
    window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection
  );
}

function ambienteSeguroParaWebRTC() {
  const host = window.location.hostname;
  return (
    window.isSecureContext ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1"
  );
}

function estaEmNavegadorInterno() {
  const ua = navigator.userAgent.toLowerCase();

  return (
    ua.includes(" wv") ||
    ua.includes("; wv") ||
    ua.includes("instagram") ||
    ua.includes("fbav") ||
    ua.includes("fb_iab") ||
    ua.includes("line/") ||
    ua.includes("whatsapp")
  );
}

function deveAbrirReuniaoExterna() {
  return (
    isMobile() ||
    estaEmNavegadorInterno() ||
    !ambienteSeguroParaWebRTC() ||
    !navegadorTemWebRTC() ||
    typeof JitsiMeetExternalAPI === "undefined"
  );
}

function criarNomeSalaJitsi() {
  const empresa = "chat-interno";
  const data = new Date();
  const carimbo = [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, "0"),
    String(data.getDate()).padStart(2, "0"),
    String(data.getHours()).padStart(2, "0"),
    String(data.getMinutes()).padStart(2, "0"),
    String(data.getSeconds()).padStart(2, "0")
  ].join("");

  const aleatorio = Math.random().toString(36).slice(2, 8);

  return `${empresa}-${carimbo}-${aleatorio}`;
}


// =========================================================
// MOBILE / RESPONSIVIDADE
// =========================================================
function isMobile() {
  return window.matchMedia("(max-width: 820px)").matches;
}

function selecionarTelaMobile(tela, abrirAdminSeNecessario = true) {
  const telasValidas = ["conversas", "chat", "lousa", "reuniao", "admin"];
  let telaFinal = telasValidas.includes(tela) ? tela : "conversas";

  if (telaFinal === "admin") {
    if (!state.perfil?.is_admin) {
      toast("Apenas administradores podem abrir este painel.");
      return;
    }

    if (abrirAdminSeNecessario && els.adminModal?.classList.contains("hidden")) {
      abrirAdmin();
    }
  }

  if (telaFinal === "chat" && !state.conversaAtual && isMobile()) {
    toast("Selecione uma conversa primeiro.");
    telaFinal = "conversas";
  }

  if (telaFinal === "reuniao" && !state.jitsiApi && !state.salaAtualJitsi && isMobile()) {
    toast("Inicie uma reunião primeiro.");
    telaFinal = state.conversaAtual ? "chat" : "conversas";
  }

  state.mobileView = telaFinal;
  document.body.classList.remove(
    "mobile-view-conversas",
    "mobile-view-chat",
    "mobile-view-lousa",
    "mobile-view-reuniao",
    "mobile-view-admin"
  );
  document.body.classList.add(`mobile-view-${telaFinal}`);

  document.querySelectorAll("[data-mobile-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mobileView === telaFinal);
  });

  atualizarBotaoReuniaoMobile();
  atualizarBotaoLousaMobile();
}

function atualizarBotaoReuniaoMobile() {
  if (!els.mobileTabReuniao) return;

  const reuniaoAtiva = Boolean(state.jitsiApi || state.salaAtualJitsi);
  els.mobileTabReuniao.classList.toggle("has-meeting", reuniaoAtiva);
  els.mobileTabReuniao.disabled = !reuniaoAtiva && !state.conversaAtual;
}

function atualizarBotaoLousaMobile() {
  if (!els.mobileTabLousa) return;

  const habilitada = Boolean(state.user && state.perfil?.ativo !== false);
  els.mobileTabLousa.classList.toggle("has-board", habilitada);
  els.mobileTabLousa.disabled = !habilitada;
}

function ajustarLayoutMobile() {
  if (!isMobile()) {
    document.body.classList.remove(
      "mobile-view-conversas",
      "mobile-view-chat",
      "mobile-view-lousa",
      "mobile-view-reuniao",
      "mobile-view-admin"
    );
    return;
  }

  selecionarTelaMobile(state.mobileView || "conversas", false);
}

// Fecha modais ao tocar fora no mobile, sem afetar cliques internos.
document.addEventListener("click", (event) => {
  const overlay = event.target;
  if (!overlay.classList?.contains("modal-overlay")) return;

  if (overlay.id === "adminModal") fecharAdmin(false);
  if (overlay.id === "grupoModal") fecharModalNovoGrupo();
});


// =========================================================
// UTILITÁRIOS
// =========================================================
function toast(mensagem) {
  els.toast.textContent = mensagem;
  els.toast.classList.remove("hidden");

  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    els.toast.classList.add("hidden");
  }, 4200);
}

function beep() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.04;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.18);
  } catch (error) {
    // Alguns navegadores bloqueiam áudio automático. Não precisa mostrar erro.
  }
}

function rolarMensagensParaBaixo() {
  els.mensagensLista.scrollTop = els.mensagensLista.scrollHeight;
}

function pegarInicial(texto = "") {
  return texto.trim().charAt(0).toUpperCase() || "?";
}

function formatarHora(dataIso) {
  if (!dataIso) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dataIso));
}

function escapeHtml(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function traduzirErro(mensagem = "") {
  const m = mensagem.toLowerCase();

  if (m.includes("invalid login credentials")) {
    return "e-mail ou senha inválidos.";
  }

  if (m.includes("email not confirmed")) {
    return "e-mail ainda não confirmado.";
  }

  if (m.includes("user already registered")) {
    return "este e-mail já está cadastrado.";
  }

  return mensagem;
}

function limparEstado() {
  if (state.mensagensChannel) {
    supabaseClient.removeChannel(state.mensagensChannel);
  }

  if (state.notificacoesChannel) {
    supabaseClient.removeChannel(state.notificacoesChannel);
  }

  if (state.perfilChannel) {
    supabaseClient.removeChannel(state.perfilChannel);
  }

  if (state.lousaChannel) {
    supabaseClient.removeChannel(state.lousaChannel);
  }

  fecharReuniao(false);
  fecharLousa(false);

  state.user = null;
  state.perfil = null;
  state.usuarios = [];
  state.grupos = [];
  state.setores = [];
  state.setoresGrupos = [];
  state.adminUsuarios = [];
  state.novoGrupoSelecionados = [];
  state.usuarioSelecionado = null;
  state.conversaAtual = null;
  state.conversaTipo = null;
  state.participantesAtual = [];
  state.mensagensChannel = null;
  state.notificacoesChannel = null;
  state.perfilChannel = null;
  state.lousas = [];
  state.lousaAtual = null;
  state.lousaChannel = null;
  state.lousaAlterada = false;

  els.mensagensLista.innerHTML = `
    <div class="welcome">
      <h3>Bem-vindo 👋</h3>
      <p>Escolha um usuário para começar a conversar.</p>
    </div>
  `;

  els.chatTitulo.textContent = "Selecione um usuário";
  els.chatSubtitulo.textContent = "Clique em um usuário à esquerda para iniciar uma conversa.";
  els.mensagemTexto.disabled = true;
  els.btnEnviarMensagem.disabled = true;
  els.btnIniciarReuniao.disabled = true;
  els.btnAbrirLousa.disabled = true;
  els.btnAdmin.classList.add("hidden");
  fecharAdmin(false);
}


// =========================================================
// CRIAR GRUPO PERSONALIZADO
// =========================================================
async function abrirModalNovoGrupo() {
  if (!usuarioPodeUsarSistema()) return;

  state.novoGrupoSelecionados = [];
  els.grupoNome.value = "";
  els.grupoBuscaUsuario.value = "";
  els.grupoModal.classList.remove("hidden");

  if (!state.usuarios.length) {
    await carregarUsuarios();
  }

  renderizarUsuariosNovoGrupo();
  els.grupoNome.focus();
}

function fecharModalNovoGrupo() {
  els.grupoModal.classList.add("hidden");
  state.novoGrupoSelecionados = [];
}

function renderizarUsuariosNovoGrupo() {
  const termo = els.grupoBuscaUsuario.value.trim().toLowerCase();

  const usuarios = state.usuarios.filter((u) => {
    return (
      u.nome?.toLowerCase().includes(termo) ||
      u.email?.toLowerCase().includes(termo) ||
      u.cargo?.toLowerCase().includes(termo) ||
      u.setores?.nome?.toLowerCase().includes(termo)
    );
  });

  els.grupoSelecionadosInfo.textContent = `${state.novoGrupoSelecionados.length} selecionado(s)`;

  if (!usuarios.length) {
    els.grupoUsuariosLista.innerHTML = `<div class="empty">Nenhum usuário disponível.</div>`;
    return;
  }

  els.grupoUsuariosLista.innerHTML = usuarios
    .map((u) => {
      const checked = state.novoGrupoSelecionados.includes(u.id) ? "checked" : "";
      const inicial = pegarInicial(u.nome || u.email);

      return `
        <label class="grupo-user-item">
          <input type="checkbox" value="${u.id}" ${checked} />
          <div class="avatar small-avatar">${inicial}</div>
          <div class="user-info">
            <strong>${escapeHtml(u.nome || "Sem nome")}</strong>
            <span>${escapeHtml(u.cargo || "Usuário")} • ${escapeHtml(u.setores?.nome || "Sem setor")}</span>
          </div>
        </label>
      `;
    })
    .join("");

  els.grupoUsuariosLista.querySelectorAll('input[type="checkbox"]').forEach((check) => {
    check.addEventListener("change", () => {
      const usuarioId = check.value;

      if (check.checked && !state.novoGrupoSelecionados.includes(usuarioId)) {
        state.novoGrupoSelecionados.push(usuarioId);
      }

      if (!check.checked) {
        state.novoGrupoSelecionados = state.novoGrupoSelecionados.filter((id) => id !== usuarioId);
      }

      els.grupoSelecionadosInfo.textContent = `${state.novoGrupoSelecionados.length} selecionado(s)`;
    });
  });
}

async function criarGrupoPersonalizado(event) {
  event.preventDefault();

  if (!usuarioPodeUsarSistema()) return;

  const nome = els.grupoNome.value.trim();

  if (!nome) {
    toast("Informe o nome do grupo.");
    return;
  }

  if (!state.novoGrupoSelecionados.length) {
    toast("Selecione pelo menos um participante.");
    return;
  }

  els.btnCriarGrupo.disabled = true;
  els.btnCriarGrupo.textContent = "Criando...";

  const { data, error } = await supabaseClient.rpc("criar_grupo_personalizado", {
    p_nome: nome,
    p_participantes: state.novoGrupoSelecionados
  });

  els.btnCriarGrupo.disabled = false;
  els.btnCriarGrupo.textContent = "Criar grupo";

  if (error) {
    toast("Erro ao criar grupo: " + error.message);
    return;
  }

  const grupo = data?.[0];

  if (!grupo) {
    toast("Grupo criado, mas não foi possível abrir automaticamente.");
    fecharModalNovoGrupo();
    await carregarGrupos();
    return;
  }

  fecharModalNovoGrupo();
  await carregarGrupos();

  const grupoAtualizado = state.grupos.find((g) => g.conversa_id === grupo.conversa_id) || grupo;
  abrirGrupo(grupoAtualizado);
  toast("Grupo criado com sucesso.");
}

function assinarMeuPerfil() {
  if (state.perfilChannel) {
    supabaseClient.removeChannel(state.perfilChannel);
  }

  if (!state.user?.id) return;

  state.perfilChannel = supabaseClient
    .channel(`perfil-${state.user.id}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "perfis",
        filter: `id=eq.${state.user.id}`
      },
      async (payload) => {
        const perfilAtualizado = payload.new;

        state.perfil = {
          ...state.perfil,
          ...perfilAtualizado
        };

        if (perfilAtualizado.ativo === false) {
          mostrarBloqueioUsuario("Seu acesso foi inativado pelo administrador.");
          await sair();
          return;
        }

        els.usuarioLogado.textContent = `${perfilAtualizado.nome} • ${perfilAtualizado.email}`;
        atualizarVisibilidadeAdmin();
      }
    )
    .subscribe();
}

// =========================================================
// ADMIN - USUÁRIOS, SETORES E GRUPOS
// =========================================================

function validarUsuarioAtivo() {
  if (state.perfil && state.perfil.ativo === false) {
    mostrarBloqueioUsuario("Seu usuário está inativo. Procure o administrador.");
    sair();
    return false;
  }

  return true;
}

function usuarioPodeUsarSistema() {
  if (!state.perfil || state.perfil.ativo === false) {
    mostrarBloqueioUsuario("Seu usuário está inativo. Procure o administrador.");
    return false;
  }

  return true;
}

function mostrarBloqueioUsuario(mensagem) {
  if (els.bloqueioMensagem) {
    els.bloqueioMensagem.textContent = mensagem || "Seu usuário está inativo. Procure o administrador.";
  }

  if (els.bloqueioModal) {
    els.bloqueioModal.classList.remove("hidden");
  } else {
    toast(mensagem || "Usuário inativo.");
  }
}

function fecharBloqueioUsuario() {
  if (els.bloqueioModal) {
    els.bloqueioModal.classList.add("hidden");
  }

  mostrarLogin();
}

function atualizarVisibilidadeAdmin() {
  if (state.perfil?.is_admin) {
    els.btnAdmin.classList.remove("hidden");
    els.mobileTabAdmin?.classList.remove("hidden");
  } else {
    els.btnAdmin.classList.add("hidden");
    els.mobileTabAdmin?.classList.add("hidden");
  }
}

async function abrirAdmin() {
  if (!state.perfil?.is_admin) {
    toast("Apenas administradores podem abrir este painel.");
    return;
  }

  els.adminModal.classList.remove("hidden");
  mostrarAbaAdmin("usuarios");
  await carregarSetores();
  await carregarAdminUsuarios();
  await carregarGrupos();
}

function fecharAdmin(mostrarMensagem = true) {
  if (!els.adminModal) return;
  els.adminModal.classList.add("hidden");
  if (mostrarMensagem) toast("Painel administrativo fechado.");
}

function mostrarAbaAdmin(aba) {
  const usuarios = aba === "usuarios";

  els.adminTabUsuarios.classList.toggle("active", usuarios);
  els.adminTabSetores.classList.toggle("active", !usuarios);
  els.adminUsuariosPainel.classList.toggle("hidden", !usuarios);
  els.adminSetoresPainel.classList.toggle("hidden", usuarios);
}

async function carregarSetores() {
  // Na Etapa 3.3 usamos uma função RPC para listar setores junto com seus grupos.
  // Se o SQL 3.3 ainda não foi executado, usamos a consulta simples como fallback.
  const { data, error } = await supabaseClient.rpc("listar_setores_e_grupos_admin");

  if (!error && data) {
    state.setoresGrupos = data || [];
    state.setores = state.setoresGrupos.map((item) => ({
      id: item.setor_id,
      nome: item.setor_nome,
      ativo: item.setor_ativo,
      criado_em: item.setor_criado_em
    }));
    preencherSelectSetores();
    renderizarSetoresAdmin();
    return;
  }

  const fallback = await supabaseClient
    .from("setores")
    .select("id, nome, ativo, criado_em")
    .order("nome", { ascending: true });

  if (fallback.error) {
    toast("Erro ao carregar setores: " + fallback.error.message);
    return;
  }

  state.setores = fallback.data || [];
  state.setoresGrupos = state.setores.map((s) => ({
    setor_id: s.id,
    setor_nome: s.nome,
    setor_ativo: s.ativo,
    setor_criado_em: s.criado_em,
    conversa_id: null,
    nome_grupo: null,
    participantes: 0
  }));

  preencherSelectSetores();
  renderizarSetoresAdmin();
}

function preencherSelectSetores() {
  const options = [`<option value="">Sem setor</option>`]
    .concat(
      state.setores.map((s) => {
        return `<option value="${s.id}">${escapeHtml(s.nome)}${s.ativo ? "" : " (inativo)"}</option>`;
      })
    )
    .join("");

  els.adminUsuarioSetor.innerHTML = options;
}

async function carregarAdminUsuarios() {
  const { data, error } = await supabaseClient
    .from("perfis")
    .select("id, nome, email, cargo, setor_id, is_admin, ativo, status, setores(nome)")
    .order("nome", { ascending: true });

  if (error) {
    toast("Erro ao carregar usuários do admin: " + error.message);
    return;
  }

  state.adminUsuarios = data || [];
  renderizarAdminUsuarios();
}

function renderizarAdminUsuarios() {
  if (!state.adminUsuarios.length) {
    els.adminUsuariosTabela.innerHTML = `<tr><td colspan="6">Nenhum usuário encontrado.</td></tr>`;
    return;
  }

  els.adminUsuariosTabela.innerHTML = state.adminUsuarios
    .map((u) => {
      const ativo = u.ativo
        ? `<span class="status-pill ok">Ativo</span>`
        : `<span class="status-pill no">Inativo</span>`;
      const admin = u.is_admin ? ` • ADMIN` : "";
      const classeLinha = u.ativo ? "" : "user-inactive-row";
      const textoBotaoStatus = u.ativo ? "Inativar" : "Ativar";
      const classeBotaoStatus = u.ativo ? "danger-mini" : "success-mini";
      const novoStatus = u.ativo ? "false" : "true";

      return `
        <tr class="${classeLinha}">
          <td>${escapeHtml(u.nome || "Sem nome")}</td>
          <td>${escapeHtml(u.email || "")}</td>
          <td>${escapeHtml(u.cargo || "Usuário")}${admin}</td>
          <td>${escapeHtml(u.setores?.nome || "Sem setor")}</td>
          <td>${ativo}</td>
          <td>
            <div class="table-actions">
              <button class="mini-btn" type="button" data-admin-user-id="${u.id}">Editar</button>
              <button class="mini-btn ${classeBotaoStatus}" type="button" data-toggle-user-id="${u.id}" data-novo-status="${novoStatus}">
                ${textoBotaoStatus}
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  document.querySelectorAll("[data-admin-user-id]").forEach((btn) => {
    btn.addEventListener("click", () => selecionarAdminUsuario(btn.dataset.adminUserId));
  });

  document.querySelectorAll("[data-toggle-user-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const usuarioId = btn.dataset.toggleUserId;
      const novoStatus = btn.dataset.novoStatus === "true";
      alternarStatusUsuario(usuarioId, novoStatus);
    });
  });
}

function selecionarAdminUsuario(usuarioId) {
  const usuario = state.adminUsuarios.find((u) => u.id === usuarioId);
  if (!usuario) return;

  els.adminUsuarioSelecionadoInfo.textContent = `${usuario.nome || "Sem nome"} • ${usuario.email}`;
  els.adminUsuarioId.value = usuario.id;
  els.adminUsuarioNome.value = usuario.nome || "";
  els.adminUsuarioCargo.value = usuario.cargo || "Usuário";
  els.adminUsuarioSetor.value = usuario.setor_id || "";
  els.adminUsuarioAdmin.checked = !!usuario.is_admin;
  els.adminUsuarioAtivo.checked = usuario.ativo !== false;

  habilitarFormularioAdminUsuario(true);
}

function habilitarFormularioAdminUsuario(habilitar) {
  els.adminUsuarioNome.disabled = !habilitar;
  els.adminUsuarioCargo.disabled = !habilitar;
  els.adminUsuarioSetor.disabled = !habilitar;
  els.adminUsuarioAdmin.disabled = !habilitar;
  els.adminUsuarioAtivo.disabled = !habilitar;
  els.btnSalvarAdminUsuario.disabled = !habilitar;
}

function limparFormularioAdminUsuario() {
  els.adminUsuarioSelecionadoInfo.textContent = "Selecione um usuário na tabela.";
  els.adminUsuarioId.value = "";
  els.adminUsuarioNome.value = "";
  els.adminUsuarioCargo.value = "";
  els.adminUsuarioSetor.value = "";
  els.adminUsuarioAdmin.checked = false;
  els.adminUsuarioAtivo.checked = false;
  habilitarFormularioAdminUsuario(false);
}

async function salvarAdminUsuario(event) {
  event.preventDefault();

  const usuarioId = els.adminUsuarioId.value;
  if (!usuarioId) {
    toast("Selecione um usuário primeiro.");
    return;
  }

  const setorId = els.adminUsuarioSetor.value || null;

  const { error } = await supabaseClient.rpc("admin_atualizar_perfil_usuario", {
    p_usuario_id: usuarioId,
    p_nome: els.adminUsuarioNome.value.trim(),
    p_cargo: els.adminUsuarioCargo.value.trim() || "Usuário",
    p_setor_id: setorId,
    p_is_admin: els.adminUsuarioAdmin.checked,
    p_ativo: els.adminUsuarioAtivo.checked
  });

  if (error) {
    toast("Erro ao salvar usuário: " + error.message);
    return;
  }

  await sincronizarGruposSilencioso();

  toast("Usuário atualizado com sucesso.");
  await carregarAdminUsuarios();
  await atualizarConversasLaterais();
}

async function alternarStatusUsuario(usuarioId, novoStatus) {
  const usuario = state.adminUsuarios.find((u) => u.id === usuarioId);
  if (!usuario) return;

  const acao = novoStatus ? "ativar" : "inativar";
  const nome = usuario.nome || usuario.email || "este usuário";

  const confirmar = window.confirm(`Deseja ${acao} ${nome}?`);
  if (!confirmar) return;

  const { error } = await supabaseClient.rpc("admin_definir_status_usuario", {
    p_usuario_id: usuarioId,
    p_ativo: novoStatus
  });

  if (error) {
    toast("Erro ao alterar status: " + error.message);
    return;
  }

  await sincronizarGruposSilencioso();
  await carregarAdminUsuarios();
  await atualizarConversasLaterais();

  toast(novoStatus ? "Usuário ativado com sucesso." : "Usuário inativado com sucesso.");
}

async function sincronizarGruposSilencioso() {
  const { error } = await supabaseClient.rpc("admin_sincronizar_grupos_setores");

  if (error) {
    console.warn("Não foi possível sincronizar grupos automaticamente:", error.message);
  }
}

function renderizarSetoresAdmin() {
  const itens = state.setoresGrupos.length
    ? state.setoresGrupos
    : state.setores.map((s) => ({
        setor_id: s.id,
        setor_nome: s.nome,
        setor_ativo: s.ativo,
        setor_criado_em: s.criado_em,
        conversa_id: null,
        nome_grupo: null,
        participantes: 0
      }));

  if (!itens.length) {
    els.adminSetoresLista.innerHTML = `<div class="empty">Nenhum setor encontrado.</div>`;
    return;
  }

  els.adminSetoresLista.innerHTML = itens
    .map((s) => {
      const status = s.setor_ativo
        ? `<span class="status-pill ok">Setor ativo</span>`
        : `<span class="status-pill no">Setor inativo</span>`;

      const grupoStatus = s.conversa_id
        ? `<span class="status-pill ok">Grupo criado</span>`
        : `<span class="status-pill warn">Sem grupo</span>`;

      const participantes = Number(s.participantes || 0);

      return `
        <div class="setor-item setor-item-detalhado">
          <div>
            <strong>${escapeHtml(s.setor_nome)}</strong>
            <span class="setor-meta">${status} ${grupoStatus}</span>
            <span class="setor-meta">
              ${s.nome_grupo ? escapeHtml(s.nome_grupo) : "Grupo ainda não sincronizado"}
              • ${participantes} participante(s)
            </span>
          </div>
          <div class="setor-actions">
            ${s.conversa_id ? `<button class="mini-btn" type="button" data-abrir-grupo-id="${s.conversa_id}">Abrir grupo</button>` : ""}
            <button class="mini-btn" type="button" data-setor-id="${s.setor_id}">Editar</button>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll("[data-setor-id]").forEach((btn) => {
    btn.addEventListener("click", () => selecionarSetor(btn.dataset.setorId));
  });

  document.querySelectorAll("[data-abrir-grupo-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const grupoId = btn.dataset.abrirGrupoId;
      let grupo = state.grupos.find((g) => g.conversa_id === grupoId);

      if (!grupo) {
        await carregarGrupos();
        grupo = state.grupos.find((g) => g.conversa_id === grupoId);
      }

      if (!grupo) {
        toast("Grupo não encontrado na sua lista. Verifique se você pertence a esse setor.");
        return;
      }

      fecharAdmin(false);
      abrirGrupo(grupo);
    });
  });
}

function selecionarSetor(setorId) {
  const setor = state.setores.find((s) => s.id === setorId);
  if (!setor) return;

  els.adminSetorId.value = setor.id;
  els.adminSetorNome.value = setor.nome || "";
  els.adminSetorAtivo.checked = setor.ativo !== false;
  els.adminSetorNome.focus();
}

function limparFormularioSetor() {
  els.adminSetorId.value = "";
  els.adminSetorNome.value = "";
  els.adminSetorAtivo.checked = true;
  els.adminSetorNome.focus();
}

async function salvarSetor(event) {
  event.preventDefault();

  const nome = els.adminSetorNome.value.trim();
  if (!nome) {
    toast("Informe o nome do setor.");
    return;
  }

  const { error } = await supabaseClient.rpc("admin_salvar_setor", {
    p_setor_id: els.adminSetorId.value || null,
    p_nome: nome,
    p_ativo: els.adminSetorAtivo.checked
  });

  if (error) {
    toast("Erro ao salvar setor: " + error.message);
    return;
  }

  toast("Setor salvo com sucesso.");
  limparFormularioSetor();
  await carregarSetores();
  await carregarGrupos();
}

async function sincronizarGruposSetores() {
  const { data, error } = await supabaseClient.rpc("admin_sincronizar_grupos_setores");

  if (error) {
    toast("Erro ao sincronizar grupos: " + error.message);
    return;
  }

  const grupos = data || [];

  if (!grupos.length) {
    els.adminGruposResultado.innerHTML = `<div class="sync-item">Nenhum grupo foi gerado. Verifique se existem setores ativos.</div>`;
  } else {
    els.adminGruposResultado.innerHTML = grupos
      .map((g) => {
        const nome = g.nome_grupo || g.grupo_nome || g.nome || "Grupo";
        const total = g.participantes ?? g.total_participantes ?? 0;
        return `<div class="sync-item"><strong>${escapeHtml(nome)}</strong><br>${total} participante(s)</div>`;
      })
      .join("");
  }

  toast("Grupos sincronizados com sucesso.");
  await carregarSetores();
  await carregarGrupos();
}
