// dwupunktowy range slider
const inputMin = document.getElementById('rangeMin');
const inputMax = document.getElementById('rangeMax');
const trackFill = document.getElementById('trackFill');
const labelMin = document.getElementById('labelMin');
const labelMax = document.getElementById('labelMax');
const MIN_GAP = 10;

function toPercent(value) {
    const min = +inputMin.min; // 0
    const max = +inputMax.max; // 500
    return ((value - min) / (max - min)) * 100;
}

function updateSlider() {
    let valMin = +inputMin.value;
    let valMax = +inputMax.value;

    if (valMin > valMax - MIN_GAP) {
        valMin = valMax - MIN_GAP;
        inputMin.value = valMin;
    }
    if (valMax < valMin + MIN_GAP) {
        valMax = valMin + MIN_GAP;
        inputMax.value = valMax;
    }

    const leftPercent  = toPercent(valMin);
    const rightPercent = toPercent(valMax);

    trackFill.style.left  = leftPercent  + '%';
    trackFill.style.width = (rightPercent - leftPercent) + '%';

    labelMin.textContent = valMin + ' zł';
    labelMax.textContent = valMax + ' zł';
}

inputMin.addEventListener('input', updateSlider);
inputMax.addEventListener('input', updateSlider);

updateSlider();

// aktywne filtry - usuwanie tagu
document.querySelectorAll('.filter-tag button').forEach(function(btn) {
    btn.addEventListener('click', function() {
        btn.parentElement.remove();
    });
});