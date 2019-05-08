import { aListDeleteButton, aListDropdownOption, aListRenameButton, aListRenameConfirmButton, aListTitleElement, aListTitleInputElement, anAddVillagerToListButton, anEmptyListInfoElement, aRemoveVillagerFromListButton, aVillagerSearchResultButton, aVillagersIconsSection } from './components';
import { Villager } from './models/villager.model';
import { VillagerList } from './models/villagerlist.model';
import villagers from './villagers.json';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

// Global variables:
export let idCount = -1;
export let currentProfile = "";
export let currentListSelect = -1;
export let lists: VillagerList[] = [];

// Display lists in list area
function viewLists() {
    clearElement($('lists'));
    updateListsFromLocalStorage();
    var listContentElement: HTMLElement = document.createElement('div');

    if (lists.length !== 0) {
        for (let list of lists) {
            listContentElement.appendChild(aListTitleElement(list));
            listContentElement.appendChild(aListDeleteButton(list));
            listContentElement.appendChild(aListRenameButton(list));
            listContentElement.appendChild(aVillagersIconsSection(list));
        }
    }
    else {
        listContentElement = anEmptyListInfoElement();;
    }

    updateListEditingButtons();
    $('lists').appendChild(listContentElement);
}

function updateListEditingButtons(): void {
    var exportListsButton: HTMLButtonElement = <HTMLButtonElement>$('export_lists');
    var clearListsButton: HTMLButtonElement = <HTMLButtonElement>$('clear_lists');
    if (lists.length !== 0) {
        exportListsButton.className = "clickable fa fa-download";
        exportListsButton.disabled = false;
        clearListsButton.className = "clickable fa fa-times";
        clearListsButton.disabled = false;
    } else {
        exportListsButton.className = "disabled fa fa-download";
        exportListsButton.disabled = true;
        clearListsButton.className = "disabled fa fa-times";
        clearListsButton.disabled = true;
    }
}

function updateListsFromLocalStorage(): void {
    localStorage.lists = JSON.stringify(lists);
}

function viewResults(resultList: Villager[] = villagers): void {
    let searchResultsElement = $('search_results');
    clearElement(searchResultsElement);

    for (let villager of resultList) {
        searchResultsElement.appendChild(aVillagerSearchResultButton(villager));
        searchResultsElement.appendChild(document.createElement('br'));
    }

    // Transition:
    // Hide:
    document.querySelectorAll<HTMLElement>(".result")
        .forEach(result => result.style.opacity = '0');
    // Show:
    setTimeout(function () {
        document.querySelectorAll<HTMLElement>(".result")
            .forEach(result => result.style.opacity = '1');
    }, 100);
}

