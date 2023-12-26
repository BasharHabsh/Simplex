function solveLP() {
    const c = document.getElementById('c').value.split(' ').map(Number);
    const A = document.getElementById('A').value.split('\n').map(row => row.split(' ').map(Number));
    const b = document.getElementById('b').value.split(' ').map(Number);

    const n = c.length;
    const m = A.length;

    const tableau = new Array(m + 1);

    for (let i = 0; i < m + 1; i++) {
        tableau[i] = new Array(n + m + 1).fill(0);
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            tableau[i][j] = A[i][j];
        }
        tableau[i][n + i] = 1;
        tableau[i][n + m] = b[i];
    }

    for (let j = 0; j < n; j++) {
        tableau[m][j] = -c[j];
    }

    for (let j = 0; j < n + m; j++) {
        for (let i = 0; i < m; i++) {
            tableau[m][j] -= tableau[i][j];
        }
    }

    let pivotColumn;
    while ((pivotColumn = tableau[m].findIndex(x => x < 0)) >= 0) {
        let pivotRow = -1;
        for (let i = 0; i < m; i++) {
            if (tableau[i][pivotColumn] > 0) {
                if (pivotRow === -1) {
                    pivotRow = i;
                } else {
                    const ratio = tableau[i][n + m] / tableau[i][pivotColumn];
                    const currentRatio = tableau[pivotRow][n + m] / tableau[pivotRow][pivotColumn];
                    if (ratio < currentRatio) {
                        pivotRow = i;
                    }
                }
            }
        }

        if (pivotRow === -1) {
            document.getElementById('result').textContent = 'The problem is unbounded';
            return;
        }

        const pivotValue = tableau[pivotRow][pivotColumn];
        for (let j = 0; j < n + m + 1; j++) {
            tableau[pivotRow][j] /= pivotValue;
        }
        for (let i = 0; i < m + 1; i++) {
            if (i !== pivotRow) {
                const factor = tableau[i][pivotColumn];
                for (let j = 0; j < n + m + 1; j++) {
                    tableau[i][j] -= factor * tableau[pivotRow][j];
                }
            }
        }
    }

    const result = {};
    for (let i = 0; i < m; i++) {
        const varIndex = tableau[i].findIndex((x, j) => x === 1 && j < n);
        result[`x${varIndex + 1}`] = tableau[i][n + m];
    }
    result.z = tableau[m][n + m];

    document.getElementById('result').innerHTML = `
        x1: ${result.x1}<br>
        x2: ${result.x2}<br>
        z: ${result.z}
    `;
}