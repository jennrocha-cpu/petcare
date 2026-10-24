// ===== EFEITO DE DIGITAÇÃO =====
const frases = [
    "Seu espaço de cuidado e carinho pelos animais.",
    "Controle vacinas, consultas e medicamentos.",
    "Acompanhe o peso e a saúde do seu pet.",
    "PetCare: porque eles merecem o melhor! 🐶🐱"
];

const alvo = document.getElementById("digitando");
let fraseAtual = 0;
let letraAtual = 0;
let apagando = false;

function digitar() {
    const frase = frases[fraseAtual];

    if (!apagando) {
        letraAtual++;
        alvo.textContent = frase.substring(0, letraAtual);

        if (letraAtual === frase.length) {
            apagando = true;
            setTimeout(digitar, 1800);
            return;
        }
        setTimeout(digitar, 70);
    } else {
        letraAtual--;
        alvo.textContent = frase.substring(0, letraAtual);

        if (letraAtual === 0) {
            apagando = false;
            fraseAtual = (fraseAtual + 1) % frases.length;
            setTimeout(digitar, 500);
            return;
        }
        setTimeout(digitar, 35);
    }
}

digitar();

// ===== FUNÇÕES AUXILIARES =====
function hojeISO() {
    return new Date().toLocaleDateString("en-CA");
}

function formatarData(texto) {
    if (!texto) return "-";
    const partes = texto.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function diasAte(texto) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataAlvo = new Date(texto + "T00:00:00");
    return Math.round((dataAlvo - hoje) / (1000 * 60 * 60 * 24));
}
// ===== CADASTRO DE PETS =====
let pets = JSON.parse(localStorage.getItem("pets")) || [];

