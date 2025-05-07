const nomesCavaleiros = ['Seiya', 'Shiryu', 'Hyoga', 'Shun', 'Ikki'];
const nomesCasas = [
    'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
    'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
];
const poderCavaleiros = [1.5, 1.4, 1.3, 1.2, 1.1];
const dificuldadesCasas = [50, 55, 60, 70, 75, 80, 85, 90, 95, 100, 110, 120];
const poderCavaleirosPadrao = [...poderCavaleiros];
const dificuldadesCasasPadrao = [...dificuldadesCasas];

let tempoCaminhado = 0;
let tempoBatalhado = 0;

const containerMatriz = document.getElementById('containerMatriz');
const matrizMapa = document.getElementById('matrizMapa');
const botaoSimulacao = document.getElementById('botaoSimulacao');
const displayTimer = document.getElementById('displayTimer');
const situacaoCavaleiros = document.getElementById('situacaoCavaleiros');
const historicoEventos = document.getElementById('historicoEventos');
const botaoRecomecar = document.getElementById('botaoRecomecar');

const overlay = document.createElement('div');
overlay.id = 'configOverlay';
overlay.style.display = 'none';
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100vw';
overlay.style.height = '100vh';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
overlay.style.zIndex = '999';
document.body.appendChild(overlay);

const botaoReplay = document.createElement('div');
botaoReplay.id = 'botaoReplay';
botaoReplay.style.fontSize = '20px';
botaoReplay.style.fontWeight = 'bold';
botaoReplay.style.margin = '10px';
botaoReplay.style.padding = '10px';
botaoReplay.style.border = '2px solid #333';
botaoReplay.style.borderRadius = '5px';
botaoReplay.style.backgroundColor = '#000080';
botaoReplay.style.color = 'white'
botaoReplay.textContent = 'Recomeçar';
botaoReplay.style.display = "none";
botaoReplay.style.pointerEvents = "none";
botaoReplay.style.width = 'fit-content';
botaoReplay.style.cursor = 'pointer';

botaoRecomecar.appendChild(botaoReplay);

const configModal = document.createElement('div');
configModal.style.overflow = 'hidden';
configModal.id = 'configModal';
configModal.style.display = 'none';
configModal.style.position = 'fixed';
configModal.style.top = '50%';
configModal.style.left = '50%';
configModal.style.transform = 'translate(-50%, -50%)';
configModal.style.backgroundColor = 'white';
configModal.style.padding = '20px';
configModal.style.border = '1px solid #C3C3C3';
configModal.style.zIndex = '1000';
configModal.style.width = '500px';
configModal.style.maxHeight = '100vh';
configModal.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
document.body.appendChild(configModal);

