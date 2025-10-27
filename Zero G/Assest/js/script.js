// Load cell data simulation
const loadCellData = {};

// Initialize load cell data
for (let i = 1; i <= 30; i++) {
    loadCellData[i] = {
        currentValue: (Math.random() * 100).toFixed(2),
        peakValue: (Math.random() * 150).toFixed(2),
        status: Math.random() > 0.2 ? 'Active' : 'Inactive'
    };
}

// Update load cell values periodically
setInterval(() => {
    for (let i = 1; i <= 30; i++) {
        if (loadCellData[i].status === 'Active') {
            // Simulate small fluctuations in values
            const currentChange = (Math.random() - 0.5) * 5;
            loadCellData[i].currentValue = Math.max(0, 
                parseFloat(loadCellData[i].currentValue) + currentChange
            ).toFixed(2);
            
            // Update peak if current exceeds it
            if (parseFloat(loadCellData[i].currentValue) > parseFloat(loadCellData[i].peakValue)) {
                loadCellData[i].peakValue = loadCellData[i].currentValue;
            }
        }
    }
}, 2000);

// Modal functionality
function showValues(cellNumber) {
    const modal = document.getElementById('valuesModal');
    const modalTitle = document.getElementById('modalTitle');
    const currentValue = document.getElementById('currentValue');
    const peakValue = document.getElementById('peakValue');
    const status = document.getElementById('status');
    
    const data = loadCellData[cellNumber];
    
    modalTitle.textContent = `Load Cell ${cellNumber} Values`;
    currentValue.textContent = `${data.currentValue} kg`;
    peakValue.textContent = `${data.peakValue} kg`;
    status.textContent = data.status;
    status.className = data.status === 'Active' ? 'status-active' : 'status-inactive';
    
    modal.style.display = 'block';
    
    // Store current cell for modal actions
    modal.dataset.cellNumber = cellNumber;
}

function closeModal() {
    const modal = document.getElementById('valuesModal');
    modal.style.display = 'none';
}

function calibrateCell() {
    const modal = document.getElementById('valuesModal');
    const cellNumber = parseInt(modal.dataset.cellNumber);
    
    // Simulate calibration
    loadCellData[cellNumber].currentValue = '0.00';
    loadCellData[cellNumber].peakValue = '0.00';
    loadCellData[cellNumber].status = 'Active';
    
    // Update modal display
    showValues(cellNumber);
    
    // Show confirmation
    setTimeout(() => {
        alert(`Load Cell ${cellNumber} calibrated successfully!`);
    }, 100);
}

function resetCell() {
    const modal = document.getElementById('valuesModal');
    const cellNumber = parseInt(modal.dataset.cellNumber);
    
    // Reset peak value only
    loadCellData[cellNumber].peakValue = loadCellData[cellNumber].currentValue;
    
    // Update modal display
    showValues(cellNumber);
    
    // Show confirmation
    setTimeout(() => {
        alert(`Load Cell ${cellNumber} peak value reset!`);
    }, 100);
}



// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('valuesModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

window.addEventListener("load", () => {
    const splash = document.getElementById("splash-screen");
    setTimeout(() => {
        splash.classList.add("hide");
        setTimeout(() => splash.remove(), 1000); // Remove from DOM after fade
    }, 1750); // Show splash for 1.5 seconds
});

// Position 30 load cells in perfect circle
        const container = document.getElementById('labelsContainer');
        const arrowsSvg = document.getElementById('arrowsSvg');
        const totalCells = 30;
        const outerRadius = 330; // Distance for load cells
        const innerRadius = 240; // Distance to antenna edge
        const centerX = 350;
        const centerY = 350;
        const cellSize = 58;

        for (let i = 0; i < totalCells; i++) {
            // Calculate angle - start from top and go clockwise
            const angle = (i / totalCells) * 2 * Math.PI - Math.PI / 2;
            
            // Outer position (load cell)
            const outerX = centerX + outerRadius * Math.cos(angle);
            const outerY = centerY + outerRadius * Math.sin(angle);
            
            // Inner position (antenna edge)
            const innerX = centerX + innerRadius * Math.cos(angle);
            const innerY = centerY + innerRadius * Math.sin(angle);
            
            // Create arrow line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', outerX);
            line.setAttribute('y1', outerY);
            line.setAttribute('x2', innerX);
            line.setAttribute('y2', innerY);
            line.setAttribute('class', 'arrow-line');
            line.setAttribute('data-cell-id', i + 1);
            arrowsSvg.appendChild(line);
            
            // Create arrow head (triangle)
            const arrowHead = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            const arrowSize = 6;
            const headAngle = Math.atan2(innerY - outerY, innerX - outerX);
            
            const tip = { x: innerX, y: innerY };
            const left = {
                x: innerX - arrowSize * Math.cos(headAngle - Math.PI / 6),
                y: innerY - arrowSize * Math.sin(headAngle - Math.PI / 6)
            };
            const right = {
                x: innerX - arrowSize * Math.cos(headAngle + Math.PI / 6),
                y: innerY - arrowSize * Math.sin(headAngle + Math.PI / 6)
            };
            
            arrowHead.setAttribute('points', `${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`);
            arrowHead.setAttribute('class', 'arrow-head');
            arrowsSvg.appendChild(arrowHead);
            
            // Create load cell
            const posX = outerX - cellSize / 2;
            const posY = outerY - cellSize / 2;

            const cell = document.createElement('div');
            cell.className = 'load-cell';
            cell.style.left = posX + 'px';
            cell.style.top = posY + 'px';
            cell.setAttribute('data-cell-id', i + 1);
            cell.innerHTML = `
                <span class="load-cell-label">LC ${i + 1}</span>
                <span class="load-cell-value" id="loadCellValue${i + 1}">--</span>
            `;
            
            // Hover effect for arrows
            cell.addEventListener('mouseenter', function() {
                const cellId = this.getAttribute('data-cell-id');
                const cellLine = arrowsSvg.querySelector(`.arrow-line[data-cell-id="${cellId}"]`);
                if (cellLine) {
                    cellLine.style.stroke = '#ffffff';
                    cellLine.style.strokeWidth = '3';
                    cellLine.style.opacity = '1';
                }
            });
            
            cell.addEventListener('mouseleave', function() {
                const cellId = this.getAttribute('data-cell-id');
                const cellLine = arrowsSvg.querySelector(`.arrow-line[data-cell-id="${cellId}"]`);
                if (cellLine) {
                    cellLine.style.stroke = '#0056b3';
                    cellLine.style.strokeWidth = '2';
                    cellLine.style.opacity = '0.6';
                }
            });
            
            container.appendChild(cell);
        }


        // --- View Toggle ---
const launchBtn = document.getElementById('launchBtn');
const antennaView = document.getElementById('antennaView');
const gridView = document.getElementById('gridView');
let isGridVisible = false;

launchBtn.addEventListener('click', () => {
  isGridVisible = !isGridVisible;

  if (isGridVisible) {
    antennaView.style.display = 'none';
    gridView.style.display = 'block';
    launchBtn.textContent = 'Antenna View';
  } else {
    antennaView.style.display = 'flex';
    gridView.style.display = 'none';
    launchBtn.textContent = 'Grid View';
  }
});


