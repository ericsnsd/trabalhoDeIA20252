document.getElementById('playButton').addEventListener('click', async () => {
    const matrixContainer = document.getElementById('matrixContainer');
    matrixContainer.innerHTML = ''; // Clear previous content

    // Fetch and parse the Mapa.json file
    const response = await fetch('Mapa.json');
    const matrix = await response.json();

    // Define Bronze Knight powers and House difficulties (new)
    const bronzeKnightPowers = [100, 95, 90, 85, 110]; // Powers for Seiya, Shiryu, Hyoga, Shun, Ikki
    const houseDifficulties = [1000, 1200, 1500, 1800, 2000, 2200, 2500, 2800, 3000, 3300, 3500, 4000]; // Powers for each house

    const table = document.createElement('table');
    for (let i = 0; i < 42; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 42; j++) {
            const cell = document.createElement('td');
            cell.style.border = '1px solid black';
            cell.style.width = '15px';
            cell.style.height = '15px';

            // Assign colors based on the value in the matrix
            switch (matrix[i][j]) {
                case 0: cell.style.backgroundColor = 'yellow'; break; // Partida
                case 1: cell.style.backgroundColor = 'red'; break; // Casa de Áries
                case 2: cell.style.backgroundColor = 'orange'; break; // Casa de Touro
                case 3: cell.style.backgroundColor = 'purple'; break; // Casa de Gêmeos
                case 4: cell.style.backgroundColor = 'pink'; break; // Casa de Câncer
                case 5: cell.style.backgroundColor = 'gold'; break; // Casa de Leão
                case 6: cell.style.backgroundColor = 'lightgreen'; break; // Casa de Virgem
                case 7: cell.style.backgroundColor = 'cyan'; break; // Casa de Libra
                case 8: cell.style.backgroundColor = 'darkred'; break; // Casa de Escorpião
                case 9: cell.style.backgroundColor = 'blue'; break; // Casa de Sagitário
                case 10: cell.style.backgroundColor = 'brown'; break; // Casa de Capricórnio
                case 11: cell.style.backgroundColor = 'lightblue'; break; // Casa de Aquário
                case 12: cell.style.backgroundColor = 'violet'; break; // Casa de Peixes
                case 13: cell.style.backgroundColor = 'white'; break; // Chegada
                case 14: cell.style.backgroundColor = 'darkgreen'; break; // Montanhoso
                case 15: cell.style.backgroundColor = 'lightgray'; break; // Plano
                case 16: cell.style.backgroundColor = 'gray'; break; // Rochoso
                default: cell.style.backgroundColor = 'black'; break; // Unknown
            }

            // Store the cell's type in a data attribute for pathfinding
            cell.dataset.type = matrix[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;

            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Add the table to the container (new)
    matrixContainer.appendChild(table);

    // Find start and end positions
    let startPosition = null;
    let endPosition = null;
    
    for (let i = 0; i < 42; i++) {
        for (let j = 0; j < 42; j++) {
            if (matrix[i][j] === 0) { // Yellow/start cell
                startPosition = { row: i, col: j };
            } else if (matrix[i][j] === 13) { // White/end cell
                endPosition = { row: i, col: j };
            }
        }
    }
    
    // Create pathfinding button
    const pathfindButton = document.createElement('button');
    pathfindButton.textContent = 'Encontrar Caminho';
    pathfindButton.style.margin = '10px';
    pathfindButton.addEventListener('click', () => {
        if (startPosition && endPosition) {
            const path = findShortestPath(matrix, startPosition, endPosition);
            displayPathStepByStep(path, table, matrix);
        } else {
            alert('Não foi possível encontrar os pontos de partida e chegada no mapa.');
        }
    });
    
    // Append the pathfinding button to the container
    matrixContainer.appendChild(pathfindButton);

    // Create timer display
    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timerDisplay';
    timerDisplay.style.fontSize = '24px';
    timerDisplay.style.fontWeight = 'bold';
    timerDisplay.style.margin = '10px';
    timerDisplay.style.padding = '10px';
    timerDisplay.style.border = '2px solid #333';
    timerDisplay.style.borderRadius = '5px';
    timerDisplay.style.backgroundColor = '#f0f0f0';
    timerDisplay.textContent = 'Tempo: 0 minutos';
    matrixContainer.appendChild(timerDisplay);

    // Pathfinding algorithm (Dijkstra's)
    function findShortestPath(matrix, start, end) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        
        // Initialize distances array with Infinity
        const distances = Array(rows).fill().map(() => Array(cols).fill(Infinity));
        distances[start.row][start.col] = 0;
        
        // Track visited nodes
        const visited = Array(rows).fill().map(() => Array(cols).fill(false));
        
        // Track previous nodes to reconstruct path
        const previous = Array(rows).fill().map(() => Array(cols).fill(null));
        
        // Priority queue for unvisited nodes
        const queue = [{
            row: start.row,
            col: start.col,
            distance: 0
        }];
        
        // Helper function to get terrain cost
        function getTerrainCost(cellType) {
            switch (cellType) {
                case 14: return 200; // Montanhoso
                case 15: return 1;   // Plano
                case 16: return 5;   // Rochoso
                default: return 1;   // Default cost for other cells
            }
        }
        
        while (queue.length > 0) {
            // Find node with smallest distance
            queue.sort((a, b) => a.distance - b.distance);
            const current = queue.shift();
            
            // If we reached the end, we're done
            if (current.row === end.row && current.col === end.col) {
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
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !visited[newRow][newCol]) {
                    const terrainCost = getTerrainCost(matrix[newRow][newCol]);
                    const newDistance = distances[current.row][current.col] + terrainCost;
                    
                    if (newDistance < distances[newRow][newCol]) {
                        distances[newRow][newCol] = newDistance;
                        previous[newRow][newCol] = { row: current.row, col: current.col };
                        
                        queue.push({
                            row: newRow,
                            col: newCol,
                            distance: newDistance
                        });
                    }
                }
            }
        }
        
        // Reconstruct path
        const path = [];
        let current = { row: end.row, col: end.col };
        
        while (current && (current.row !== start.row || current.col !== start.col)) {
            path.unshift(current);
            current = previous[current.row][current.col];
        }
        
        if (path.length > 0) {
            path.unshift(start); // Add start position
        }
        
        // Calculate total time
        let totalTime = 0;
        for (const pos of path) {
            if (pos.row !== start.row || pos.col !== start.col) { // Don't count start position
                totalTime += getTerrainCost(matrix[pos.row][pos.col]);
            }
        }
        
        console.log(`Caminho encontrado com ${path.length} passos e ${totalTime} minutos.`);
        return path;
    }
    
    // Create knight containers
    const knightNames = ['Seiya', 'Shiryu', 'Hyoga', 'Shun', 'Ikki'];
    const knightsContainer = document.createElement('div');
    knightsContainer.style.display = 'flex';
    knightsContainer.style.justifyContent = 'space-around';
    knightsContainer.style.marginTop = '20px';
    
    // Track knight hearts (health)
    const knightHearts = {
        'Seiya': 5,
        'Shiryu': 5,
        'Hyoga': 5,
        'Shun': 5,
        'Ikki': 5
    };

    knightNames.forEach(name => {
        const knightDiv = document.createElement('div');
        knightDiv.style.textAlign = 'center';
        knightDiv.style.margin = '0 10px';
        knightDiv.id = `knight-${name}`;
        
        // Add name
        const nameElem = document.createElement('h3');
        nameElem.textContent = name;
        knightDiv.appendChild(nameElem);
        
        // Add placeholder image
        const img = document.createElement('img');
        img.src = `${name}.png`;  // Replace with actual image path when available
        img.alt = `${name} knight`;
        img.style.width = '80px';
        img.style.height = '80px';
        img.style.border = '1px solid #333';
        knightDiv.appendChild(img);
        
        // Add 5 hearts
        const heartsDiv = document.createElement('div');
        heartsDiv.style.marginTop = '5px';
        heartsDiv.id = `hearts-${name}`;
        
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('span');
            heart.textContent = '❤️';
            heart.style.margin = '0 2px';
            heartsDiv.appendChild(heart);
        }
        
        knightDiv.appendChild(heartsDiv);
        knightsContainer.appendChild(knightDiv);
    });

    // Append knights container to the page (new)
    matrixContainer.appendChild(knightsContainer);

    // Function to update knight hearts display
    function updateKnightHearts() {
        knightNames.forEach(name => {
            const heartsDiv = document.getElementById(`hearts-${name}`);
            heartsDiv.innerHTML = '';
            
            for (let i = 0; i < knightHearts[name]; i++) {
                const heart = document.createElement('span');
                heart.textContent = '❤️';
                heart.style.margin = '0 2px';
                heartsDiv.appendChild(heart);
            }
        });
    }

    // Create boss fight modal
    const bossFightModal = document.createElement('div');
    bossFightModal.id = 'bossFightModal';
    bossFightModal.style.display = 'none';
    bossFightModal.style.position = 'fixed';
    bossFightModal.style.top = '50%';
    bossFightModal.style.left = '50%';
    bossFightModal.style.transform = 'translate(-50%, -50%)';
    bossFightModal.style.backgroundColor = 'white';
    bossFightModal.style.padding = '20px';
    bossFightModal.style.border = '1px solid black';
    bossFightModal.style.zIndex = '1001'; // Higher than config modal
    bossFightModal.style.minWidth = '400px';
    bossFightModal.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    document.body.appendChild(bossFightModal);

    // House name lookup
    const houseNames = {
        1: 'Áries', 2: 'Touro', 3: 'Gêmeos', 4: 'Câncer', 
        5: 'Leão', 6: 'Virgem', 7: 'Libra', 8: 'Escorpião', 
        9: 'Sagitário', 10: 'Capricórnio', 11: 'Aquário', 12: 'Peixes'
    };

    // Function to show boss fight
    function showBossFight(houseIndex, resumeCallback) {
        const houseName = houseNames[houseIndex];
        const bossPower = houseDifficulties[houseIndex - 1]; // -1 because houseIndex starts at 1
        
        // Automatically select the best fighters
        const selectedFighters = selectBestFighters(houseIndex, bossPower);
        
        // Calculate total power of selected fighters
        let totalPower = 0;
        selectedFighters.forEach(name => {
            const index = knightNames.indexOf(name);
            totalPower += bronzeKnightPowers[index];
        });
        
        // Calculate battle time
        const battleTime = Math.round(bossPower / totalPower);
        
        // Show the battle results to the player
        bossFightModal.innerHTML = `
            <h2>Batalha na Casa de ${houseName}</h2>
            <p>Poder do Guardião: ${bossPower}</p>
            <div>
                <h3>Cavaleiros selecionados automaticamente:</h3>
                <ul>
                    ${selectedFighters.map(name => {
                        const index = knightNames.indexOf(name);
                        return `<li>${name} (Poder: ${bronzeKnightPowers[index]})</li>`;
                    }).join('')}
                </ul>
                <p>Poder total: ${totalPower.toFixed(1)}</p>
                <p>Tempo de batalha: ${battleTime} minutos</p>
                <button id="continueBattle" style="margin-top: 15px; padding: 5px 15px;">Continuar</button>
            </div>
        `;
        
        bossFightModal.style.display = 'block';
        
        // Reduce hearts for selected fighters
        selectedFighters.forEach(name => {
            knightHearts[name]--;
        });
        
        // Update hearts display
        updateKnightHearts();
        
        // Add event listener to continue button
        document.getElementById('continueBattle').addEventListener('click', () => {
            // Close modal and resume path
            bossFightModal.style.display = 'none';
            
            // Return battle time to the callback
            resumeCallback(battleTime);
        });
    }
    
    // Algorithm to select the best fighters for a battle
    function selectBestFighters(houseIndex, bossPower) {
        // Calculate how many houses are left (including this one)
        const remainingHouses = 12 - houseIndex + 1;
        
        // Get available fighters (those with hearts)
        const availableFighters = knightNames.filter(name => knightHearts[name] > 0);
        
        // If no fighters available, we need to report a game over
        if (availableFighters.length === 0) {
            alert('Todos os cavaleiros estão fora de combate! Fim de jogo.');
            return [];
        }
        
        // Strategy:
        // 1. For early houses, use fewer fighters
        // 2. For later houses, use more fighters as they're more difficult
        // 3. Always ensure battle time is reasonable (under 60 minutes if possible)
        
        // Sort fighters by power efficiency (power/remaining hearts ratio)
        const sortedFighters = [...availableFighters].sort((a, b) => {
            const aIndex = knightNames.indexOf(a);
            const bIndex = knightNames.indexOf(b);
            const aPowerPerHeart = bronzeKnightPowers[aIndex] / knightHearts[a];
            const bPowerPerHeart = bronzeKnightPowers[bIndex] / knightHearts[b];
            return bPowerPerHeart - aPowerPerHeart; // Higher power per heart first
        });
        
        // Determine target battle time based on house difficulty
        // Earlier houses can take longer, later houses should be faster
        const targetBattleTime = Math.max(30, 60 - (houseIndex * 2));
        
        // Calculate minimum power needed for target time
        const minPowerNeeded = bossPower / targetBattleTime;
        
        // Select fighters until we meet minimum power or run out of fighters
        const selected = [];
        let currentPower = 0;
        
        // First try to use higher powered fighters if the house is difficult
        if (houseIndex > 6) { // For later, more difficult houses
            // Take the top fighters up to half of available fighters
            const topFightersCount = Math.max(1, Math.floor(availableFighters.length / 2));
            for (let i = 0; i < topFightersCount && i < sortedFighters.length; i++) {
                const name = sortedFighters[i];
                const index = knightNames.indexOf(name);
                selected.push(name);
                currentPower += bronzeKnightPowers[index];
                
                // If we have enough power, stop adding fighters
                if (currentPower >= minPowerNeeded) break;
            }
        } else {
            // For earlier houses, be more conservative with fighter selection
            // Start with the most efficient fighter
            if (sortedFighters.length > 0) {
                const name = sortedFighters[0];
                const index = knightNames.indexOf(name);
                selected.push(name);
                currentPower += bronzeKnightPowers[index];
            }
        }
        
        // If we still need more power and have available fighters, add more
        for (let i = 0; i < sortedFighters.length && currentPower < minPowerNeeded; i++) {
            const name = sortedFighters[i];
            if (!selected.includes(name)) {
                const index = knightNames.indexOf(name);
                selected.push(name);
                currentPower += bronzeKnightPowers[index];
            }
        }
        
        // Make sure we have at least one fighter
        if (selected.length === 0 && availableFighters.length > 0) {
            selected.push(availableFighters[0]);
        }
        
        return selected;
    }

    // Display path step by step
    function displayPathStepByStep(path, table, matrix) {
        if (!path || path.length === 0) {
            alert('Não foi possível encontrar um caminho!');
            return;
        }
        
        const rows = table.querySelectorAll('tr');
        const originalColors = [];
        
        // Store original colors for restoration
        for (const pos of path) {
            const cell = rows[pos.row].querySelectorAll('td')[pos.col];
            originalColors.push({
                position: pos,
                color: cell.style.backgroundColor
            });
        }
        
        let step = 0;
        let elapsedTime = 0;
        const timerDisplay = document.getElementById('timerDisplay');
        
        // Helper function to get terrain cost
        function getTerrainCost(cellType) {
            switch (cellType) {
                case 14: return 200; // Montanhoso
                case 15: return 1;   // Plano
                case 16: return 5;   // Rochoso
                default: return 1;   // Default cost for other cells
            }
        }
        
        function showNextStep() {
            if (step < path.length) {
                // Get current position
                const pos = path[step];
                const cell = rows[pos.row].querySelectorAll('td')[pos.col];
                const cellType = matrix[pos.row][pos.col];
                
                // Color current position red
                cell.style.backgroundColor = 'red';
                
                // Check if this is a house (1-12)
                if (cellType >= 1 && cellType <= 12) {
                    // Pause the path animation and show boss fight
                    showBossFight(cellType, (battleTime) => {
                        // Add battle time to total
                        elapsedTime += battleTime;
                        timerDisplay.textContent = `Tempo: ${elapsedTime} minutos`;
                        
                        // Continue to next step
                        step++;
                        setTimeout(showNextStep, 150);
                    });
                } else {
                    // Add time for this step (except for the start position)
                    if (step > 0) {
                        const stepCost = getTerrainCost(matrix[pos.row][pos.col]);
                        elapsedTime += stepCost;
                        timerDisplay.textContent = `Tempo: ${elapsedTime} minutos`;
                    }
                    
                    // Move to next step
                    step++;
                    setTimeout(showNextStep, 150);
                }
            } else {
                // Check if all boss fights were won
                if (checkAllBossesDefeated(path, matrix)) {
                    // Show completion message with total time
                    alert(`Caminho concluído em ${elapsedTime} minutos!`);
                } else {
                    alert('Nem todas as Casas do Zodíaco foram derrotadas! Missão incompleta.');
                }
            }
        }
        
        // Function to check if all bosses in the path were defeated
        function checkAllBossesDefeated(path, matrix) {
            const defeatedHouses = new Set();
            
            // Check each position in the path
            for (const pos of path) {
                const cellType = matrix[pos.row][pos.col];
                if (cellType >= 1 && cellType <= 12) {
                    defeatedHouses.add(cellType);
                }
            }
            
            // Check if we have 12 houses defeated
            return defeatedHouses.size === 12;
        }
        
        // Reset timer display and knight hearts for new game
        timerDisplay.textContent = 'Tempo: 0 minutos';
        knightNames.forEach(name => {
            knightHearts[name] = 5;
        });
        updateKnightHearts();
        
        // Start the path animation
        showNextStep();
    }
});
