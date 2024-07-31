document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-icon');
    const saveMenu = document.querySelector('.save-menu');
    const newSave = document.querySelector('.new-save');
    const newSaveOptions = document.querySelector('.new-save-options');

    saveButton.addEventListener('click', () => {
        console.log('Save button clicked');
        saveMenu.classList.toggle('hidden');
    });

    newSave.addEventListener('click', () => {
        console.log('New Save button clicked');
        newSaveOptions.classList.toggle('hidden');
    });
});