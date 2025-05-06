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
    tabela.style.width = '975px';
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
            const caminho = findShortestPath(matriz, posicaoComeco, posicaoFim);
            displayPathStepByStep(caminho, tabela, matriz);
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

    // Pathfinding algorithm (A*)
    function findShortestPath(matriz, comeco, fim) {
        const rows = matriz.length;
        const colunas = matriz[0].length;

        // Initialize distances array with Infinity
        const gScore = Array(rows).fill().map(() => Array(colunas).fill(Infinity)); // Cost from comeco to current node
        gScore[comeco.row][comeco.col] = 0;

        // Initialize fScore (gScore + heuristic)
        const fScore = Array(rows).fill().map(() => Array(colunas).fill(Infinity)); // Estimated total cost
        fScore[comeco.row][comeco.col] = heuristic(comeco, fim);

        // Track visited nodes
        const visited = Array(rows).fill().map(() => Array(colunas).fill(false));

        // Track previous nodes to reconstruct path
        const previous = Array(rows).fill().map(() => Array(colunas).fill(null));

        // Priority queue for unvisited nodes
        const queue = [{
            row: comeco.row,
            col: comeco.col,
            fScore: fScore[comeco.row][comeco.col]  // Use fScore for priority
        }];

        // Heuristic function (Manhattan distance)
        function heuristic(a, b) {
            return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
        }

        // Helper function to get terrain cost
        function getTerrainCost(celulaType) {
            switch (celulaType) {
                case 14: return 200; // Montanhoso
                case 15: return 1;   // Plano
                case 16: return 5;   // Rochoso
                default: return 1;   // Default cost for other celulas
            }
        }

        while (queue.length > 0) {
            // Find node with smallest fScore
            queue.sort((a, b) => a.fScore - b.fScore);
            const current = queue.shift();

            // If we reached the fim, we're done
            if (current.row === fim.row && current.col === fim.col) {
                break;
            }

            // If already visited, skip
            if (visited[current.row][current.col]) continue;

            // Mark as visited
            visited[current.row][current.col] = true;

            // Check neighbors (up, right, down, left)
            const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

            for (const [dRow, dCol] of directions) {
                const newRow = current.row + dRow;
                const newCol = current.col + dCol;

                // Check if valid position
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < colunas && !visited[newRow][newCol]) {
                    const terrainCost = getTerrainCost(matriz[newRow][newCol]);
                    const tentativeGScore = gScore[current.row][current.col] + terrainCost;

                    if (tentativeGScore < gScore[newRow][newCol]) {
                        // This path is better, record it
                        previous[newRow][newCol] = { row: current.row, col: current.col };
                        gScore[newRow][newCol] = tentativeGScore;
                        fScore[newRow][newCol] = tentativeGScore + heuristic({ row: newRow, col: newCol }, fim);

                        // Add to queue if not already there
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

        // Reconstruct path
        const path = [];
        let current = { row: fim.row, col: fim.col };

        while (current && (current.row !== comeco.row || current.col !== comeco.col)) {
            path.unshift(current);
            current = previous[current.row][current.col];
        }

        if (path.length > 0) {
            path.unshift(comeco); // Add comeco position
        }

        // Calculate total time
        let totalTime = 0;
        for (const pos of path) {
            if (pos.row !== comeco.row || pos.col !== comeco.col) { // Don't count comeco position
                totalTime += getTerrainCost(matriz[pos.row][pos.col]);
            }
        }
        tempoCaminhado = totalTime;

        return path;
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

    function mostraLutaBoss(houseIndex, resumeCallback) {
        const housenome = nomesCasas[houseIndex - 1];
        const bossPower = dificuldadesCasas[houseIndex - 1] || 50; // Default if undefined

        const selectedFighters = selectBestFighters(houseIndex, bossPower);

        let totalPower = 0;
        selectedFighters.forEach(nome => {
            const index = nomesCavaleiros.indexOf(nome);
            const knightPower = index >= 0 && index < poderCavaleiros.length ?
                poderCavaleiros[index] : 1.0;
            totalPower += knightPower;
        });

        totalPower = totalPower > 0 ? totalPower : 1;

        const battleTime = Math.round(bossPower / totalPower);

        // Show the battle results to the player
        modalLutaBoss.innerHTML = `
            <h2 style="margin-top: 0px; font-size: 18px;">Batalha na Casa de ${housenome}</h2>
            <img src="assets/${housenome}.png" alt="Cavaleiro de ${housenome}" style="width: 150px; height: 285px; object-fit: fill; border: 1px solid #c3c3c3;">
            <p>Poder do Cavaleiro de Ouro: ${bossPower}</p>
            <div style="align-items: center">
                <h3 style="margin-top: 0px; font-size: 18px;">Cavaleiros selecionados:</h3>
                <ul>
                    ${selectedFighters.map(nome => {
            const index = nomesCavaleiros.indexOf(nome);
            const powerValue = index >= 0 && index < poderCavaleiros.length ?
                poderCavaleiros[index] : 1.0;
            return `<li>${nome} (Poder: ${powerValue.toFixed(1)})</li>`;
        }).join('')}
                </ul>
                <p>Poder total: ${totalPower.toFixed(1)}</p>
                <p>Tempo de batalha: ${battleTime} minutos</p>
                <button id="continueBattle" class="buttonMenu" style="width: 100%; padding: 5px 15px;">Continuar</button>
            </div>
        `;

        modalLutaBoss.style.display = 'flex';

        // Reduce hearts for selected fighters
        selectedFighters.forEach(nome => {
            vidasCavaleiros
            [nome]--;
        });

        // Update hearts display
        atualizaVidaCavaleiros();

        // Add event listener to continue button
        document.getElementById('continueBattle').addEventListener('click', () => {
            // Close modal and resume path
            modalLutaBoss.style.display = 'none';

            // Return battle time to the callback
            resumeCallback(battleTime);
        });
    }

    // Algorithm to select the best fighters for a battle
    function selectBestFighters(houseIndex, bossPower) {
        // Get available fighters (those with hearts)
        const availableFighters = nomesCavaleiros.filter(nome => vidasCavaleiros
        [nome] > 0);

        // If no fighters available, we need to report a game over
        if (availableFighters.length === 0) {
            alert('Todos os cavaleiros estão fora de combate! Fim de jogo.');
            botaoEncontrarCaminho.textContent = 'Simulação finalizada.';
            return;
        }

        // Calculate the difficulty of remaining houses
        const remainingHouseIndices = [];
        for (let i = 1; i <= 12; i++) {
            if (i >= houseIndex) {
                remainingHouseIndices.push(i);
            }
        }

        const remainingHousePowers = remainingHouseIndices.map(idx =>
            typeof dificuldadesCasas[idx - 1] === 'number' ? dificuldadesCasas[idx - 1] : 50);

        // Calculate total remaining difficulty and average
        const totalRemainingDifficulty = remainingHousePowers.reduce((sum, power) => sum + power, 0);
        const averageHouseDifficulty = totalRemainingDifficulty / remainingHousePowers.length || 1;

        // Count how many houses are left
        const housesRemaining = remainingHouseIndices.length;

        // Determine if current house is more or less difficult than average
        const currentHouseDifficulty = bossPower / averageHouseDifficulty;
        const isCurrentHouseHard = currentHouseDifficulty > 1.2; // 20% harder than average
        const isCurrentHouseEasy = currentHouseDifficulty < 0.8; // 20% easier than average

        // Calculate total hearts remaining across all knights
        const totalHeartsRemaining = availableFighters.reduce((sum, nome) => sum + vidasCavaleiros
        [nome], 0);

        // Calculate average hearts needed per remaining house
        const avgHeartsPerHouse = totalHeartsRemaining / housesRemaining;

        // Heart budget for this battle - be more conservative when we have fewer hearts
        let heartBudget;
        if (avgHeartsPerHouse >= 2.5) {
            // Plenty of hearts, can use more
            heartBudget = isCurrentHouseHard ? 3 : isCurrentHouseEasy ? 1 : 2;
        } else if (avgHeartsPerHouse >= 1.5) {
            // Moderate hearts, be careful
            heartBudget = isCurrentHouseHard ? 2 : 1;
        } else {
            // Critically low hearts, be extremely conservative
            heartBudget = Math.min(1, Math.ceil(totalHeartsRemaining / (housesRemaining * 1.5)));
        }

        // If it's one of the last 3 houses, we can be less conservative
        if (housesRemaining <= 3) {
            heartBudget = Math.max(heartBudget, Math.min(2, totalHeartsRemaining - 1));
        }

        // Prepare fighter data with power and remaining hearts
        const fighterData = availableFighters.map(nome => {
            const index = nomesCavaleiros.indexOf(nome);
            const power = index >= 0 && index < poderCavaleiros.length ?
                poderCavaleiros[index] : 1.0;
            const hearts = vidasCavaleiros
            [nome];

            // Calculate value metrics for different scenarios
            const powerPerHeart = power / Math.max(1, hearts);

            // If a knight has only 1 heart left, they're more valuable (save for critical battles)
            const lastHeartFactor = hearts === 1 ? 0.5 : 1.0;

            // Strong knights with multiple hearts are most useful for hard houses
            const powerFactor = isCurrentHouseHard ? power : 1.0;

            // Efficiency score - higher means more likely to be used
            // For hard houses: prefer strongest knights regardless of hearts
            // For easier houses: prefer knights with more hearts left
            const efficiency = isCurrentHouseHard
                ? power * lastHeartFactor
                : powerPerHeart * lastHeartFactor * powerFactor;

            return {
                nome,
                power,
                hearts,
                powerPerHeart,
                efficiency
            };
        });

        // Calculate target battle time based on current house difficulty
        let maxBattleTime;
        if (isCurrentHouseHard) {
            // For difficult houses, allow more time
            maxBattleTime = Math.min(60, 45 + (currentHouseDifficulty - 1) * 15);
        } else if (isCurrentHouseEasy) {
            // For easy houses, use less power
            maxBattleTime = Math.max(20, 30 - (1 - currentHouseDifficulty) * 10);
        } else {
            // For average houses, aim for reasonable time
            maxBattleTime = 35;
        }

        // Calculate minimum power needed for target battle time
        const minPowerNeeded = bossPower / maxBattleTime;

        // Sort fighters based on our efficiency metric
        // For hard houses, prioritize strongest knights
        if (isCurrentHouseHard) {
            fighterData.sort((a, b) => b.power - a.power);
        }
        // For easy houses, prioritize knights with many hearts left
        else if (isCurrentHouseEasy) {
            fighterData.sort((a, b) => {
                // First compare hearts (prioritize knights with more hearts)
                if (a.hearts > b.hearts) return -1;
                if (a.hearts < b.hearts) return 1;
                // If hearts are equal, the weaker knight goes first
                return a.power - b.power;
            });
        }
        // For average houses, use our balanced efficiency metric
        else {
            fighterData.sort((a, b) => b.efficiency - a.efficiency);
        }

        // Select fighters without exceeding our heart budget
        const selected = [];
        let currentPower = 0;
        let heartsUsed = 0;

        // First phase: select fighters according to our sorted strategy
        for (const fighter of fighterData) {
            // Skip if already selected
            if (selected.includes(fighter.nome)) continue;

            // Skip if we've used our heart budget (unless we absolutely need more power)
            if (heartsUsed >= heartBudget && currentPower >= minPowerNeeded * 0.8) continue;

            // If this is our last knight or our last heart, only use in critical situations
            const isLastHeart = fighter.hearts === 1 && availableFighters.length > housesRemaining;
            const isLastKnight = availableFighters.length === 1;

            if (isLastHeart && !isLastKnight && !isCurrentHouseHard && heartsUsed > 0) {
                // Save knights with their last heart for harder houses
                continue;
            }

            // Add this fighter
            selected.push(fighter.nome);
            currentPower += fighter.power;
            heartsUsed++;

            // If we have enough power, only continue if we're below heart budget
            if (currentPower >= minPowerNeeded) {
                // If we've hit our heart budget, stop adding fighters
                if (heartsUsed >= heartBudget) break;

                // If this isn't a hard house, stop adding fighters to conserve hearts
                if (!isCurrentHouseHard) break;
            }
        }

        // If we're below minimum power, try adding more fighters but be very careful with hearts
        if (currentPower < minPowerNeeded * 0.8 && selected.length < availableFighters.length) {
            // Sort remaining fighters by power (strongest first)
            const remainingFighters = availableFighters
                .filter(nome => !selected.includes(nome))
                .sort((a, b) => {
                    const aIndex = nomesCavaleiros.indexOf(a);
                    const bIndex = nomesCavaleiros.indexOf(b);
                    const aPower = aIndex >= 0 && aIndex < poderCavaleiros.length ?
                        poderCavaleiros[aIndex] : 1.0;
                    const bPower = bIndex >= 0 && bIndex < poderCavaleiros.length ?
                        poderCavaleiros[bIndex] : 1.0;
                    return bPower - aPower;
                });

            // Add one more fighter if really necessary and we have hearts to spare
            if (remainingFighters.length > 0 &&
                (heartsUsed < heartBudget || currentPower < minPowerNeeded * 0.6)) {
                const nome = remainingFighters[0];
                const index = nomesCavaleiros.indexOf(nome);
                selected.push(nome);
                currentPower += (index >= 0 && index < poderCavaleiros.length ?
                    poderCavaleiros[index] : 1.0);
                heartsUsed++;
            }
        }

        // Make sure we have at least one fighter, even if we exceed our heart budget
        if (selected.length === 0 && availableFighters.length > 0) {
            // In desperate situations, pick the strongest available
            availableFighters.sort((a, b) => {
                const aIndex = nomesCavaleiros.indexOf(a);
                const bIndex = nomesCavaleiros.indexOf(b);
                const aPower = aIndex >= 0 && aIndex < poderCavaleiros.length ?
                    poderCavaleiros[aIndex] : 1.0;
                const bPower = bIndex >= 0 && bIndex < poderCavaleiros.length ?
                    poderCavaleiros[bIndex] : 1.0;
                return bPower - aPower;
            });
            selected.push(availableFighters[0]);
        }

        tempoBatalhado += Math.round(bossPower / currentPower.toFixed(1));

        return selected;
    }

    // Display path step by step
    function displayPathStepByStep(path, tabela, matriz) {
        const rows = tabela.querySelectorAll('tr');
        const originalColors = [];

        // Store original colors for restoration
        for (const pos of path) {
            const celula = rows[pos.row].querySelectorAll('td')[pos.col];
            originalColors.push({
                position: pos,
                color: celula.style.backgroundColor
            });
        }

        let step = 0;
        let elapsedTime = 0;
        const timerDisplay = document.getElementById('timerDisplay');

        // Helper function to get terrain cost
        function getTerrainCost(celulaType) {
            switch (celulaType) {
                case 14: return 200; // Montanhoso
                case 15: return 1;   // Plano
                case 16: return 5;   // Rochoso
                default: return 1;   // Default cost for other celulas
            }
        }

        function showNextStep() {
            if (step < path.length) {
                // Get current position
                const pos = path[step];
                const celula = rows[pos.row].querySelectorAll('td')[pos.col];
                const celulaType = matriz[pos.row][pos.col];

                // Color current position red
                celula.style.backgroundColor = 'red';

                // Check if this is a house (1-12)
                if (celulaType >= 1 && celulaType <= 12) {
                    // Pause the path animation and show boss fight
                    mostraLutaBoss(celulaType, (battleTime) => {
                        // Add battle time to total
                        elapsedTime += battleTime + 1;
                        timerDisplay.textContent = `Tempo: ${elapsedTime} minutos`;

                        // Continue to next step
                        step++;
                        setTimeout(showNextStep, 40);
                    });
                } else {
                    // Add time for this step (except for the comeco position)
                    if (step > 0) {
                        const stepCost = getTerrainCost(matriz[pos.row][pos.col]);
                        elapsedTime += stepCost;
                        timerDisplay.textContent = `Tempo total: ${elapsedTime} minutos`;
                    }

                    // Move to next step
                    step++;
                    setTimeout(showNextStep, 40);
                }
            } else {
                // Check if all boss fights were won
                if (checkAllBossesDefeated(path, matriz)) {
                    // Show completion message with total time
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

        // Function to check if all bosses in the path were defeated
        function checkAllBossesDefeated(path, matriz) {
            const defeatedHouses = new Set();

            // Check each position in the path
            for (const pos of path) {
                const celulaType = matriz[pos.row][pos.col];
                if (celulaType >= 1 && celulaType <= 12) {
                    defeatedHouses.add(celulaType);
                }
            }

            // Check if we have 12 houses defeated
            return defeatedHouses.size === 12;
        }

        // Reset timer display and knight hearts for new game
        timerDisplay.textContent = 'Tempo: 0 minutos';
        nomesCavaleiros.forEach(nome => {
            vidasCavaleiros
            [nome] = 5;
        });
        atualizaVidaCavaleiros();

        // comeco the path animation
        showNextStep();
    }
});
