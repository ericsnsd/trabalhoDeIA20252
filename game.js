document.getElementById('playButton').addEventListener('click', async () => {
    const matrixContainer = document.getElementById('matrixContainer');
    matrixContainer.innerHTML = ''; // Clear previous content

    // Fetch and parse the Mapa.json file
    const response = await fetch('Mapa.json');
    const matrix = await response.json();

    // Define Bronze Knight powers and House difficulties (new)
    const bronzeKnightPowers = [1.5, 1.4, 1.3, 1.2, 1.1]; // Powers for Seiya, Shiryu, Hyoga, Shun, Ikki
    const houseDifficulties = [50, 55, 60, 70, 75, 80, 85, 90, 95, 100, 110, 120]; // Powers for each house

    // Create configuration button
    const configButton = document.createElement('button');
    configButton.textContent = 'Configurar Poderes';
    configButton.style.margin = '10px';
    configButton.style.padding = '8px 15px';
    configButton.style.backgroundColor = '#4CAF50';
    configButton.style.color = 'white';
    configButton.style.border = 'none';
    configButton.style.borderRadius = '4px';
    configButton.style.cursor = 'pointer';
    
    // Create configuration modal
    const configModal = document.createElement('div');
    configModal.id = 'configModal';
    configModal.style.display = 'none';
    configModal.style.position = 'fixed';
    configModal.style.top = '50%';
    configModal.style.left = '50%';
    configModal.style.transform = 'translate(-50%, -50%)';
    configModal.style.backgroundColor = 'white';
    configModal.style.padding = '20px';
    configModal.style.border = '1px solid black';
    configModal.style.zIndex = '1000';
    configModal.style.width = '500px';
    configModal.style.maxHeight = '80vh';
    configModal.style.overflowY = 'auto';
    configModal.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    document.body.appendChild(configModal);
    
    // Add event listener to config button
    configButton.addEventListener('click', () => {
        // Generate config modal content
        let modalContent = `
            <h2 style="text-align: center; margin-bottom: 20px;">Configurar Poderes</h2>
            <div style="margin-bottom: 20px;">
                <h3>Cavaleiros de Bronze</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        `;
        
        // Add inputs for knight powers
        const knightNames = ['Seiya', 'Shiryu', 'Hyoga', 'Shun', 'Ikki'];
        knightNames.forEach((name, index) => {
            modalContent += `
                <div style="margin-bottom: 10px;">
                    <label for="knight-${name}">${name}:</label>
                    <input type="number" id="knight-${name}" value="${bronzeKnightPowers[index]}" 
                           min="1" max="500" style="width: 70px; margin-left: 10px;">
                </div>
            `;
        });
        
        // Add inputs for house difficulties
        modalContent += `
                </div>
            </div>
            <div>
                <h3>Casas do Zodíaco</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        `;
        
        const houseNames = [
            'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
            'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
        ];
        
        houseNames.forEach((name, index) => {
            modalContent += `
                <div style="margin-bottom: 10px;">
                    <label for="house-${index+1}">${name}:</label>
                    <input type="number" id="house-${index+1}" value="${houseDifficulties[index]}" 
                           min="500" max="10000" style="width: 70px; margin-left: 10px;">
                </div>
            `;
        });
        
        // Add save and cancel buttons
        modalContent += `
                </div>
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <button id="saveConfig" style="padding: 8px 15px; margin-right: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Salvar</button>
                <button id="cancelConfig" style="padding: 8px 15px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancelar</button>
            </div>
        `;
        
        // Set modal content and display it
        configModal.innerHTML = modalContent;
        configModal.style.display = 'block';
        
        // Add event listeners for save and cancel buttons
        document.getElementById('saveConfig').addEventListener('click', () => {
            // Update knight powers
            for (let i = 0; i < knightNames.length; i++) {
                const input = document.querySelector(`input#knight-${knightNames[i]}`); // Ensure it targets the input element
                const value = parseFloat(input?.value); // Use optional chaining to avoid errors if input is not found
                if (!isNaN(value)) {
                    bronzeKnightPowers[i] = value; // Assign only if valid
                }
            }

            // Log updated knight powers for debugging
            console.log('Updated Bronze Knight Powers:', bronzeKnightPowers);

            // Update house difficulties
            for (let i = 0; i < 12; i++) {
                const input = document.querySelector(`input#house-${i+1}`); // Ensure it targets the input element
                const value = parseFloat(input?.value); // Use optional chaining to avoid errors if input is not found
                if (!isNaN(value)) {
                    houseDifficulties[i] = value; // Assign only if valid
                }
            }

            // Log updated house difficulties for debugging
            console.log('Updated House Difficulties:', houseDifficulties);

            // Close modal
            configModal.style.display = 'none';
        });
        
        document.getElementById('cancelConfig').addEventListener('click', () => {
            configModal.style.display = 'none';
        });
    });
    
    // Add config button to container
    matrixContainer.appendChild(configButton);

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
        const bossPower = houseDifficulties[houseIndex - 1] || 50; // Default if undefined
        
        // Automatically select the best fighters
        const selectedFighters = selectBestFighters(houseIndex, bossPower);
        
        // Calculate total power of selected fighters
        let totalPower = 0;
        selectedFighters.forEach(name => {
            const index = knightNames.indexOf(name);
            const knightPower = index >= 0 && index < bronzeKnightPowers.length ? 
                bronzeKnightPowers[index] : 1.0; // Use updated powers
            totalPower += knightPower;
        });
        
        // Ensure totalPower is not zero to avoid division by zero
        totalPower = totalPower > 0 ? totalPower : 1;
        
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
                        const powerValue = index >= 0 && index < bronzeKnightPowers.length ? 
                            bronzeKnightPowers[index] : 1.0;
                        return `<li>${name} (Poder: ${powerValue.toFixed(1)})</li>`;
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
        // Get available fighters (those with hearts)
        const availableFighters = knightNames.filter(name => knightHearts[name] > 0);
        
        // If no fighters available, we need to report a game over
        if (availableFighters.length === 0) {
            alert('Todos os cavaleiros estão fora de combate! Fim de jogo.');
            return [];
        }
        
        // Calculate the difficulty of remaining houses
        const remainingHouseIndices = [];
        for (let i = 1; i <= 12; i++) {
            if (i >= houseIndex) {
                remainingHouseIndices.push(i);
            }
        }
        
        const remainingHousePowers = remainingHouseIndices.map(idx => 
            typeof houseDifficulties[idx-1] === 'number' ? houseDifficulties[idx-1] : 50);
        
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
        const totalHeartsRemaining = availableFighters.reduce((sum, name) => sum + knightHearts[name], 0);
        
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
        const fighterData = availableFighters.map(name => {
            const index = knightNames.indexOf(name);
            const power = index >= 0 && index < bronzeKnightPowers.length ? 
                bronzeKnightPowers[index] : 1.0;
            const hearts = knightHearts[name];
            
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
                name,
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
            if (selected.includes(fighter.name)) continue;
            
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
            selected.push(fighter.name);
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
                .filter(name => !selected.includes(name))
                .sort((a, b) => {
                    const aIndex = knightNames.indexOf(a);
                    const bIndex = knightNames.indexOf(b);
                    const aPower = aIndex >= 0 && aIndex < bronzeKnightPowers.length ? 
                        bronzeKnightPowers[aIndex] : 1.0;
                    const bPower = bIndex >= 0 && bIndex < bronzeKnightPowers.length ? 
                        bronzeKnightPowers[bIndex] : 1.0;
                    return bPower - aPower;
                });
            
            // Add one more fighter if really necessary and we have hearts to spare
            if (remainingFighters.length > 0 && 
                (heartsUsed < heartBudget || currentPower < minPowerNeeded * 0.6)) {
                const name = remainingFighters[0];
                const index = knightNames.indexOf(name);
                selected.push(name);
                currentPower += (index >= 0 && index < bronzeKnightPowers.length ? 
                    bronzeKnightPowers[index] : 1.0);
                heartsUsed++;
            }
        }
        
        // Make sure we have at least one fighter, even if we exceed our heart budget
        if (selected.length === 0 && availableFighters.length > 0) {
            // In desperate situations, pick the strongest available
            availableFighters.sort((a, b) => {
                const aIndex = knightNames.indexOf(a);
                const bIndex = knightNames.indexOf(b);
                const aPower = aIndex >= 0 && aIndex < bronzeKnightPowers.length ? 
                    bronzeKnightPowers[aIndex] : 1.0;
                const bPower = bIndex >= 0 && bIndex < bronzeKnightPowers.length ? 
                    bronzeKnightPowers[bIndex] : 1.0;
                return bPower - aPower;
            });
            selected.push(availableFighters[0]);
        }
        
        // For debugging
        console.log(`House ${houseIndex} (Power: ${bossPower}): Difficulty rating: ${currentHouseDifficulty.toFixed(2)}, ${isCurrentHouseHard ? 'Hard' : isCurrentHouseEasy ? 'Easy' : 'Average'}`);
        console.log(`Total hearts: ${totalHeartsRemaining}, Houses left: ${housesRemaining}, Heart budget: ${heartBudget}, Hearts used: ${heartsUsed}`);
        console.log(`Selected ${selected.length} fighters, total power: ${currentPower.toFixed(1)}, target time: ${maxBattleTime} min`);
        
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
                        setTimeout(showNextStep, 40);
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
                    setTimeout(showNextStep, 40);
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
