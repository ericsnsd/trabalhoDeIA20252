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
            cell.style.width = '10px';
            cell.style.height = '10px';

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
    matrixContainer.appendChild(table);
});