// Display villager profile
export function loadProfile(id: string) {
    currentProfile = id;
    updateCurrentListSelect();
    let villager: Villager = getVillager(id);
    //let trimmedName = trimName(name); // Trim name for duplicate names
    // Get values from json:
    let name = villager.name;
    let head = villager.head;
    let species = villager.species;
    let personality = villager.personality;
    let coffee = villager.coffee;
    // In case of N/A:
    if (coffee == "") {
        coffee = "<span class=\"na\">N/A</span>";
    }
    let birthday = villager.birthday.toString();
    // In case of N/A:
    if (birthday == "") {
        birthday = "<span class=\"na\">N/A</span>";
    }
    let wiki = villager.wiki;
    let store = villager.store;

    // Create Font Awesome blocks:
    let icon_wiki = "<button onclick=\"window.open('" + wiki + "','_blank');\" title=\"Open Wiki page\" class=\"clickable fa fa-wikipedia-w\" aria-hidden=\"true\"></button>";
    let icon_store = "<button onclick=\"window.open('" + store + "','_blank');\" title=\"Buy this art!\" class=\"clickable fa fa-shopping-bag\" aria-hidden=\"true\"></button>";
    let icon_name = "<i title=\"Name\" class=\"fa fa-tag\" aria-hidden=\"true\"></i>";
    let icon_species = "<i title=\"Species\" class=\"fa fa-user\" aria-hidden=\"true\"></i>";
    let icon_personality = "<i title=\"Personality\" class=\"fa fa-heart\" aria-hidden=\"true\"></i>";
    let icon_coffee = "<i title=\"Favorite coffee\" class=\"fa fa-coffee\" aria-hidden=\"true\"></i>";
    let icon_birthday = "<i title=\"Birthday\" class=\"fa fa-birthday-cake\" aria-hidden=\"true\"></i>";
    let icon_add = "<div id=\"add_remove_button\" style=\"padding:0;display:inline-block\"><button onclick=\"index.addVillager('" + id + "',document.getElementById('list_select').value);\" title=\"Add to list\" class=\"clickable fa fa-plus\" aria-hidden=\"true\"></button></div>";
    let br = "<br>";

    // Listselect:
    if (lists.length !== 0) {
        var listselect = "<div class=\"menu\"><select id=\"list_select\" onchange=\"index.updateAddVillagerButton();\"></select> ";
    }
    else {
        var listselect = "<div class=\"menu\"><select id=\"list_select\" disabled></select> ";
    }

    // In case of 'wip.jpg':
    if (head == "wip.jpg") {
        var block_head = "<img title=\"Image not available (yet)\" alt=\"Profile image (" + name + ")\" src=\"villager_heads/" + head + "\" class=\"profile-image\">" + "<div class=\"profile\">";
    }
    else {
        var block_head = "<img title=\"" + name + "\" alt=\"Profile image (" + name + ")\" src=\"villager_heads/" + head + "\" class=\"profile-image\">" + "<div class=\"profile\">";
    }

    // Birthday Easter Egg:
    let today_date = new Date(); // Get today's date
    let birthday_date = new Date(birthday.toString()); // Convert birthday to Date
    // If villager's birthday's today:
    if (today_date.getDate() === birthday_date.getDate() && today_date.getMonth() === birthday_date.getMonth()) {
        // Highlight birthday string
        birthday = "<div class=\"birthday\">" + birthday + "</div>";
        // Fun little icon with a sound
        icon_birthday = "<button title=\"Happy Birthday " + name + "!\" onclick=\"new Audio('happybirthday.mp3').play();\" style=\"color:hotpink;\" class=\" clickable fa fa-birthday-cake\" aria-hidden=\"true\"></button>";
    }

    // Assemble all blocks:
    let block = listselect + icon_add + "</div>" +
        block_head +
        icon_name + name + br +
        icon_species + species + br +
        icon_personality + personality + br +
        icon_coffee + coffee + br +
        icon_birthday + birthday + br +
        icon_wiki + icon_store + "</div>";
    // Display block
    $('info').innerHTML = block;
    updateListSelect(); // Update list select

    // Transition:
    // Hide:
    let results = document.querySelectorAll<HTMLElement>("#info *");
    for (let i = 0; i < results.length; i++) {
        results[i].style.opacity = '0';
    }
    // Show:
    setTimeout(function () {
        let results = document.querySelectorAll<HTMLElement>("#info *");
        for (let i = 0; i < results.length; i++) {
            results[i].style.opacity = '1';
        }
    }, 100);
}

// Update the select for selecting a list
export function updateListSelect(selectedListId: number = currentListSelect): void {
    if (!aProfileIsSelected() || lists.length <= 0) { return; }

    clearElement($('list_select'));

    for (let list of lists) {
        $('list_select').appendChild(aListDropdownOption(list, list.id == selectedListId));
    }

    updateAddVillagerButton();
}

function clearElement(element: HTMLElement): void {
    element.innerHTML = '';
}

function aProfileIsSelected(): boolean {
    return currentProfile !== '';
}

export function updateAddVillagerButton(): void {
    clearElement($('add_remove_button'));
    if (villagerInList(currentProfile, getListSelectValue())) {
        $('add_remove_button').appendChild(aRemoveVillagerFromListButton());
    } else {
        $('add_remove_button').appendChild(anAddVillagerToListButton());
    }
}

export function getListSelectValue(): number {
    return +(<HTMLSelectElement>$('list_select')).value;
}

function villagerInList(villagerName: string, listId: number): boolean {
    return lists.find(l => l.id == listId).members.includes(villagerName);
}

export function search(query: string): void {
    if (query == '') {
        viewResults(); // Display all villagers
        return;
    }

    query = query.toLowerCase();

    const villagersFilteredOnName = villagers.filter(
        (villager: Villager) => villager.name.toLowerCase().includes(query)
    );
    const villagersFilteredOnPersonality = villagers.filter(
        (villager: Villager) => villager.personality.toLowerCase().includes(query)
    );
    const villagersFilteredOnSpecies = villagers.filter(
        (villager: Villager) => villager.species.toLowerCase().includes(query)
    );

    let results: Villager[] = [...villagersFilteredOnName, ...villagersFilteredOnPersonality, ...villagersFilteredOnSpecies];
    results = removeDuplicates(results);

    viewResults(results);
}

function removeDuplicates(results: any[]): any[] {
    return [...new Set(results)];
}

