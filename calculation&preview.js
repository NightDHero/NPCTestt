// PREVIEWER
// set bz price and npc sell price beforehand automaticly - run calculate - remove the entry field texts so them users dont see them

/*
    TODO: 
    Add Settings which include --> 1. Option to remove or add certain profits // profit per item // profit per stack //
                                   2. Option to adjust inventory dumptime
                                   3. Add the ability to change colors to all profits or to leave without 
                                   4. Add a save flip option if possible and name it and access it in the saved menu
                                   5. Add bz API
                                   6. Tab order (pressing tab makes u cycle between buy, sell, calculate, reset)
                                   7. Optional, pro tips window
                                   8. ------- Make settings clickable
                                   9. Make some text unselectable
                                   10. allow the user to edit preview elements names and apply those to result
                                   11. get rid of the y-axis scoll bar when opening preview
                                   12. add the swift animation that the open settings has to open preview
                                   13. add a Save? button to when i click calculate (in the results)
                                   
*/

let ProfitPerHour, ProfitPerDay, ProfitPerMinute, ProfitPerInventory, time, Quantity, CoinsRequirementPerDay, ProfitPerHourText;
const calculateProfit = () => {
    const ItemBZBuyPrice = parseFloat(document.getElementById('bz-buy-price').value);
    const ItemNPCSellPrice = parseFloat(document.getElementById('npc-sell-price').value);

    if (isNaN(ItemBZBuyPrice) || ItemBZBuyPrice < 0 || isNaN(ItemNPCSellPrice) || ItemNPCSellPrice <= 0) {
        alert('Please enter valid numbers for both prices.');
        return;
    }

    if (ItemBZBuyPrice === ItemNPCSellPrice || ItemBZBuyPrice >= ItemNPCSellPrice) {
        alert('Did you know brains are meant to be used? You might want to give it a try sometime.');
        return;
    }

    const NPCCoinsSellLimit = 200000000;
    Quantity = NPCCoinsSellLimit / ItemNPCSellPrice;
    ProfitPerDay = Quantity * (ItemNPCSellPrice - ItemBZBuyPrice);
    CoinsRequirementPerDay = Quantity * ItemBZBuyPrice;
    const ProfitPerItem = ItemNPCSellPrice - ItemBZBuyPrice;
    const Inventory64 = 2240;
    ProfitPerInventory = ProfitPerItem * Inventory64;
    const InventoryDumptime = 20;
    const HourInMinutes = 60;
    const MinuteInSeconds = 60;
    ProfitPerMinute = (MinuteInSeconds / InventoryDumptime) * ProfitPerInventory;
    ProfitPerHour = ProfitPerMinute * 60;
    const TimeNeededToExecuteTheFlip = ProfitPerDay / ProfitPerMinute;

    if (ProfitPerHour >= ProfitPerDay) {
        const minutes = Math.floor(ProfitPerDay / ProfitPerMinute);
        ProfitPerHourText = `Profit / Hour (${minutes + 1}min): ${formatNumber(ProfitPerDay)}`;
        time = `${minutes + 1}min`;
    } else {
        ProfitPerHourText = `Profit / Hour: ${formatNumber(ProfitPerHour)}`;
        time = TimeNeededToExecuteTheFlip >= HourInMinutes
            ? `${Math.floor(TimeNeededToExecuteTheFlip / 60)}h ${Math.floor(TimeNeededToExecuteTheFlip % 60)}min`
            : `${Math.floor(TimeNeededToExecuteTheFlip)}min`;
    }

    updateResultsOrder();
    document.getElementById('result').classList.remove('hidden');
};

const resetCalculator = () => {
    document.getElementById('bz-buy-price').value = '';
    document.getElementById('npc-sell-price').value = '';
    document.getElementById('result').classList.add('hidden');
};


document.querySelector('.reset').addEventListener('keydown', function(event) {
    if (event.key === 'Tab' && !event.shiftKey) {
        event.preventDefault();
        document.getElementById('bz-buy-price').focus();
    }
});


const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'm';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(2).replace(/\.00$/, '') + 'k';
    }
    return num.toString();
};

