// ================= SPLASH =================
window.addEventListener("load", () => {
    const splash = document.getElementById("splash-screen");
    setTimeout(() => {
        splash.classList.add("hide");
        setTimeout(() => splash.remove(), 1000);
    }, 1750);
});

// ================= SYSTEM STATE =================
let emergency = false;

const state = {
    tilt: 0,
    roll: 0,
    z: 0
};

const limits = {
    tilt: { min: 0, max: 30 },        // mm
    roll: { min: -180, max: 180 },    // deg
    z:    { min: 0, max: 3000 }       // mm
};

const limitState = {
    tiltMin: false, tiltMax: false,
    rollMin: false, rollMax: false,
    zMin: false, zMax: false
};

const motionState = {
    tilt: false,
    roll: false,
    z: false
};

const jogTimers = { tilt: null, roll: null, z: null };
// ================= INIT =================
window.onload = () => {
    renderPositions();
    log("System initialized");
};

// ================= LOG =================
function log(msg) {
    document.querySelectorAll(".message-box").forEach(box => {
        box.innerHTML += msg + "<br>";
        box.scrollTop = box.scrollHeight;
    });
}

// ================= LIMIT + LIGHT LOGIC =================
function updateLimitIndicators(axis, value) {
    const minHit = value <= limits[axis].min;
    const maxHit = value >= limits[axis].max;

    limitState[axis + "Min"] = minHit;
    limitState[axis + "Max"] = maxHit;

    ["min", "max"].forEach(type => {
        document.querySelectorAll(`[data-limit="${axis}-${type}"]`)
            .forEach(light => {
                light.classList.remove("green", "red", "blink");

                if ((type === "min" && minHit) || (type === "max" && maxHit)) {
                    light.classList.add("red", "blink");          // 🔴 limit hit
                } else if (motionState[axis]) {
                    light.classList.add("green", "blink");        // 🟢 moving
                } else {
                    light.classList.add("green");                // 🟢 idle
                }
            });
    });
}

// ================= RENDER =================
function renderPositions(){
    ["tilt","roll","z"].forEach(axis => {
        const v = state[axis];

        const p = document.getElementById(axis + "Pos");
        const pm = document.getElementById(axis + "PosManual");

        if (p) p.textContent = v;
        if (pm) pm.textContent = v;

        updateLimitIndicators(axis, v);
    });
}

// ================= MOTION HELPERS =================
function startMotion(axis){
    motionState[axis] = true;
    updateLimitIndicators(axis, state[axis]);
}

function stopMotion(axis){
    motionState[axis] = false;
    updateLimitIndicators(axis, state[axis]);
}

function canMove(axis, dir) {
    const next = state[axis] + dir;
    const { min, max } = limits[axis];

    if (next < min || next > max) {
        log(`${axis.toUpperCase()} LIMIT REACHED`);
        setLimitTriggered(axis);
        return false;
    }
    return true;
}

// ================= POSITION MODE =================
function updateValue(axis){
    if (emergency) return log("EMERGENCY ACTIVE");

    const val = Number(document.getElementById(axis + "Ctrl").value);

    if (val < limits[axis].min || val > limits[axis].max) {
        log(axis.toUpperCase() + " OUT OF LIMIT");
        return;
    }

    startMotion(axis);
    state[axis] = val;
    renderPositions();

    setTimeout(() => stopMotion(axis), 600);
    log(axis.toUpperCase() + " set to " + val);
}

async function goHome(){
    if (emergency) return log("EMERGENCY ACTIVE");

    log("Homing started");

    for (const axis of ["tilt","roll","z"]) {
        startMotion(axis);
        state[axis] = 0;
        renderPositions();
        await wait(500);
        stopMotion(axis);
    }

    log("Homing completed");
}

function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

// ================= MODE SWITCH =================
function hideAllModes(){
    manualMode.style.display = "none";
    positionMode.style.display = "none";
    parametersMode.style.display = "none";
}

function setActive(i){
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".nav-btn")[i].classList.add("active");
}

function showManual(){
    hideAllModes();
    manualMode.style.display = "grid";
    setActive(0);
}

function showPosition(){
    hideAllModes();
    positionMode.style.display = "grid";
    setActive(1);
}

function showParameters(){
    hideAllModes();
    parametersMode.style.display = "grid";
    setActive(2);
}

// ================= MANUAL KEY CONTROL =================
window.addEventListener("keydown", e => {
    if (manualMode.style.display !== "grid" || emergency) return;

    const step = 1;
    let axis = null;

    if (e.key === "ArrowUp" && canMove("tilt", +1))  { axis="tilt"; state.tilt+=step; }
    if (e.key === "ArrowDown" && canMove("tilt", -1)){ axis="tilt"; state.tilt-=step; }

    if (e.key === "ArrowRight" && canMove("roll", +1)){ axis="roll"; state.roll+=step; }
    if (e.key === "ArrowLeft" && canMove("roll", -1)) { axis="roll"; state.roll-=step; }

    if (e.key === "PageUp" && canMove("z", +1))  { axis="z"; state.z+=step; }
    if (e.key === "PageDown" && canMove("z", -1)){ axis="z"; state.z-=step; }

    if (axis){
        startMotion(axis);
        renderPositions();
        setTimeout(() => stopMotion(axis), 300);
    }
});

// ================= ENCODER SYNC =================
function syncFromEncoder(data){
    ["tilt","roll","z"].forEach(a => {
        if (data[a] !== undefined) state[a] = data[a];
    });
    renderPositions();
}

document.querySelectorAll(".control-btn[data-axis]").forEach(btn => {
    const axis = btn.dataset.axis;
    const dir  = Number(btn.dataset.dir);

    btn.addEventListener("mousedown", () => startJog(axis, dir));
    btn.addEventListener("mouseup",   () => stopJog(axis));
    btn.addEventListener("mouseleave",() => stopJog(axis));

    // Touch support (important for panels)
    btn.addEventListener("touchstart", e => {
        e.preventDefault();
        startJog(axis, dir);
    });

    btn.addEventListener("touchend", () => stopJog(axis));
});
// ================= JOGGING =================
function startJog(axis, dir) {
    if (emergency) return broadcastMessage("EMERGENCY ACTIVE");
    if (!canMove(axis, dir)) return;

    if (jogTimers[axis]) return;

    startMotion(axis);
    jogTimers[axis] = setInterval(() => {
        if (!canMove(axis, dir)) {
            stopJog(axis);
            return;
        }
        state[axis] += dir;
        renderPositions();
    }, 150);

    broadcastMessage(axis.toUpperCase() + (dir > 0 ? " +" : " -"));
}

function stopJog(axis) {
    if (jogTimers[axis]) {
        clearInterval(jogTimers[axis]);
        jogTimers[axis] = null;
        stopMotion(axis);
    }
}
// ================= EMERGENCY STOP =================
function emergencyStop() {
    if (emergency) return;

    emergency = true;

    Object.keys(jogTimers).forEach(stopJog);
    Object.keys(blinkTimers).forEach(clearBlink);

    broadcastMessage("<b style='color:red;'>EMERGENCY STOP ACTIVATED</b>");

    const btn = document.getElementById("emergencyBtn");
    if (btn) {
        btn.textContent = "EMERGENCY ACTIVE";
        btn.style.background = "#444";
    }
}

document.getElementById("emergencyBtn")
    .addEventListener("click", emergencyStop);