// Add villager to list
export function addVillager(villagerNameToAdd: string, listId: number): void {
    updateCurrentListSelect();

    if (villagerNameToAdd === '') { return; }

    let listToAddTo: VillagerList = lists.find(l => l.id == listId);
    listToAddTo.members.push(villagerNameToAdd);
    listToAddTo.members.sort();

    viewLists();
    updateListSelect();
}

function updateCurrentListSelect(): void {
    currentListSelect = getListSelectValue();
}

export function removeVillager(name: string, id: number) {
    updateCurrentListSelect();

    let listToDeleteFrom = lists.find(l => l.id == id);
    listToDeleteFrom.members = listToDeleteFrom.members
        .filter(v => v !== name);

    viewLists(); // Refresh view
    updateListSelect(); // Update list select
}

export function newList(): void {
    idCount++; // Increment global count
    localStorage.idCount = idCount; // Update local storage

    lists.push({
        title: 'New List',
        id: idCount,
        members: []
    });

    viewLists();
    renameList(idCount); // Initiate rename of list
    updateListSelect();
}

export function deleteList(id: number): void {
    const listToDelete = lists.find(l => l.id == id);

    if (confirm(`Are you sure you want to delete "${listToDelete.title}"?`)) {
        lists = lists.filter(l => l.id != id);
        viewLists();
        updateListSelect();
    }
}

export function renameList(listId: number) {
    viewLists_Rename(listId);
}
function viewLists_Rename(listToRenameId: number): void {
    clearElement($('lists'));
    updateListsFromLocalStorage();
    var listContentElement: HTMLElement = document.createElement('div');

    if (lists.length !== 0) {
        for (let list of lists) {
            if (list.id == listToRenameId) {
                listContentElement.appendChild(aListTitleInputElement(list));
                listContentElement.appendChild(aListRenameConfirmButton(list));
            }
            else {
                listContentElement.appendChild(aListTitleElement(list));
                listContentElement.appendChild(aListDeleteButton(list));
                listContentElement.appendChild(aListRenameButton(list));
            }
            listContentElement.appendChild(aVillagersIconsSection(list));
        }
    }
    else {
        listContentElement = anEmptyListInfoElement();;
    }

    $('lists').appendChild(listContentElement);
    focusAndSelectRenameInput();
}

function focusAndSelectRenameInput() {
    $('rename_bar').focus();
    (<HTMLInputElement>$('rename_bar')).select();
}

export function applyTitle(listId: number, newTitle: string): void {
    if (newTitle === '') {
        viewLists();
        return;
    }

    lists
        .find(l => l.id == listId)
        .title = newTitle;

    viewLists();
    updateListSelect();
}

function getVillager(villagerId: string): Villager {
    return villagers.find((v: Villager) => v.id === villagerId);
}

// Show loading icon in search bar
function searchbarLoading(): void {
    $('search_results').innerHTML = "<i class=\"fa fa-spinner fa-pulse fa-2x fa-fw\"></i>";
}

export function clearAll(): void {
    if (confirm('Are you sure you want to clear all lists?')) {
        lists = [];
        idCount = -1;
        localStorage.idCount = idCount;
        viewLists();
    }
}

// Go to viewer
// TODO
function openViewer() {
    window.location.href = "viewer";
}

// Export lists as .json file
export function exportLists(): void {
    // TODO
    let blob = new Blob([JSON.stringify(lists, null, 2)], { type: "text/plain" });
    // saveAs(blob, "ACLists.json");
}

// Import lists from .json file
// TODO
function importLists() {
    let selectedFile = (<HTMLInputElement>$('file-input')).files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
        // Confirm dialog on lists present:
        if (lists.length > 0) {
            var confirmOverride = confirm("Are you sure you want to override current lists?");
        }
        else {
            var confirmOverride = true;
        }
        // Set lists if confirmed:
        if (confirmOverride) {
            lists = JSON.parse(reader.result as string); // Save lists
            findIDCount(); // Get idCount
            (<HTMLInputElement>$('file-input')).value = ""; // Reset input
        }
        viewLists();
    }

    reader.readAsText(selectedFile);
}

// Retrieve largest id from lists
function findIDCount(): void {
    let temp = -1;

    for (let l in lists) {
        if (lists[l].id > temp) {
            temp = lists[l].id;
        }
    }

    localStorage.idCount = temp;
    idCount = localStorage.idCount;
}

export function init() {
    search((<HTMLInputElement>$('search_bar')).value);
    // Retrieve lists from local storage:
    if (localStorage.lists) {
        lists = JSON.parse(localStorage.lists);
    }
    // Retrieve idCount from local storage:
    if (localStorage.idCount) {
        idCount = localStorage.idCount;
    }
    viewLists();
}