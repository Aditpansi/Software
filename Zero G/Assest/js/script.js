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

// Navigation button functionality
document.addEventListener('DOMContentLoaded', function() {
    const sysButton = document.querySelector('.sys-button');
    const navIcons = document.querySelectorAll('.nav-icon');
    
    sysButton.addEventListener('click', function() {
        alert('System menu opened');
    });
    
    navIcons.forEach((icon, index) => {
        icon.addEventListener('click', function() {
            const actions = [
                'Battery status checked',
                'Warning acknowledged', 
                'Audio settings opened',
                'Lighting controls opened',
                'Settings menu opened'
            ];
            alert(actions[index]);
        });
    });
});

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