document.getElementById('playButton').addEventListener('click', async () => {
    const matrixContainer = document.getElementById('matrixContainer');
    matrixContainer.innerHTML = ''; // Clear previous content

    // Fetch and parse the Mapa.json file
    const response = await fetch('Mapa.json');
    const matrix = await response.json();

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

            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Create knight containers
    const knightNames = ['seiya', 'shiryu', 'hyoga', 'shun', 'ikki'];
    const knightsContainer = document.createElement('div');
    knightsContainer.style.display = 'flex';
    knightsContainer.style.justifyContent = 'space-around';
    knightsContainer.style.marginTop = '20px';

    knightNames.forEach(name => {
        const knightDiv = document.createElement('div');
        knightDiv.style.textAlign = 'center';
        knightDiv.style.margin = '0 10px';
        
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
        
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('span');
            heart.textContent = '❤️';
            heart.style.margin = '0 2px';
            heartsDiv.appendChild(heart);
        }
        
        knightDiv.appendChild(heartsDiv);
        knightsContainer.appendChild(knightDiv);
    });

    matrixContainer.appendChild(knightsContainer);
    matrixContainer.appendChild(table);

    table.style.margin = '0 auto';
    table.style.marginTop = '20px';
    table.style.borderCollapse = 'collapse';

    matrixContainer.style.display = 'flex';
    matrixContainer.style.flexDirection = 'column';
    matrixContainer.style.alignItems = 'center';
    matrixContainer.style.justifyContent = 'center';
    matrixContainer.style.maxWidth = '100%';
    matrixContainer.style.overflowX = 'auto';
});

// Add a configuration button
const configButton = document.createElement('button');
configButton.textContent = 'Configurações';
configButton.addEventListener('click', () => {
    const configModal = document.getElementById('configModal');
    configModal.style.display = 'block';
});
document.body.appendChild(configButton);

// Create a modal for configuration
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

// Variables to store configuration options
let houseDifficulties = [50, 55, 60, 70, 75, 80, 85, 90, 95, 100, 110, 120];
let bronzeKnightPowers = [1.5, 1.4, 1.3, 1.2, 1.1];

// Add content for editing difficulty levels and cosmic power
configModal.innerHTML = `
    <h3>Configurações do jogo</h3>
    <h4>Níveis de Dificuldade das Casas</h4>
    <table id="difficultyTable">
        <tr><th>Casa</th><th>Dificuldade</th></tr>
        ${houseDifficulties.map((difficulty, index) => `
            <tr>
                <td>Casa de ${['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'][index]}</td>
                <td><input type="number" value="${difficulty}"></td>
            </tr>
        `).join('')}
    </table>
    <h4>Poder Cósmico dos Cavaleiros de Bronze</h4>
    <table id="cosmicPowerTable">
        <tr><th>Cavaleiro</th><th>Poder Cósmico</th></tr>
        ${['Seiya', 'Shiryu', 'Hyoga', 'Shun', 'Ikki'].map((knight, index) => `
            <tr>
                <td>${knight}</td>
                <td><input type="number" step="0.1" value="${bronzeKnightPowers[index]}"></td>
            </tr>
        `).join('')}
    </table>
    <button id="saveConfig">Salvar</button>
    <button id="closeConfig">Fechar</button>
`;

// Add event listeners for saving and closing the modal
configModal.querySelector('#saveConfig').addEventListener('click', () => {
    const difficultyInputs = document.querySelectorAll('#difficultyTable input');
    const cosmicPowerInputs = document.querySelectorAll('#cosmicPowerTable input');

    houseDifficulties = Array.from(difficultyInputs).map(input => parseInt(input.value));
    bronzeKnightPowers = Array.from(cosmicPowerInputs).map(input => parseFloat(input.value));

    console.log('Dificuldades atualizadas:', houseDifficulties);
    console.log('Poderes Cósmicos atualizados:', bronzeKnightPowers);

    configModal.style.display = 'none';
});

configModal.querySelector('#closeConfig').addEventListener('click', () => {
    configModal.style.display = 'none';
});

document.body.appendChild(configModal);