const updateResultsOrder = () => {
    const resultContainer = document.getElementById('result');

    // Create a results object with updated values
    const results = {
        "ProfitPerHourText": ProfitPerHourText,
        "Profit / Day:": formatNumber(ProfitPerDay),
        "Profit / Minute:": formatNumber(ProfitPerMinute),
        "Profit / Inventory:": formatNumber(ProfitPerInventory),
        "Time Needed:": time,
        "Coins Required / Day:": formatNumber(CoinsRequirementPerDay),
        "Buy Order Size:": formatNumber(Quantity)
    };

    // Collect and sort the preview items based on their data-order attribute and visibility
    const previewItems = Array.from(document.querySelectorAll('.preview .draggable'));
    const orderedResults = previewItems
        .filter(item => item.querySelector('.toggle-display').checked)
        .sort((a, b) => a.dataset.order - b.dataset.order)
        .map(item => item.textContent.trim().split('\n')[0]);

    // Clear existing results
    resultContainer.innerHTML = '';

    // Add results in the order defined by preview
    orderedResults.forEach((label, index) => {
        if (label === "Profit / Hour:") {
            // Add the ProfitPerHourText directly
            const resultElement = document.createElement('div');
            resultElement.textContent = results["ProfitPerHourText"];
            resultElement.classList.add('result-item');
            resultElement.dataset.order = index;
            resultContainer.appendChild(resultElement);
        } else if (results[label]) {
            const resultElement = document.createElement('div');
            resultElement.textContent = `${label} ${results[label]}`;
            resultElement.classList.add('result-item');
            resultElement.dataset.order = index;
            resultContainer.appendChild(resultElement);
        }
    });
};

















document.addEventListener('DOMContentLoaded', () => {
    const preview = document.querySelector('.preview');
    const settingsIcon = document.getElementById('settings-icon');
    const settingsMenu = document.getElementById('settings-menu');
    const calculateButton = document.querySelector('.calculate');
    const resetButton = document.querySelector('.reset');
    const settingButtons = document.querySelectorAll('.main');



    function getItems() {
        return Array.from(preview.children);
    }



    function mainSelection(event) {
        const button = event.target;
        const selectionBorderIsActive = button.classList.contains('selection-border');

        settingButtons.forEach(btn => btn.classList.remove('selection-border'));

        if (!selectionBorderIsActive) {
            button.classList.add('selection-border');
        }

        if (button.textContent.includes('Preview')) {
            preview.classList.toggle('hidden');
        }

        if (!button.textContent.includes('Preview')) {
            preview.classList.add('hidden');
        }
    }

    function openSettings() {
        settingsIcon.classList.toggle('rotated');
        settingsMenu.classList.toggle('expanded');
        settingsMenu.classList.remove('hidden');
        preview.classList.add('hidden');

        settingButtons.forEach(btn => btn.classList.remove('selection-border'));
    }

    function moveUp(index) {
        const items = getItems();
        if (index <= 0) return;

        const currentItem = items[index];
        const previousItem = items[index - 1];

        // Swap orders
        [currentItem.dataset.order, previousItem.dataset.order] = [previousItem.dataset.order, currentItem.dataset.order];

        renderPreview();
    }

    function moveDown(index) {
        const items = getItems();
        if (index >= items.length - 1) return;

        const currentItem = items[index];
        const nextItem = items[index + 1];

        // Swap orders
        [currentItem.dataset.order, nextItem.dataset.order] = [nextItem.dataset.order, currentItem.dataset.order];

        renderPreview();
    }

    function renderPreview() {
        const sortedItems = getItems().sort((a, b) => a.dataset.order - b.dataset.order);

        preview.innerHTML = '';
        sortedItems.forEach(item => preview.appendChild(item));

        updateResultsOrder();
    }


    calculateButton.addEventListener('click', calculateProfit);
    resetButton.addEventListener('click', resetCalculator);
    settingsIcon.addEventListener('click', openSettings);
    settingButtons.forEach(button => button.addEventListener('click', mainSelection));













    preview.addEventListener('click', (event) => {
        const button = event.target;
        const item = button.closest('.draggable');
        if (!item) return;

        const index = parseInt(item.dataset.order, 10);

        if (button.classList.contains('move-up')) {
            moveUp(index);
        } else if (button.classList.contains('move-down')) {
            moveDown(index);
        }
    });

    preview.addEventListener('change', (event) => {
        if (event.target.classList.contains('toggle-display')) {
            updateResultsOrder();
        }
    });
    renderPreview();
});