document.getElementById('configButton').addEventListener('click', () => {
    overlay.style.display = 'block';
    configModal.style.display = 'block';
    document.body.style.setProperty('--scrollbar-width', `${window.innerWidth - document.documentElement.clientWidth}px`);
    document.body.classList.add("no-scroll");

    let conteudoModal = `
        <h2 style="text-align: center; margin-bottom: 20px; margin-top: 0px;">Configurar Poderes</h2>
        <div style="margin-bottom: 20px;">
            <h3>Cavaleiros de Bronze</h3>
            <div style="display: grid; justify-items: center; grid-template-columns: 0.5fr 0.5fr; gap: 10px;">
    `;

    nomesCavaleiros.forEach((nome, index) => {
        conteudoModal += `
            <div style="margin-bottom: 10px;">
                <label for="knight-${nome}">${nome}:</label>
                <input type="number" id="knight-${nome}" value="${poderCavaleiros[index]}" 
                       min="0" style="width: 50px; margin-left: 5px;">
            </div>
        `;
    });

    conteudoModal += `
            </div>
        </div>
        <div>
            <h3>Casas do Zodíaco</h3>
            <div style="display: grid; justify-items: center; grid-template-columns: 0.5fr 0.5fr; gap: 10px;">
    `;

    nomesCasas.forEach((nome, index) => {
        conteudoModal += `
            <div style="margin-bottom: 10px;">
                <label for="house-${index + 1}">${nome}:</label>
                <input type="number" id="house-${index + 1}" value="${dificuldadesCasas[index]}" 
                       min="0" style="width: 50px; margin-left: 5px;">
            </div>
        `;
    });

    conteudoModal += `
            </div>
        </div>
        <div style="margin-top: 20px; text-align: center;">
            <button class="buttonMenu" id="salvarConfig" style="padding: 8px 15px; margin-right: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Salvar</button>
            <button class="buttonMenu" id="restaurarPadroes" style="padding: 8px 15px; margin-right: 10px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Restaurar padrões</button>
            <button class="buttonMenu" id="cancelarConfig" style="padding: 8px 15px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancelar</button>
        </div>
    `;

    configModal.innerHTML = conteudoModal;
    configModal.style.display = 'block';

    document.getElementById('salvarConfig').addEventListener('click', () => {
        for (let i = 0; i < nomesCavaleiros.length; i++) {
            const input = document.querySelector(`input#knight-${nomesCavaleiros[i]}`);
            const valor = parseFloat(input?.value);
            if (!isNaN(valor)) {
                poderCavaleiros[i] = valor;
            }
        }

        console.log('Poderes dos Cavaleiros de Bronze Atualizados:', poderCavaleiros);

        for (let i = 0; i < 12; i++) {
            const input = document.querySelector(`input#house-${i + 1}`);
            const valor = parseFloat(input?.value);
            if (!isNaN(valor)) {
                dificuldadesCasas[i] = valor;
            }
        }

        console.log('Dificuldades das Casas Atualizadas:', dificuldadesCasas);

        fecharModal();
    });

    document.getElementById('restaurarPadroes').addEventListener('click', () => {
        nomesCavaleiros.forEach((nome, i) => {
            const input = document.querySelector(`input#knight-${nome}`);
            input.value = poderCavaleirosPadrao[i];
        });

        nomesCasas.forEach((_, i) => {
            const input = document.querySelector(`input#house-${i + 1}`);
            input.value = dificuldadesCasasPadrao[i];
        });
    });

    document.getElementById('cancelarConfig').addEventListener('click', fecharModal);

    function fecharModal() {
        configModal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.classList.remove("no-scroll");
        document.body.style.removeProperty('--scrollbar-width');
    }

    overlay.addEventListener("click", function (event) {
        if (event.target === configOverlay) {
            fecharModal();
        }
    });
});

botaoReplay.addEventListener('click', function resetarSimulacao() {
    tempoCaminhado = 0;
    tempoBatalhado = 0;

    botaoSimulacao.innerHTML = '';
    displayTimer.innerHTML = '';

    matrizMapa.innerHTML = '';
    situacaoCavaleiros.innerHTML = '';
    historicoEventos.innerHTML = '';

    if (document.getElementById('modalLutaBoss')) {
        document.getElementById('modalLutaBoss').remove();
    }

    botaoReplay.style.display = "none";
    botaoReplay.style.pointerEvents = "none";
    document.getElementById('configButton').style.display = "flex";
    document.getElementById('playButton').style.display = "flex";
    document.querySelector('.rowBotoes').style.marginBlock = '40px';
})