function atualizarSelectPets() {
    const select = document.getElementById("vac-pet");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Escolha o pet</option>';

    pets.forEach(function (pet) {
        const opcao = document.createElement("option");
        opcao.value = pet.nome;
        opcao.textContent = pet.nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

function mostrarPets() {
    const lista = document.getElementById("lista-pets");
    lista.innerHTML = "";

    atualizarSelectPets();
    atualizarSelectPeso();
    atualizarSelectConsultas();
    atualizarSelectAlim();
    atualizarSelectMed();
    atualizarSelectExames();
    atualizarSelectMon();
    mostrarPesos();

    pets.forEach(function (pet, i) {
        const item = document.createElement("li");
        const pesoTexto = pet.peso ? " - " + pet.peso + " kg" : "";
        item.textContent = pet.nome + " - " + pet.idade + " anos - " + pet.raca + pesoTexto + " ";

        const botao = document.createElement("button");
        botao.textContent = "Apagar";
        botao.onclick = function () {
            pets.splice(i, 1);
            salvar();
        };

        item.appendChild(botao);
        lista.appendChild(item);
    });
}

function salvar() {
    localStorage.setItem("pets", JSON.stringify(pets));
    mostrarPets();
}

document.getElementById("btn-cadastrar").onclick = function () {
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const raca = document.getElementById("raca").value;
    const peso = document.getElementById("peso").value;

    if (nome === "" || idade === "") {
        alert("Preencha pelo menos o nome e a idade!");
        return;
    }

    pets.push({
        nome: nome,
        idade: idade,
        raca: raca,
        peso: peso,
        historicoPeso: peso ? [{ data: hojeISO(), peso: Number(peso) }] : []
    });
    salvar();

    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("raca").value = "";
    document.getElementById("peso").value = "";
};

// ===== PESO =====
function atualizarSelectPeso() {
    const select = document.getElementById("peso-pet");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Escolha o pet</option>';

    pets.forEach(function (pet, i) {
        const opcao = document.createElement("option");
        opcao.value = i;
        opcao.textContent = pet.nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

function atualizarPesoAtual(pet) {
    const hist = pet.historicoPeso || [];
    pet.peso = hist.length > 0 ? hist[hist.length - 1].peso : "";
}

function mostrarPesos() {
    const lista = document.getElementById("lista-pesos");
    lista.innerHTML = "";

    const i = document.getElementById("peso-pet").value;
    if (i === "" || !pets[i]) return;

    const pet = pets[i];
    const historico = pet.historicoPeso || [];

    historico.forEach(function (registro, j) {
        const item = document.createElement("li");
        item.textContent = formatarData(registro.data) + " - " + registro.peso + " kg ";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = function () {
            const resposta = prompt("Novo peso (kg):", registro.peso);
            if (resposta === null) return;

            const novo = Number(resposta.replace(",", "."));
            if (isNaN(novo) || novo <= 0) {
                alert("Digite um peso válido!");
                return;
            }

            registro.peso = novo;
            atualizarPesoAtual(pet);
            salvar();
        };

        const btnApagar = document.createElement("button");
        btnApagar.textContent = "Apagar";
        btnApagar.onclick = function () {
            historico.splice(j, 1);
            atualizarPesoAtual(pet);
            salvar();
        };

        item.appendChild(btnEditar);
        item.appendChild(btnApagar);
        lista.appendChild(item);
    });
}

document.getElementById("peso-pet").onchange = mostrarPesos;

document.getElementById("btn-peso").onclick = function () {
    const i = document.getElementById("peso-pet").value;
    const peso = Number(document.getElementById("peso-novo").value);
    const data = document.getElementById("peso-data").value || hojeISO();

    if (i === "" || !peso || peso <= 0) {
        alert("Escolha o pet e digite o peso!");
        return;
    }

    const pet = pets[i];
    if (!pet.historicoPeso) pet.historicoPeso = [];

    pet.historicoPeso.push({ data: data, peso: peso });
    atualizarPesoAtual(pet);
    salvar();

    document.getElementById("peso-novo").value = "";
    document.getElementById("peso-data").value = "";
};
// ===== CADASTRO DE VACINAS =====
let vacinas = JSON.parse(localStorage.getItem("vacinas")) || [];

function mostrarVacinas() {
    const lista = document.getElementById("lista-vacinas");
    lista.innerHTML = "";

    vacinas.forEach(function (vac, i) {
        const item = document.createElement("li");

        let aviso = "";
        if (vac.proxima) {
            const dias = diasAte(vac.proxima);
            if (dias < 0) {
                aviso = " ⚠️ ATRASADA há " + Math.abs(dias) + " dia(s)";
                item.classList.add("atrasada");
            } else if (dias <= 30) {
                aviso = " ⏰ Faltam " + dias + " dia(s)";
                item.classList.add("proxima");
            } else {
                aviso = " ✅ Em dia";
            }
        }

        item.textContent =
            vac.pet + " - " + vac.nome +
            " | Aplicada: " + formatarData(vac.data) +
            " | Próxima: " + formatarData(vac.proxima) +
            aviso + " ";

        const botao = document.createElement("button");
        botao.textContent = "Apagar";
        botao.onclick = function () {
            vacinas.splice(i, 1);
            salvarVacinas();
        };

        item.appendChild(botao);
        lista.appendChild(item);
    });
}

function salvarVacinas() {
    localStorage.setItem("vacinas", JSON.stringify(vacinas));
    mostrarVacinas();
}

document.getElementById("btn-vacina").onclick = function () {
    const pet = document.getElementById("vac-pet").value;
    const nome = document.getElementById("vac-nome").value;
    const data = document.getElementById("vac-data").value;
    const proxima = document.getElementById("vac-proxima").value;

    if (pet === "" || nome === "" || data === "") {
        alert("Preencha o pet, a vacina e a data de aplicação!");
        return;
    }

    vacinas.push({ pet: pet, nome: nome, data: data, proxima: proxima });
    salvarVacinas();

    document.getElementById("vac-pet").value = "";
    document.getElementById("vac-nome").value = "";
    document.getElementById("vac-data").value = "";
    document.getElementById("vac-proxima").value = "";
};
// ===== CONSULTAS VETERINÁRIAS =====
let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

function atualizarSelectConsultas() {
    const select = document.getElementById("cons-pet");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Escolha o pet</option>';

    pets.forEach(function (pet) {
        const opcao = document.createElement("option");
        opcao.value = pet.nome;
        opcao.textContent = pet.nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

function atualizarFiltroCons() {
    const select = document.getElementById("cons-filtro");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Todos os pets</option>';

    const nomes = [];
    consultas.forEach(function (c) {
        if (!nomes.includes(c.pet)) nomes.push(c.pet);
    });

    nomes.forEach(function (nome) {
        const opcao = document.createElement("option");
        opcao.value = nome;
        opcao.textContent = nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

function mostrarConsultas() {
    atualizarFiltroCons();

    const lista = document.getElementById("lista-consultas");
    lista.innerHTML = "";

    const filtro = document.getElementById("cons-filtro").value;

    const historico = consultas
        .filter(function (c) {
            return filtro === "" || c.pet === filtro;
        })
        .sort(function (a, b) {
            return a.data < b.data ? 1 : -1;
        });

    if (historico.length === 0) {
        const vazio = document.createElement("li");
        vazio.textContent = "Nenhuma consulta registrada.";
        lista.appendChild(vazio);
        return;
    }

    historico.forEach(function (c) {
        const item = document.createElement("li");

        let texto = c.pet + " - " + formatarData(c.data);
        if (c.vet) texto += " | " + c.vet;
        if (c.motivo) texto += " | Motivo: " + c.motivo;
        if (c.obs) texto += " | Obs: " + c.obs;

        if (c.retorno) {
            const dias = diasAte(c.retorno);
            texto += " | Retorno: " + formatarData(c.retorno);
            if (dias < 0) {
                texto += " ⚠️ passou há " + Math.abs(dias) + " dia(s)";
                item.classList.add("atrasada");
            } else if (dias <= 30) {
                texto += " ⏰ faltam " + dias + " dia(s)";
                item.classList.add("proxima");
            }
        }

        item.textContent = texto + " ";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = function () {
            const resposta = prompt("Editar observações / diagnóstico:", c.obs);
            if (resposta === null) return;
            c.obs = resposta;
            salvarConsultas();
        };

        const btnApagar = document.createElement("button");
        btnApagar.textContent = "Apagar";
        btnApagar.onclick = function () {
            consultas.splice(consultas.indexOf(c), 1);
            salvarConsultas();
        };

        item.appendChild(btnEditar);
        item.appendChild(btnApagar);
        lista.appendChild(item);
    });
}

function salvarConsultas() {
    localStorage.setItem("consultas", JSON.stringify(consultas));
    mostrarConsultas();
}

document.getElementById("cons-filtro").onchange = mostrarConsultas;

document.getElementById("btn-consulta").onclick = function () {
    const pet = document.getElementById("cons-pet").value;
    const data = document.getElementById("cons-data").value || hojeISO();
    const vet = document.getElementById("cons-vet").value;
    const motivo = document.getElementById("cons-motivo").value;
    const obs = document.getElementById("cons-obs").value;
    const retorno = document.getElementById("cons-retorno").value;

    if (pet === "" || motivo === "") {
        alert("Escolha o pet e informe o motivo da consulta!");
        return;
    }

    consultas.push({
        pet: pet,
        data: data,
        vet: vet,
        motivo: motivo,
        obs: obs,
        retorno: retorno
    });
    salvarConsultas();

    document.getElementById("cons-pet").value = "";
    document.getElementById("cons-data").value = "";
    document.getElementById("cons-vet").value = "";
    document.getElementById("cons-motivo").value = "";
    document.getElementById("cons-obs").value = "";
    document.getElementById("cons-retorno").value = "";
};
// ===== NOTIFICAÇÕES =====
function pedirPermissao() {
    if (!("Notification" in window)) {
        alert("Seu navegador não suporta notificações.");
        return;
    }

    Notification.requestPermission().then(function (resultado) {
        if (resultado === "granted") {
            new Notification("PetCare", { body: "Notificações ativadas! 🐶" });
            verificarNotificacoes();
        } else {
            alert("Permissão negada. Libere as notificações nas configurações do site (cadeado ao lado do endereço).");
        }
    });
}

function verificarNotificacoes() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const hoje = hojeISO();
    const avisados = JSON.parse(localStorage.getItem("avisados")) || {};

    // limpa avisos de dias anteriores
    Object.keys(avisados).forEach(function (chave) {
        if (avisados[chave] !== hoje) delete avisados[chave];
    });

    const eventos = [];

    consultas.forEach(function (c) {
        if (c.data) eventos.push({ tipo: "Consulta", pet: c.pet, data: c.data, extra: c.motivo });
        if (c.retorno) eventos.push({ tipo: "Retorno", pet: c.pet, data: c.retorno, extra: c.motivo });
    });

    vacinas.forEach(function (v) {
        if (v.proxima) eventos.push({ tipo: "Vacina", pet: v.pet, data: v.proxima, extra: v.nome });
    });

    eventos.forEach(function (e) {
        const dias = diasAte(e.data);
        if (dias !== 0 && dias !== 1) return;

        const chave = e.tipo + "|" + e.pet + "|" + e.data + "|" + e.extra;
        if (avisados[chave]) return;

        const quando = dias === 0 ? "é HOJE" : "é AMANHÃ";
        new Notification("PetCare 🐾 " + e.tipo, {
            body: e.pet + " - " + (e.extra || "") + ": " + quando + " (" + formatarData(e.data) + ")"
        });

        avisados[chave] = hoje;
    });

    localStorage.setItem("avisados", JSON.stringify(avisados));
}

document.getElementById("btn-notificacoes").onclick = pedirPermissao;
setInterval(verificarNotificacoes, 60 * 60 * 1000); // confere a cada 1 hora
// ===== ALIMENTAÇÃO E DIETAS =====
let refeicoes = JSON.parse(localStorage.getItem("refeicoes")) || [];
const refeicoesAvisadas = {};

const dicas = [
    "Água fresca e limpa deve estar sempre à disposição do seu pet. 💧",
    "Troque a ração aos poucos, em 7 a 10 dias, para evitar problemas de barriga.",
    "Chocolate, uva, uva-passa, cebola, alho e xilitol são perigosos para cães e gatos.",
    "Petiscos devem ser pequena parte da alimentação diária.",
    "Pese o pet com regularidade: ganhar ou perder peso rápido merece conversa com o veterinário.",
    "Filhotes, idosos e pets doentes têm necessidades próprias: peça ao veterinário a quantidade ideal."
];

function mostrarDica() {
    const el = document.getElementById("dica-alimentar");
    el.textContent = "💡 Dica: " + dicas[Math.floor(Math.random() * dicas.length)];
}

function atualizarSelectAlim() {
    const select = document.getElementById("ali-pet");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Escolha o pet</option>';

    pets.forEach(function (pet) {
        const opcao = document.createElement("option");
        opcao.value = pet.nome;
        opcao.textContent = pet.nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

function atualizarFiltroAlim() {
    const select = document.getElementById("ali-filtro");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Todos os pets</option>';

    const nomes = [];
    refeicoes.forEach(function (r) {
        if (!nomes.includes(r.pet)) nomes.push(r.pet);
    });

    nomes.forEach(function (nome) {
        const opcao = document.createElement("option");
        opcao.value = nome;
        opcao.textContent = nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

function mostrarRefeicoes() {
    atualizarFiltroAlim();

    const lista = document.getElementById("lista-refeicoes");
    const resumo = document.getElementById("resumo-alimentacao");
    lista.innerHTML = "";
    resumo.innerHTML = "";

    const filtro = document.getElementById("ali-filtro").value;
    const hoje = hojeISO();

    const plano = refeicoes
        .filter(function (r) {
            return filtro === "" || r.pet === filtro;
        })
        .sort(function (a, b) {
            return a.hora < b.hora ? -1 : 1;
        });

    if (plano.length === 0) {
        const vazio = document.createElement("li");
        vazio.textContent = "Nenhuma refeição cadastrada.";
        lista.appendChild(vazio);
        return;
    }

    // resumo por pet: quantas refeições e total em gramas
    const totais = {};
    plano.forEach(function (r) {
        if (!totais[r.pet]) totais[r.pet] = { qtd: 0, total: 0, feitas: 0 };
        totais[r.pet].qtd++;
        totais[r.pet].total += Number(r.qtd) || 0;
        if (r.feitas.includes(hoje)) totais[r.pet].feitas++;
    });

    Object.keys(totais).forEach(function (nome) {
        const t = totais[nome];
        const linha = document.createElement("div");
        linha.classList.add("resumo-pet");
        linha.textContent =
            "🍽️ " + nome + ": " + t.feitas + " de " + t.qtd +
            " refeição(ões) feita(s) hoje | Total do dia: " + t.total + " g";
        resumo.appendChild(linha);
    });

    plano.forEach(function (r) {
        const item = document.createElement("li");
        const feita = r.feitas.includes(hoje);
        if (feita) item.classList.add("feita");

        let texto = r.hora + " - " + r.pet + " - " + r.alimento;
        if (r.qtd) texto += " (" + r.qtd + " g)";
        if (r.obs) texto += " | Obs: " + r.obs;
        if (feita) texto += " ✅";

        item.textContent = texto + " ";

        const btnFeita = document.createElement("button");
        btnFeita.textContent = feita ? "Desmarcar" : "Feita hoje";
        btnFeita.onclick = function () {
            if (feita) {
                r.feitas = r.feitas.filter(function (d) { return d !== hoje; });
            } else {
                r.feitas.push(hoje);
            }
            salvarRefeicoes();
        };

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = function () {
            const novaHora = prompt("Novo horário (hh:mm):", r.hora);
            if (novaHora === null) return;

            if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(novaHora)) {
                alert("Horário inválido! Use o formato hh:mm, ex: 08:30");
                return;
            }

            const novaQtd = prompt("Nova quantidade (g):", r.qtd);
            if (novaQtd === null) return;

            r.hora = novaHora;
            r.qtd = novaQtd;
            salvarRefeicoes();
        };

        const btnApagar = document.createElement("button");
        btnApagar.textContent = "Apagar";
        btnApagar.onclick = function () {
            refeicoes.splice(refeicoes.indexOf(r), 1);
            salvarRefeicoes();
        };

        item.appendChild(btnFeita);
        item.appendChild(btnEditar);
        item.appendChild(btnApagar);
        lista.appendChild(item);
    });
}

function salvarRefeicoes() {
    localStorage.setItem("refeicoes", JSON.stringify(refeicoes));
    mostrarRefeicoes();
}

document.getElementById("ali-filtro").onchange = mostrarRefeicoes;

document.getElementById("btn-refeicao").onclick = function () {
    const pet = document.getElementById("ali-pet").value;
    const hora = document.getElementById("ali-hora").value;
    const alimento = document.getElementById("ali-alimento").value;
    const qtd = document.getElementById("ali-qtd").value;
    const obs = document.getElementById("ali-obs").value;

    if (pet === "" || hora === "" || alimento === "") {
        alert("Escolha o pet, o horário e o alimento!");
        return;
    }

    refeicoes.push({
        pet: pet,
        hora: hora,
        alimento: alimento,
        qtd: qtd,
        obs: obs,
        feitas: []
    });
    salvarRefeicoes();

    document.getElementById("ali-pet").value = "";
    document.getElementById("ali-hora").value = "";
    document.getElementById("ali-alimento").value = "";
    document.getElementById("ali-qtd").value = "";
    document.getElementById("ali-obs").value = "";
};

// aviso na hora da refeição (funciona com a página aberta)
function verificarRefeicoes() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const agora = new Date().toTimeString().slice(0, 5);
    const hoje = hojeISO();

    refeicoes.forEach(function (r) {
        if (r.hora !== agora || r.feitas.includes(hoje)) return;

        const chave = r.pet + "|" + r.hora + "|" + r.alimento + "|" + hoje;
        if (refeicoesAvisadas[chave]) return;

        new Notification("PetCare 🍽️ Hora da refeição", {
            body: r.pet + ": " + r.alimento + (r.qtd ? " (" + r.qtd + " g)" : "")
        });
        refeicoesAvisadas[chave] = true;
    });
}

setInterval(verificarRefeicoes, 30 * 1000);

// ===== MEDICAMENTOS =====
let medicamentos = JSON.parse(localStorage.getItem("medicamentos")) || [];
const medAvisados = {};

const dicasMed = [
    "Dê apenas o que o veterinário receitou, na dose e nos horários indicados.",
    "Nunca dê remédio de humano ao pet sem orientação veterinária.",
    "Termine o tratamento completo, mesmo que o pet pareça melhor.",
    "Anote qualquer efeito diferente (vômito, sono demais, falta de apetite) e avise o veterinário.",
    "Guarde os medicamentos longe do alcance dos animais e crianças."
];

function mostrarDicaMed() {
    document.getElementById("dica-med").textContent =
        "💡 Dica: " + dicasMed[Math.floor(Math.random() * dicasMed.length)];
}

function atualizarSelectMed() {
    const select = document.getElementById("med-pet");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Escolha o pet</option>';

    pets.forEach(function (pet) {
        const opcao = document.createElement("option");
        opcao.value = pet.nome;
        opcao.textContent = pet.nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

function atualizarFiltroMed() {
    const select = document.getElementById("med-filtro");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Todos os pets</option>';

    const nomes = [];
    medicamentos.forEach(function (m) {
        if (!nomes.includes(m.pet)) nomes.push(m.pet);
    });

    nomes.forEach(function (nome) {
        const opcao = document.createElement("option");
        opcao.value = nome;
        opcao.textContent = nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

function lerHorarios(texto) {
    const lista = texto.split(",").map(function (h) {
        return h.trim();
    }).filter(function (h) {
        return h !== "";
    });

    const valido = lista.length > 0 && lista.every(function (h) {
        return /^([01]\d|2[0-3]):[0-5]\d$/.test(h);
    });

    return valido ? lista.sort() : null;
}

function medicamentoAtivo(m, hoje) {
    return m.inicio <= hoje && (!m.fim || m.fim >= hoje);
}

function mostrarMedicamentos() {
    atualizarFiltroMed();

    const lista = document.getElementById("lista-medicamentos");
    const resumo = document.getElementById("resumo-med");
    lista.innerHTML = "";
    resumo.innerHTML = "";

    const filtro = document.getElementById("med-filtro").value;
    const hoje = hojeISO();

    const tratamentos = medicamentos
        .filter(function (m) {
            return filtro === "" || m.pet === filtro;
        })
        .sort(function (a, b) {
            const aa = medicamentoAtivo(a, hoje) ? 0 : 1;
            const bb = medicamentoAtivo(b, hoje) ? 0 : 1;
            if (aa !== bb) return aa - bb;
            return a.pet < b.pet ? -1 : 1;
        });

    if (tratamentos.length === 0) {
        const vazio = document.createElement("li");
        vazio.textContent = "Nenhum medicamento cadastrado.";
        lista.appendChild(vazio);
        return;
    }

    // resumo: doses de hoje por pet
    const totais = {};
    tratamentos.forEach(function (m) {
        if (!medicamentoAtivo(m, hoje)) return;
        if (!totais[m.pet]) totais[m.pet] = { doses: 0, dadas: 0 };
        totais[m.pet].doses += m.horarios.length;
        totais[m.pet].dadas += (m.tomadas[hoje] || []).length;
    });

    Object.keys(totais).forEach(function (nome) {
        const t = totais[nome];
        const linha = document.createElement("div");
        linha.classList.add("resumo-pet");
        linha.textContent = "💊 " + nome + ": " + t.dadas + " de " + t.doses + " dose(s) dada(s) hoje";
        resumo.appendChild(linha);
    });

    tratamentos.forEach(function (m) {
        const item = document.createElement("li");
        const ativo = medicamentoAtivo(m, hoje);
        const dadasHoje = m.tomadas[hoje] || [];

        let status;
        if (m.inicio > hoje) {
            status = "🕒 Começa em " + formatarData(m.inicio);
            item.classList.add("futuro");
        } else if (m.fim && m.fim < hoje) {
            status = "✔️ Encerrado em " + formatarData(m.fim);
            item.classList.add("encerrado");
        } else if (m.fim) {
            status = "Faltam " + (diasAte(m.fim) + 1) + " dia(s) de tratamento";
        } else {
            status = "Uso contínuo";
        }

        let texto = m.pet + " - " + m.nome;
        if (m.dose) texto += " (" + m.dose + ")";
        texto += " | " + status;
        if (m.obs) texto += " | Obs: " + m.obs;
        item.textContent = texto;

        // botões de cada horário (só quando o tratamento está ativo)
        if (ativo) {
            const doses = document.createElement("div");
            doses.classList.add("doses");

            m.horarios.forEach(function (hora) {
                const dada = dadasHoje.includes(hora);
                const btn = document.createElement("button");
                btn.textContent = hora + (dada ? " ✅" : " ⏳");
                btn.classList.add("btn-dose");
                if (dada) btn.classList.add("dada");
                btn.onclick = function () {
                    if (dada) {
                        m.tomadas[hoje] = dadasHoje.filter(function (h) { return h !== hora; });
                    } else {
                        m.tomadas[hoje] = dadasHoje.concat([hora]);
                    }
                    salvarMedicamentos();
                };
                doses.appendChild(btn);
            });

            item.appendChild(doses);
        } else {
            const h = document.createElement("div");
            h.textContent = "Horários: " + m.horarios.join(", ");
            item.appendChild(h);
        }

        // evolução e efeitos colaterais
        if (m.notas.length > 0) {
            const notas = document.createElement("div");
            notas.classList.add("notas-med");
            notas.textContent = "📝 Evolução: " + m.notas.map(function (n) {
                return formatarData(n.data) + " - " + n.texto;
            }).join(" | ");
            item.appendChild(notas);
        }

        const btnNota = document.createElement("button");
        btnNota.textContent = "Anotar efeito/evolução";
        btnNota.onclick = function () {
            const resposta = prompt("Anote efeitos colaterais ou como o pet está reagindo:");
            if (resposta === null || resposta.trim() === "") return;
            m.notas.push({ data: hoje, texto: resposta.trim() });
            salvarMedicamentos();
        };

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = function () {
            const novosHorarios = prompt("Horários (ex: 08:00, 20:00):", m.horarios.join(", "));
            if (novosHorarios === null) return;

            const lido = lerHorarios(novosHorarios);
            if (!lido) {
                alert("Horários inválidos! Use hh:mm separados por vírgula, ex: 08:00, 20:00");
                return;
            }

            const novoFim = prompt("Data de fim (aaaa-mm-dd). Deixe vazio para uso contínuo:", m.fim);
            if (novoFim === null) return;

            if (novoFim !== "" && isNaN(new Date(novoFim + "T00:00:00"))) {
                alert("Data inválida! Use o formato aaaa-mm-dd, ex: 2026-12-15");
                return;
            }

            m.horarios = lido;
            m.fim = novoFim;
            salvarMedicamentos();
        };

        const btnApagar = document.createElement("button");
        btnApagar.textContent = "Apagar";
        btnApagar.onclick = function () {
            medicamentos.splice(medicamentos.indexOf(m), 1);
            salvarMedicamentos();
        };

        item.appendChild(btnNota);
        item.appendChild(btnEditar);
        item.appendChild(btnApagar);
        lista.appendChild(item);
    });
}

function salvarMedicamentos() {
    localStorage.setItem("medicamentos", JSON.stringify(medicamentos));
    mostrarMedicamentos();
}

document.getElementById("med-filtro").onchange = mostrarMedicamentos;

document.getElementById("btn-medicamento").onclick = function () {
    const pet = document.getElementById("med-pet").value;
    const nome = document.getElementById("med-nome").value;
    const dose = document.getElementById("med-dose").value;
    const horariosTexto = document.getElementById("med-horarios").value;
    const inicio = document.getElementById("med-inicio").value || hojeISO();
    const fim = document.getElementById("med-fim").value;
    const obs = document.getElementById("med-obs").value;

    if (pet === "" || nome === "" || horariosTexto === "") {
        alert("Escolha o pet e informe o medicamento e os horários!");
        return;
    }

    const horarios = lerHorarios(horariosTexto);
    if (!horarios) {
        alert("Horários inválidos! Use hh:mm separados por vírgula, ex: 08:00, 20:00");
        return;
    }

    if (fim !== "" && fim < inicio) {
        alert("A data de fim não pode ser antes do início!");
        return;
    }

    medicamentos.push({
        pet: pet,
        nome: nome,
        dose: dose,
        horarios: horarios,
        inicio: inicio,
        fim: fim,
        obs: obs,
        tomadas: {},
        notas: []
    });
    salvarMedicamentos();

    document.getElementById("med-pet").value = "";
    document.getElementById("med-nome").value = "";
    document.getElementById("med-dose").value = "";
    document.getElementById("med-horarios").value = "";
    document.getElementById("med-inicio").value = "";
    document.getElementById("med-fim").value = "";
    document.getElementById("med-obs").value = "";
};

// aviso na hora do medicamento (funciona com a página aberta)
function verificarMedicamentos() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const agora = new Date().toTimeString().slice(0, 5);
    const hoje = hojeISO();

    medicamentos.forEach(function (m) {
        if (!medicamentoAtivo(m, hoje)) return;
        if (!m.horarios.includes(agora)) return;
        if ((m.tomadas[hoje] || []).includes(agora)) return;

        const chave = m.pet + "|" + m.nome + "|" + agora + "|" + hoje;
        if (medAvisados[chave]) return;

        new Notification("PetCare 💊 Hora do medicamento", {
            body: m.pet + ": " + m.nome + (m.dose ? " (" + m.dose + ")" : "")
        });
        medAvisados[chave] = true;
    });
}

setInterval(verificarMedicamentos, 30 * 1000);

// ===== EXAMES =====
let exames = JSON.parse(localStorage.getItem("exames")) || [];

function atualizarSelectExames() {
    const select = document.getElementById("exa-pet");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Escolha o pet</option>';

    pets.forEach(function (pet) {
        const opcao = document.createElement("option");
        opcao.value = pet.nome;
        opcao.textContent = pet.nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

function atualizarFiltroExames() {
    const select = document.getElementById("exa-filtro");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Todos os pets</option>';

    const nomes = [];
    exames.forEach(function (e) {
        if (!nomes.includes(e.pet)) nomes.push(e.pet);
    });

    nomes.forEach(function (nome) {
        const opcao = document.createElement("option");
        opcao.value = nome;
        opcao.textContent = nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

function mostrarLembretesExames() {
    const box = document.getElementById("lembretes-exames");
    box.innerHTML = "";

    const pendentes = exames
        .filter(function (e) {
            return e.proximo && diasAte(e.proximo) <= 30;
        })
        .sort(function (a, b) {
            return a.proximo < b.proximo ? -1 : 1;
        });

    if (pendentes.length === 0) {
        box.textContent = "Nenhum exame agendado para os próximos 30 dias. ✅";
        return;
    }

    pendentes.forEach(function (e) {
        const dias = diasAte(e.proximo);
        const item = document.createElement("div");
        item.classList.add("lembrete");

        let texto;
        if (dias < 0) {
            item.classList.add("atrasada");
            texto = "⚠️ " + e.pet + " - " + e.tipo + ": passou há " + Math.abs(dias) + " dia(s)";
        } else if (dias === 0) {
            texto = "⏰ " + e.pet + " - " + e.tipo + ": é HOJE!";
        } else {
            texto = "⏰ " + e.pet + " - " + e.tipo + ": faltam " + dias + " dia(s) (" + formatarData(e.proximo) + ")";
        }
        item.textContent = texto;
        box.appendChild(item);
    });
}

function mostrarExames() {
    atualizarFiltroExames();
    mostrarLembretesExames();

    const lista = document.getElementById("lista-exames");
    lista.innerHTML = "";

    const filtro = document.getElementById("exa-filtro").value;

    const historico = exames
        .filter(function (e) {
            return filtro === "" || e.pet === filtro;
        })
        .sort(function (a, b) {
            return a.data < b.data ? 1 : -1;
        });

    if (historico.length === 0) {
        const vazio = document.createElement("li");
        vazio.textContent = "Nenhum exame registrado.";
        lista.appendChild(vazio);
        return;
    }

    historico.forEach(function (e) {
        const item = document.createElement("li");

        let texto = e.pet + " - " + e.tipo + " - " + formatarData(e.data);
        if (e.lab) texto += " | " + e.lab;
        if (e.resultado) {
            texto += " | Resultado: " + e.resultado;
        } else {
            texto += " | ⏳ Resultado pendente";
            item.classList.add("proxima");
        }
        if (e.obs) texto += " | Obs: " + e.obs;
        if (e.proximo) texto += " | Próximo: " + formatarData(e.proximo);

        item.textContent = texto + " ";

        const btnResultado = document.createElement("button");
        btnResultado.textContent = e.resultado ? "Editar resultado" : "Lançar resultado";
        btnResultado.onclick = function () {
            const resposta = prompt("Resultado do exame:", e.resultado);
            if (resposta === null) return;
            e.resultado = resposta.trim();
            salvarExames();
        };

        const btnProximo = document.createElement("button");
        btnProximo.textContent = "Reagendar";
        btnProximo.onclick = function () {
            const resposta = prompt(
                "Data do próximo exame (aaaa-mm-dd).\nDeixe vazio para remover:",
                e.proximo
            );
            if (resposta === null) return;

            if (resposta !== "" && isNaN(new Date(resposta + "T00:00:00"))) {
                alert("Data inválida! Use o formato aaaa-mm-dd, ex: 2026-12-15");
                return;
            }

            e.proximo = resposta;
            salvarExames();
        };

        const btnApagar = document.createElement("button");
        btnApagar.textContent = "Apagar";
        btnApagar.onclick = function () {
            exames.splice(exames.indexOf(e), 1);
            salvarExames();
        };

        item.appendChild(btnResultado);
        item.appendChild(btnProximo);
        item.appendChild(btnApagar);
        lista.appendChild(item);
    });
}

function salvarExames() {
    localStorage.setItem("exames", JSON.stringify(exames));
    mostrarExames();
}

document.getElementById("exa-filtro").onchange = mostrarExames;

document.getElementById("btn-exame").onclick = function () {
    const pet = document.getElementById("exa-pet").value;
    const tipo = document.getElementById("exa-tipo").value;
    const data = document.getElementById("exa-data").value || hojeISO();
    const lab = document.getElementById("exa-lab").value;
    const resultado = document.getElementById("exa-resultado").value;
    const obs = document.getElementById("exa-obs").value;
    const proximo = document.getElementById("exa-proximo").value;

    if (pet === "" || tipo === "") {
        alert("Escolha o pet e informe o exame!");
        return;
    }

    exames.push({
        pet: pet,
        tipo: tipo,
        data: data,
        lab: lab,
        resultado: resultado,
        obs: obs,
        proximo: proximo
    });
    salvarExames();

    document.getElementById("exa-pet").value = "";
    document.getElementById("exa-tipo").value = "";
    document.getElementById("exa-data").value = "";
    document.getElementById("exa-lab").value = "";
    document.getElementById("exa-resultado").value = "";
    document.getElementById("exa-obs").value = "";
    document.getElementById("exa-proximo").value = "";
};

// ===== MONITORAMENTO =====
let monitoramentos = JSON.parse(localStorage.getItem("monitoramentos")) || [];

const emojiEstresse = { 1: "😌", 2: "🙂", 3: "😐", 4: "😟", 5: "😰" };

function atualizarSelectMon() {
    const select = document.getElementById("mon-pet");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Escolha o pet</option>';

    pets.forEach(function (pet) {
        const opcao = document.createElement("option");
        opcao.value = pet.nome;
        opcao.textContent = pet.nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

function atualizarFiltroMon() {
    const select = document.getElementById("mon-filtro");
    const escolhido = select.value;

    select.innerHTML = '<option value="">Todos os pets</option>';

    pets.forEach(function (pet) {
        const opcao = document.createElement("option");
        opcao.value = pet.nome;
        opcao.textContent = pet.nome;
        select.appendChild(opcao);
    });

    select.value = escolhido;
}

// registros dos últimos 7 dias de um pet
function recentesMon(nomePet) {
    return monitoramentos.filter(function (r) {
        const dias = diasAte(r.data);
        return r.pet === nomePet && dias <= 0 && dias >= -6;
    });
}

function mostrarAlertasMon() {
    const box = document.getElementById("alertas-mon");
    box.innerHTML = "";

    const nomes = [];
    monitoramentos.forEach(function (r) {
        if (!nomes.includes(r.pet)) nomes.push(r.pet);
    });

    let temAlerta = false;

    nomes.forEach(function (nome) {
        const recentes = recentesMon(nome);
        if (recentes.length === 0) return;

        const soma = recentes.reduce(function (total, r) {
            return total + r.estresse;
        }, 0);
        const media = soma / recentes.length;

        const comSintomas = recentes.filter(function (r) {
            return r.sintomas && diasAte(r.data) >= -2;
        });

        if (media >= 4) {
            temAlerta = true;
            const item = document.createElement("div");
            item.classList.add("lembrete", "atrasada");
            item.textContent =
                "⚠️ " + nome + ": estresse alto nos últimos 7 dias (média " +
                media.toFixed(1) + "). Vale conversar com o veterinário.";
            box.appendChild(item);
        }

        if (comSintomas.length > 0) {
            temAlerta = true;
            const item = document.createElement("div");
            item.classList.add("lembrete");
            item.textContent =
                "⏰ " + nome + ": sintomas registrados nos últimos 3 dias (" +
                comSintomas[comSintomas.length - 1].sintomas +
                "). Se persistirem ou piorarem, procure o veterinário.";
            box.appendChild(item);
        }
    });

    if (!temAlerta) {
        box.textContent = "Nenhum alerta no momento. ✅";
    }
}

function mostrarMonitoramento() {
    atualizarFiltroMon();
    mostrarAlertasMon();

    const lista = document.getElementById("lista-monitoramento");
    const resumo = document.getElementById("resumo-mon");
    lista.innerHTML = "";
    resumo.innerHTML = "";

    const filtro = document.getElementById("mon-filtro").value;

    const historico = monitoramentos
        .filter(function (r) {
            return filtro === "" || r.pet === filtro;
        })
        .sort(function (a, b) {
            return a.data < b.data ? 1 : -1;
        });

    if (historico.length === 0) {
        const vazio = document.createElement("li");
        vazio.textContent = "Nenhum registro de monitoramento.";
        lista.appendChild(vazio);
        return;
    }

    // resumo: média de estresse dos últimos 7 dias por pet
    const nomes = [];
    historico.forEach(function (r) {
        if (!nomes.includes(r.pet)) nomes.push(r.pet);
    });

    nomes.forEach(function (nome) {
        const recentes = recentesMon(nome);
        if (recentes.length === 0) return;

        const soma = recentes.reduce(function (total, r) {
            return total + r.estresse;
        }, 0);
        const media = soma / recentes.length;

        const linha = document.createElement("div");
        linha.classList.add("resumo-pet");
        linha.textContent =
            "📊 " + nome + ": estresse médio dos últimos 7 dias = " +
            media.toFixed(1) + " de 5 (" + recentes.length + " registro(s))";
        resumo.appendChild(linha);
    });

    historico.forEach(function (r) {
        const item = document.createElement("li");

        let texto =
            r.pet + " - " + formatarData(r.data) +
            " | Comportamento: " + r.comportamento +
            " | Apetite: " + r.apetite +
            " | Estresse: " + r.estresse + "/5 " + emojiEstresse[r.estresse];

        if (r.sintomas) {
            texto += " | Sintomas: " + r.sintomas;
            item.classList.add("proxima");
        }
        if (r.obs) texto += " | Obs: " + r.obs;

        if (r.estresse >= 4) item.classList.add("atrasada");

        item.textContent = texto + " ";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = function () {
            const novoEstresse = prompt("Nível de estresse (1 a 5):", r.estresse);
            if (novoEstresse === null) return;

            const n = Number(novoEstresse);
            if (!Number.isInteger(n) || n < 1 || n > 5) {
                alert("Digite um número de 1 a 5!");
                return;
            }

            const novoSintoma = prompt("Sintomas (deixe vazio para nenhum):", r.sintomas);
            if (novoSintoma === null) return;

            r.estresse = n;
            r.sintomas = novoSintoma.trim();
            salvarMonitoramento();
        };

        const btnApagar = document.createElement("button");
        btnApagar.textContent = "Apagar";
        btnApagar.onclick = function () {
            monitoramentos.splice(monitoramentos.indexOf(r), 1);
            salvarMonitoramento();
        };

        item.appendChild(btnEditar);
        item.appendChild(btnApagar);
        lista.appendChild(item);
    });
}

function salvarMonitoramento() {
    localStorage.setItem("monitoramentos", JSON.stringify(monitoramentos));
    mostrarMonitoramento();
}

document.getElementById("mon-filtro").onchange = mostrarMonitoramento;

document.getElementById("btn-monitor").onclick = function () {
    const pet = document.getElementById("mon-pet").value;
    const data = document.getElementById("mon-data").value || hojeISO();
    const comportamento = document.getElementById("mon-comp").value;
    const apetite = document.getElementById("mon-apetite").value;
    const estresse = Number(document.getElementById("mon-estresse").value);
    const sintomas = document.getElementById("mon-sintomas").value.trim();
    const obs = document.getElementById("mon-obs").value;

    if (pet === "") {
        alert("Escolha o pet!");
        return;
    }

    monitoramentos.push({
        pet: pet,
        data: data,
        comportamento: comportamento,
        apetite: apetite,
        estresse: estresse,
        sintomas: sintomas,
        obs: obs
    });
    salvarMonitoramento();

    document.getElementById("mon-pet").value = "";
    document.getElementById("mon-data").value = "";
    document.getElementById("mon-comp").value = "Normal";
    document.getElementById("mon-apetite").value = "Normal";
    document.getElementById("mon-estresse").value = "1";
    document.getElementById("mon-sintomas").value = "";
    document.getElementById("mon-obs").value = "";
};
// ===== PAINEL DE ALERTAS =====
function coletarAlertas() {
    const alertas = [];
    const hoje = hojeISO();
    const agora = new Date().toTimeString().slice(0, 5);

    function add(nivel, texto) {
        alertas.push({ nivel: nivel, texto: texto });
    }

    // vacinas
    vacinas.forEach(function (v) {
        if (!v.proxima) return;
        const d = diasAte(v.proxima);
        if (d < 0) {
            add("alto", "💉 " + v.pet + " - " + v.nome + ": vacina atrasada há " + Math.abs(d) + " dia(s)");
        } else if (d <= 7) {
            add("medio", "💉 " + v.pet + " - " + v.nome + ": " + (d === 0 ? "é HOJE" : "faltam " + d + " dia(s)"));
        }
    });

    // consultas (retornos)
    consultas.forEach(function (c) {
        if (!c.retorno) return;
        const d = diasAte(c.retorno);
        if (d < 0 && d >= -30) {
            add("alto", "🩺 " + c.pet + ": retorno da consulta passou há " + Math.abs(d) + " dia(s)");
        } else if (d >= 0 && d <= 7) {
            add("medio", "🩺 " + c.pet + ": retorno " + (d === 0 ? "é HOJE" : "em " + d + " dia(s)"));
        }
    });

    // exames
    exames.forEach(function (e) {
        if (e.proximo) {
            const d = diasAte(e.proximo);
            if (d < 0 && d >= -30) {
                add("alto", "🧪 " + e.pet + " - " + e.tipo + ": exame agendado passou há " + Math.abs(d) + " dia(s)");
            } else if (d >= 0 && d <= 7) {
                add("medio", "🧪 " + e.pet + " - " + e.tipo + ": " + (d === 0 ? "é HOJE" : "em " + d + " dia(s)"));
            }
        }
        if (!e.resultado && diasAte(e.data) <= -7) {
            add("medio", "🧪 " + e.pet + " - " + e.tipo + ": resultado pendente há " + Math.abs(diasAte(e.data)) + " dia(s)");
        }
    });

    // refeições de hoje ainda não marcadas
    refeicoes.forEach(function (r) {
        if (r.hora < agora && !r.feitas.includes(hoje)) {
            add("medio", "🍽️ " + r.pet + ": refeição das " + r.hora + " (" + r.alimento + ") não foi marcada hoje");
        }
    });

    // doses de medicamento atrasadas hoje
    medicamentos.forEach(function (m) {
        if (!medicamentoAtivo(m, hoje)) return;
        const dadas = m.tomadas[hoje] || [];
        m.horarios.forEach(function (h) {
            if (h < agora && !dadas.includes(h)) {
                add("alto", "💊 " + m.pet + " - " + m.nome + ": dose das " + h + " não foi marcada");
            }
        });
    });

    // monitoramento: estresse, sintomas e apetite
    const nomes = [];
    monitoramentos.forEach(function (r) {
        if (!nomes.includes(r.pet)) nomes.push(r.pet);
    });

    nomes.forEach(function (nome) {
        const recentes = recentesMon(nome);
        if (recentes.length === 0) return;

        const soma = recentes.reduce(function (t, r) { return t + r.estresse; }, 0);
        const media = soma / recentes.length;
        if (media >= 4) {
            add("alto", "😰 " + nome + ": estresse alto nos últimos 7 dias (média " + media.toFixed(1) + ")");
        }

        recentes.forEach(function (r) {
            if (r.sintomas && diasAte(r.data) >= -2) {
                add("medio", "🌡️ " + nome + ": sintomas em " + formatarData(r.data) + " (" + r.sintomas + ")");
            }
            if (r.apetite === "Não quis comer" && diasAte(r.data) >= -2) {
                add("medio", "🍽️ " + nome + ": não quis comer em " + formatarData(r.data));
            }
        });
    });

    // peso: variação grande entre as duas últimas pesagens
    pets.forEach(function (p) {
        const h = p.historicoPeso || [];
        if (h.length < 2) return;

        const anterior = Number(h[h.length - 2].peso);
        const atual = Number(h[h.length - 1].peso);
        if (!anterior) return;

        const variacao = (atual - anterior) / anterior * 100;
        if (Math.abs(variacao) >= 10) {
            add("medio", "⚖️ " + p.nome + ": peso mudou " + variacao.toFixed(0) + "% (" + anterior + " → " + atual + " kg)");
        }
    });

    return alertas;
}

function mostrarAlertas() {
    const box = document.getElementById("painel-alertas");
    const contador = document.getElementById("contador-alertas");
    box.innerHTML = "";

    const alertas = coletarAlertas().sort(function (a, b) {
        if (a.nivel === b.nivel) return 0;
        return a.nivel === "alto" ? -1 : 1;
    });

    if (alertas.length === 0) {
        contador.textContent = "";
        box.textContent = "Nenhum alerta no momento: tudo certo! ✅";
        return;
    }

    const urgentes = alertas.filter(function (a) { return a.nivel === "alto"; }).length;
    contador.textContent = urgentes + " urgente(s) e " + (alertas.length - urgentes) + " atenção";

    alertas.forEach(function (a) {
        const item = document.createElement("div");
        item.classList.add("lembrete");
        if (a.nivel === "alto") item.classList.add("atrasada");
        item.textContent = a.texto;
        box.appendChild(item);
    });
}

// atualiza o painel após qualquer clique ou mudança de campo, e a cada minuto
document.addEventListener("click", function () {
    setTimeout(mostrarAlertas, 100);
});
document.addEventListener("change", function () {
    setTimeout(mostrarAlertas, 100);
});
setInterval(mostrarAlertas, 60 * 1000);


// ===== INICIAR =====
mostrarPets();
mostrarVacinas();
mostrarConsultas();
verificarNotificacoes();
verificarNotificacoes();
mostrarMedicamentos();
mostrarDica();
mostrarDicaMed();
verificarNotificacoes();

