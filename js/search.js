function updateMin(val)
{
    const max = +document.querySelectorAll('.form-range')[1].value;
    if(val > max) val = max;
    minPriceLabel.textContent = val + ' zł';
}

function updateMax(val)
{
    const min = +document.querySelectorAll('.form-range')[0].value;
    if(val < min) val = min;
    maxPriceLabel.textContent = val + ' zł';
}