document.getElementById('playButton').addEventListener('click', async () => {
    botaoReplay.style.display = "flex";
    botaoReplay.style.pointerEvents = "auto";
    document.getElementById('configButton').style.display = "none";
    document.getElementById('playButton').style.display = "none";
    document.querySelector('.rowBotoes').style.marginTop = '0px';
    document.querySelector('.rowBotoes').style.marginBottom = '30px';
    const response = await fetch('Mapa.json');
    const matriz = await response.json();

    const tabela = document.createElement('table');
    for (let i = 0; i < 42; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 42; j++) {
            const celula = document.createElement('td');
            celula.style.border = '1px solid black';
            celula.style.width = '15px';
            celula.style.height = '15px';

            switch (matriz[i][j]) {
                case 0: celula.style.backgroundImage = "url('assets/SeiyaIcon.jpg')"; celula.style.backgroundSize = 'cover'; break; // Ponto de Partida
                case 1: celula.style.backgroundColor = 'red'; break; // Casa de Áries
                case 2: celula.style.backgroundColor = 'orange'; break; // Casa de Touro
                case 3: celula.style.backgroundColor = 'purple'; break; // Casa de Gêmeos
                case 4: celula.style.backgroundColor = 'pink'; break; // Casa de Câncer
                case 5: celula.style.backgroundColor = 'gold'; break; // Casa de Leão
                case 6: celula.style.backgroundColor = 'lightgreen'; break; // Casa de Virgem
                case 7: celula.style.backgroundColor = 'cyan'; break; // Casa de Libra
                case 8: celula.style.backgroundColor = 'darkred'; break; // Casa de Escorpião
                case 9: celula.style.backgroundColor = 'blue'; break; // Casa de Sagitário
                case 10: celula.style.backgroundColor = 'brown'; break; // Casa de Capricórnio
                case 11: celula.style.backgroundColor = 'lightblue'; break; // Casa de Aquário
                case 12: celula.style.backgroundColor = 'violet'; break; // Casa de Peixes
                case 13: celula.style.backgroundImage = "url('assets/AthenaIcon.jpg')"; celula.style.backgroundSize = 'cover'; break; // Chegada
                case 14: celula.style.backgroundColor = 'darkgreen'; break; // Montanhoso
                case 15: celula.style.backgroundColor = 'lightgray'; break; // Plano
                case 16: celula.style.backgroundColor = 'gray'; break; // Rochoso
                default: celula.style.backgroundColor = 'black'; break;
            }

            celula.dataset.type = matriz[i][j];
            celula.dataset.row = i;
            celula.dataset.col = j;

            row.appendChild(celula);
        }
        tabela.appendChild(row);
    }
    matrizMapa.appendChild(tabela);

    let posicaoComeco = null;
    let posicaoFim = null;

    for (let i = 0; i < 42; i++) {
        for (let j = 0; j < 42; j++) {
            if (matriz[i][j] === 0) {
                posicaoComeco = { row: i, col: j };
            } else if (matriz[i][j] === 13) {
                posicaoFim = { row: i, col: j };
            }
        }
    }

    const botaoEncontrarCaminho = document.createElement('button');
    botaoEncontrarCaminho.textContent = 'Iniciar simulação';
    botaoEncontrarCaminho.classList = "buttonMenu";
    botaoEncontrarCaminho.style.backgroundColor = "rgb(15, 201, 77)";
    botaoEncontrarCaminho.addEventListener('click', () => {
        if (posicaoComeco && posicaoFim) {
            botaoEncontrarCaminho.textContent = 'Simulação em andamento...';
            botaoEncontrarCaminho.style.backgroundColor = "rgb(230, 230, 230)";
            botaoEncontrarCaminho.style.pointerEvents = "none";
            const caminho = achaCaminhoMaisCurto(matriz, posicaoComeco, posicaoFim);
            displayCaminhoPassoPorPasso(caminho, tabela, matriz);
        }
    });

    botaoSimulacao.appendChild(botaoEncontrarCaminho);

    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timerDisplay';
    timerDisplay.style.fontSize = '20px';
    timerDisplay.style.fontWeight = 'bold';
    timerDisplay.style.margin = '10px';
    timerDisplay.style.padding = '10px';
    timerDisplay.style.border = '2px solid #333';
    timerDisplay.style.borderRadius = '5px';
    timerDisplay.style.backgroundColor = '#f0f0f0';
    timerDisplay.textContent = 'Tempo total: 0 minutos';
    timerDisplay.style.width = 'fit-content';

    displayTimer.appendChild(timerDisplay);

    // Algoritmo pathfinding (A*)
    function achaCaminhoMaisCurto(matriz, comeco, fim) {
        const rows = matriz.length;
        const colunas = matriz[0].length;

        const gScore = Array(rows).fill().map(() => Array(colunas).fill(Infinity)); // custo do comeco para nó atual
        gScore[comeco.row][comeco.col] = 0;

        const fScore = Array(rows).fill().map(() => Array(colunas).fill(Infinity)); // custo total estimado
        fScore[comeco.row][comeco.col] = heuristic(comeco, fim);

        const visitado = Array(rows).fill().map(() => Array(colunas).fill(false));

        const anterior = Array(rows).fill().map(() => Array(colunas).fill(null));

        const queue = [{
            row: comeco.row,
            col: comeco.col,
            fScore: fScore[comeco.row][comeco.col]
        }];

        // Manhattan
        function heuristic(a, b) {
            return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
        }

        function getCustoTerreno(celulaType) {
            switch (celulaType) {
                case 14: return 200; // Montanhoso
                case 15: return 1;   // Plano
                case 16: return 5;   // Rochoso
                default: return 1;
            }
        }

        while (queue.length > 0) {
            queue.sort((a, b) => a.fScore - b.fScore);
            const current = queue.shift();

            if (current.row === fim.row && current.col === fim.col) {
                break;
            }

            if (visitado[current.row][current.col]) continue;

            visitado[current.row][current.col] = true;

            const direcoes = [[-1, 0], [0, 1], [1, 0], [0, -1]];

            for (const [dRow, dCol] of direcoes) {
                const newRow = current.row + dRow;
                const newCol = current.col + dCol;

                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < colunas && !visitado[newRow][newCol]) {
                    const terrainCost = getCustoTerreno(matriz[newRow][newCol]);
                    const tentativeGScore = gScore[current.row][current.col] + terrainCost;

                    if (tentativeGScore < gScore[newRow][newCol]) {
                        anterior[newRow][newCol] = { row: current.row, col: current.col };
                        gScore[newRow][newCol] = tentativeGScore;
                        fScore[newRow][newCol] = tentativeGScore + heuristic({ row: newRow, col: newCol }, fim);

                        const isInQueue = queue.some(item => item.row === newRow && item.col === newCol);
                        if (!isInQueue) {
                            queue.push({
                                row: newRow,
                                col: newCol,
                                fScore: fScore[newRow][newCol]
                            });
                        }
                    }
                }
            }
        }

        const caminho = [];
        let current = { row: fim.row, col: fim.col };

        while (current && (current.row !== comeco.row || current.col !== comeco.col)) {
            caminho.unshift(current);
            current = anterior[current.row][current.col];
        }

        if (caminho.length > 0) {
            caminho.unshift(comeco);
        }

        let tempoTotal = 0;
        for (const pos of caminho) {
            if (pos.row !== comeco.row || pos.col !== comeco.col) {
                tempoTotal += getCustoTerreno(matriz[pos.row][pos.col]);
            }
        }
        tempoCaminhado = tempoTotal;

        return caminho;
    }

    const nomesCavaleiros = ['Seiya', 'Shiryu', 'Hyoga', 'Shun', 'Ikki'];
    const containerCavaleiros = document.createElement('div');
    containerCavaleiros.style.width = '130px';
    containerCavaleiros.style.display = 'flex';
    containerCavaleiros.style.flexDirection = 'column';
    containerCavaleiros.style.marginInline = '40px';
    containerCavaleiros.style.justifyContent = 'space-around';

    const vidasCavaleiros = {
        'Seiya': 5,
        'Shiryu': 5,
        'Hyoga': 5,
        'Shun': 5,
        'Ikki': 5
    };

    nomesCavaleiros.forEach((nome, index) => {
        const divCavaleiros = document.createElement('div');
        divCavaleiros.style.textAlign = 'center';
        divCavaleiros.style.marginBottom = '20px';
        divCavaleiros.style.height = 'fit-content';
        divCavaleiros.id = `knight-${nome}`;

        const nomeElem = document.createElement('h3');
        nomeElem.textContent = nome;
        nomeElem.style.marginBlock = '0px';
        divCavaleiros.appendChild(nomeElem);

        const poderElem = document.createElement('p');
        poderElem.textContent = `Poder: ${poderCavaleiros[index]}`;
        poderElem.style.margin = '2px 0 4px 0';
        poderElem.style.fontSize = '14px';
        poderElem.style.color = '#000';
        divCavaleiros.appendChild(poderElem);

        const img = document.createElement('img');
        img.src = `assets/${nome}.png`;
        img.alt = `${nome} knight`;
        img.style.width = '80px';
        img.style.height = '120px';
        img.style.border = '1px solid #c3c3c3';
        divCavaleiros.appendChild(img);

        const divCoracoes = document.createElement('div');
        divCoracoes.style.marginTop = '5px';
        divCoracoes.id = `hearts-${nome}`;

        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('span');
            heart.textContent = '❤️';
            heart.style.margin = '0 2px';
            divCoracoes.appendChild(heart);
        }

        divCavaleiros.appendChild(divCoracoes);
        containerCavaleiros.appendChild(divCavaleiros);
    });

    situacaoCavaleiros.appendChild(containerCavaleiros);

    function atualizaVidaCavaleiros() {
        nomesCavaleiros.forEach(nome => {
            const divCoracoes = document.getElementById(`hearts-${nome}`);
            const img = document.querySelector(`#knight-${nome} img`);

            divCoracoes.innerHTML = '';

            const vidas = vidasCavaleiros[nome];

            if (vidas > 0) {
                for (let i = 0; i < vidasCavaleiros
                [nome]; i++) {
                    const heart = document.createElement('span');
                    heart.textContent = '❤️';
                    heart.style.margin = '0 2px';
                    divCoracoes.appendChild(heart);
                }

                img.style.filter = 'none';

            } else {
                img.style.filter = 'grayscale(100%)';
                const textoMorto = document.createElement('span');
                textoMorto.textContent = 'Cavaleiro morto.';
                textoMorto.style.margin = '0 2px';
                divCoracoes.appendChild(textoMorto);
            }
        });
    }

    const modalLutaBoss = document.createElement('div');
    modalLutaBoss.id = 'modalLutaBoss';
    modalLutaBoss.style.display = 'none';
    modalLutaBoss.style.flexDirection = 'column';
    modalLutaBoss.style.alignItems = 'center';
    modalLutaBoss.style.width = 'fit-content';
    modalLutaBoss.style.height = 'fit-content';
    modalLutaBoss.style.backgroundColor = '#f3f3f3';
    modalLutaBoss.style.padding = '20px';
    modalLutaBoss.style.border = '1px solid #c3c3c3';
    modalLutaBoss.style.marginRight = '20px';
    modalLutaBoss.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    historicoEventos.appendChild(modalLutaBoss);

    function mostraLutaBoss(casaIndex, resumeCallback) {
        const nomeDaCasa = nomesCasas[casaIndex - 1];
        const poderBoss = dificuldadesCasas[casaIndex - 1] || 50;

        const cavaleirosSelecionados = selecionaMelhoresCavaleiros(casaIndex, poderBoss);

        let poderTotal = 0;
        cavaleirosSelecionados.forEach(nome => {
            const index = nomesCavaleiros.indexOf(nome);
            const poderCavaleiroBronze = index >= 0 && index < poderCavaleiros.length ?
                poderCavaleiros[index] : 1.0;
            poderTotal += poderCavaleiroBronze;
        });

        poderTotal = poderTotal > 0 ? poderTotal : 1;

        const duracaoBatalha = Math.round(poderBoss / poderTotal);

        modalLutaBoss.innerHTML = `
            <h2 style="margin-top: 0px; font-size: 18px;">Batalha na Casa de ${nomeDaCasa}</h2>
            <img src="assets/${nomeDaCasa}.png" alt="Cavaleiro de ${nomeDaCasa}" style="width: 150px; height: 285px; object-fit: fill; border: 1px solid #c3c3c3;">
            <p>Poder do Cavaleiro de Ouro: ${poderBoss}</p>
            <div style="align-items: center">
                <h3 style="margin-top: 0px; font-size: 18px;">Cavaleiros selecionados:</h3>
                <ul>
                    ${cavaleirosSelecionados.map(nome => {
            const index = nomesCavaleiros.indexOf(nome);
            const valorPoder = index >= 0 && index < poderCavaleiros.length ?
                poderCavaleiros[index] : 1.0;
            return `<li>${nome} (Poder: ${valorPoder.toFixed(1)})</li>`;
        }).join('')}
                </ul>
                <p>Poder total: ${poderTotal.toFixed(1)}</p>
                <p>Tempo de batalha: ${duracaoBatalha} minutos</p>
                <button id="continueBattle" class="buttonMenu" style="width: 100%; padding: 5px 15px;">Continuar</button>
            </div>
        `;

        modalLutaBoss.style.display = 'flex';

        cavaleirosSelecionados.forEach(nome => {
            vidasCavaleiros
            [nome]--;
        });

        atualizaVidaCavaleiros();

        document.getElementById('continueBattle').addEventListener('click', () => {
            modalLutaBoss.style.display = 'none';

            resumeCallback(duracaoBatalha);
        });
    }

    // Algoritmo selecionar cavaleiros de bronze
    function selecionaMelhoresCavaleiros(casaIndex, poderBoss) {
        const cavaleirosVivos = nomesCavaleiros.filter(nome => vidasCavaleiros
        [nome] > 0);

        if (cavaleirosVivos.length === 0) {
            alert('Todos os cavaleiros estão fora de combate! Fim de jogo.');
            botaoEncontrarCaminho.textContent = 'Simulação finalizada.';
            return;
        }

        const indicesCasasRestantes = [];
        for (let i = 1; i <= 12; i++) {
            if (i >= casaIndex) {
                indicesCasasRestantes.push(i);
            }
        }

        const poderCasasRestantes = indicesCasasRestantes.map(idx =>
            typeof dificuldadesCasas[idx - 1] === 'number' ? dificuldadesCasas[idx - 1] : 50);

        // Calcula dificuldade total restante e a média
        const dificuldadeRestanteTotal = poderCasasRestantes.reduce((sum, power) => sum + power, 0);
        const dificuldadeMediaCasas = dificuldadeRestanteTotal / poderCasasRestantes.length || 1;

        const casasRestantes = indicesCasasRestantes.length;

        // Determina se a casa atual é mais ou menos dificil que a media
        const dificuldadeCasaAtual = poderBoss / dificuldadeMediaCasas;
        const casaAtualEhDificil = dificuldadeCasaAtual > 1.2; // 20% harder than average
        const casaAtualEhFacil = dificuldadeCasaAtual < 0.8; // 20% easier than average

        const coracoesRestantes = cavaleirosVivos.reduce((sum, nome) => sum + vidasCavaleiros
        [nome], 0);

        // Calcula media de coracoes necessarios por casas remanescentes
        const avgCoracoesPorCasas = coracoesRestantes / casasRestantes;

        // Moderador de quantidade de corações
        let heartBudget;
        if (avgCoracoesPorCasas >= 2.5) {
            // Varios coracoes
            heartBudget = casaAtualEhDificil ? 3 : casaAtualEhFacil ? 1 : 2;
        } else if (avgCoracoesPorCasas >= 1.5) {
            // Quantidade media
            heartBudget = casaAtualEhDificil ? 2 : 1;
        } else {
            // Seja conservador, poucos coracoes disponiveis
            heartBudget = Math.min(1, Math.ceil(coracoesRestantes / (casasRestantes * 1.5)));
        }

        if (casasRestantes <= 3) {
            heartBudget = Math.max(heartBudget, Math.min(2, coracoesRestantes - 1));
        }

        const dadosLutador = cavaleirosVivos.map(nome => {
            const index = nomesCavaleiros.indexOf(nome);
            const poder = index >= 0 && index < poderCavaleiros.length ?
                poderCavaleiros[index] : 1.0;
            const coracoes = vidasCavaleiros
            [nome];

            const poderPorCoracao = poder / Math.max(1, coracoes);

            const fatorUltimoCoracao = coracoes === 1 ? 0.5 : 1.0;

            const fatorPoder = casaAtualEhDificil ? poder : 1.0;

            // quanto mais eficiencia, mais chance de ser usado
            // para casas dificeis, use cavaleiros fortes sem ligar para seus coracoes
            // para casas faceis, use cavaleiros com mais coracoes disponiveis
            const eficiencia = casaAtualEhDificil
                ? poder * fatorUltimoCoracao
                : poderPorCoracao * fatorUltimoCoracao * fatorPoder;

            return {
                nome,
                poder,
                coracoes,
                poderPorCoracao,
                eficiencia
            };
        });

        let maxDuracaoBatalha;
        if (casaAtualEhDificil) {
            maxDuracaoBatalha = Math.min(60, 45 + (dificuldadeCasaAtual - 1) * 15);
        } else if (casaAtualEhFacil) {
            maxDuracaoBatalha = Math.max(20, 30 - (1 - dificuldadeCasaAtual) * 10);
        } else {
            maxDuracaoBatalha = 35;
        }

        const minPoderNecessario = poderBoss / maxDuracaoBatalha;

        if (casaAtualEhDificil) {
            dadosLutador.sort((a, b) => b.poder - a.poder);
        }
        else if (casaAtualEhFacil) {
            dadosLutador.sort((a, b) => {
                if (a.coracoes > b.coracoes) return -1;
                if (a.coracoes < b.coracoes) return 1;
                return a.poder - b.poder;
            });
        }
        else {
            dadosLutador.sort((a, b) => b.eficiencia - a.eficiencia);
        }

        const guerreirosSelecionados = [];
        let poderAtual = 0;
        let coracoesGastos = 0;

        for (const cavaleiro of dadosLutador) {
            if (guerreirosSelecionados.includes(cavaleiro.nome)) continue;

            if (coracoesGastos >= heartBudget && poderAtual >= minPoderNecessario * 0.8) continue;

            const ehUltimoCoracao = cavaleiro.coracoes === 1 && cavaleirosVivos.length > casasRestantes;
            const ehUltimoCavaleiro = cavaleirosVivos.length === 1;

            if (ehUltimoCoracao && !ehUltimoCavaleiro && !casaAtualEhDificil && coracoesGastos > 0) {
                continue;
            }

            guerreirosSelecionados.push(cavaleiro.nome);
            poderAtual += cavaleiro.poder;
            coracoesGastos++;

            if (poderAtual >= minPoderNecessario) {
                if (coracoesGastos >= heartBudget) break;
                if (!casaAtualEhDificil) break;
            }
        }

        if (poderAtual < minPoderNecessario * 0.8 && guerreirosSelecionados.length < cavaleirosVivos.length) {
            const guerreirosRestantes = cavaleirosVivos
                .filter(nome => !guerreirosSelecionados.includes(nome))
                .sort((a, b) => {
                    const aIndex = nomesCavaleiros.indexOf(a);
                    const bIndex = nomesCavaleiros.indexOf(b);
                    const aPoder = aIndex >= 0 && aIndex < poderCavaleiros.length ?
                        poderCavaleiros[aIndex] : 1.0;
                    const bPoder = bIndex >= 0 && bIndex < poderCavaleiros.length ?
                        poderCavaleiros[bIndex] : 1.0;
                    return bPoder - aPoder;
                });

            if (guerreirosRestantes.length > 0 &&
                (coracoesGastos < heartBudget || poderAtual < minPoderNecessario * 0.6)) {
                const nome = guerreirosRestantes[0];
                const index = nomesCavaleiros.indexOf(nome);
                guerreirosSelecionados.push(nome);
                poderAtual += (index >= 0 && index < poderCavaleiros.length ?
                    poderCavaleiros[index] : 1.0);
                coracoesGastos++;
            }
        }

        if (guerreirosSelecionados.length === 0 && cavaleirosVivos.length > 0) {
            cavaleirosVivos.sort((a, b) => {
                const aIndex = nomesCavaleiros.indexOf(a);
                const bIndex = nomesCavaleiros.indexOf(b);
                const aPoder = aIndex >= 0 && aIndex < poderCavaleiros.length ?
                    poderCavaleiros[aIndex] : 1.0;
                const bPoder = bIndex >= 0 && bIndex < poderCavaleiros.length ?
                    poderCavaleiros[bIndex] : 1.0;
                return bPoder - aPoder;
            });
            guerreirosSelecionados.push(cavaleirosVivos[0]);
        }

        tempoBatalhado += Math.round(poderBoss / poderAtual.toFixed(1));

        return guerreirosSelecionados;
    }

    // display caminho passo a passo
    function displayCaminhoPassoPorPasso(caminho, tabela, matriz) {
        const rows = tabela.querySelectorAll('tr');
        const coresOriginais = [];

        // restauracao
        for (const pos of caminho) {
            const celula = rows[pos.row].querySelectorAll('td')[pos.col];
            coresOriginais.push({
                position: pos,
                color: celula.style.backgroundColor
            });
        }

        let passo = 0;
        let tempoPassado = 0;
        const timerDisplay = document.getElementById('timerDisplay');

        // Helper function to get terrain cost
        function getCustoTerreno(celulaType) {
            switch (celulaType) {
                case 14: return 200; // Montanhoso
                case 15: return 1;   // Plano
                case 16: return 5;   // Rochoso
                default: return 1;
            }
        }

        function mostraProximoPasso() {
            if (passo < caminho.length) {
                const pos = caminho[passo];
                const celula = rows[pos.row].querySelectorAll('td')[pos.col];
                const celulaType = matriz[pos.row][pos.col];

                celula.style.backgroundColor = 'red';

                if (celulaType >= 1 && celulaType <= 12) {
                    mostraLutaBoss(celulaType, (duracaoBatalha) => {
                        tempoPassado += duracaoBatalha + 1;
                        timerDisplay.textContent = `Tempo: ${tempoPassado} minutos`;
                        passo++;
                        setTimeout(mostraProximoPasso, 40);
                    });
                } else {
                    if (passo > 0) {
                        const custoPasso = getCustoTerreno(matriz[pos.row][pos.col]);
                        tempoPassado += custoPasso;
                        timerDisplay.textContent = `Tempo total: ${tempoPassado} minutos`;
                    }

                    passo++;
                    setTimeout(mostraProximoPasso, 40);
                }
            } else {
                if (verificaBossesDerrotados(caminho, matriz)) {
                    botaoEncontrarCaminho.textContent = 'Simulação finalizada.';

                    const timerPercurso = document.createElement('div');
                    timerPercurso.id = 'timerPercurso';
                    timerPercurso.style.fontSize = '20px';
                    timerPercurso.style.fontWeight = 'bold';
                    timerPercurso.style.margin = '10px';
                    timerPercurso.style.padding = '10px';
                    timerPercurso.style.border = '2px solid #333';
                    timerPercurso.style.borderRadius = '5px';
                    timerPercurso.style.backgroundColor = '#ADD8E6';
                    timerPercurso.textContent = `Tempo de percurso: ${tempoCaminhado} minutos`;
                    timerPercurso.style.width = 'fit-content';

                    displayTimer.appendChild(timerPercurso);

                    const timerBatalha = document.createElement('div');
                    timerBatalha.id = 'timerBatalha';
                    timerBatalha.style.fontSize = '20px';
                    timerBatalha.style.fontWeight = 'bold';
                    timerBatalha.style.margin = '10px';
                    timerBatalha.style.padding = '10px';
                    timerBatalha.style.border = '2px solid #333';
                    timerBatalha.style.borderRadius = '5px';
                    timerBatalha.style.backgroundColor = '#FF7F7F';
                    timerBatalha.textContent = `Tempo de batalha: ${tempoBatalhado} minutos`;
                    timerBatalha.style.width = 'fit-content';

                    displayTimer.appendChild(timerBatalha);
                }
            }
        }

        function verificaBossesDerrotados(caminho, matriz) {
            const casasDerrotadas = new Set();

            for (const pos of caminho) {
                const celulaType = matriz[pos.row][pos.col];
                if (celulaType >= 1 && celulaType <= 12) {
                    casasDerrotadas.add(celulaType);
                }
            }

            return casasDerrotadas.size === 12;
        }

        // reset timer display e coracoes para novo jogo
        timerDisplay.textContent = 'Tempo: 0 minutos';
        nomesCavaleiros.forEach(nome => {
            vidasCavaleiros
            [nome] = 5;
        });
        atualizaVidaCavaleiros();

        mostraProximoPasso();
    }
});
