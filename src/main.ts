import ListsView from './lists.view';
import { Villager } from './models/villager.model';
import ProfileView from './profile.view';
import SearchView from './search.view';
import { stateService } from './state.service';
import { getListSelectValue, removeDuplicates } from './util';
import villagers from './villagers.json';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

function viewLists(withListToRenameId?: number) {
    ListsView.updateView(withListToRenameId);
    ProfileView.updateListSelect();
}

export function renameList(listId: number) {
    viewLists(listId);
}

export function loadProfile(id: string, fromListId: number = getListSelectValue()) {
    ProfileView.updateView(getVillagerById(id), fromListId);
}

export function search(query: string): void {
    if (query == '') {
        SearchView.updateView();
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

    SearchView.updateView(results);
}

export function addVillager(villagerNameToAdd: string, listId: number): void {
    if (villagerNameToAdd !== '') {
        stateService.addVillagerToList(villagerNameToAdd, listId);
        viewLists();
    }
}

export function removeVillager(villagerNameToRemove: string, listId: number) {
    if (villagerNameToRemove !== '') {
        stateService.removeVillagerFromList(villagerNameToRemove, listId);
        viewLists();
    }
}

export function newList(): void {
    let newListID = stateService.addNewList();
    viewLists(newListID);
}

export function deleteList(id: number): void {
    const listToDelete = stateService.getListById(id);

    if (confirm(`Are you sure you want to delete "${listToDelete.title}"?`)) {
        stateService.deleteList(id);
        viewLists();
    }
}

export function applyTitle(listId: number, newTitle: string): void {
    if (newTitle !== '') {
        stateService.renameList(listId, newTitle);
    }
    viewLists();
}

function getVillagerById(villagerId: string): Villager {
    return villagers.find((v: Villager) => v.id === villagerId);
}

// Show loading icon in search bar
function searchbarLoading(): void {
    $('search_results').innerHTML = '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>';
}

export function clearAllLists(): void {
    if (confirm('Are you sure you want to clear all lists?')) {
        stateService.clearAllLists();
        viewLists();
    }
}

export function updateAddVillagerButton(): void {
    ProfileView.updateAddVillagerButton();
}

// Go to viewer
// TODO
function openViewer() {
    window.location.href = 'viewer';
}

// Export lists as .json file
export function exportLists(): void {
    // TODO
    let blob = new Blob([JSON.stringify(stateService.getLists(), null, 2)], { type: 'text/plain' });
    // saveAs(blob, 'ACLists.json');
}

// Import lists from .json file
// TODO
function importLists() {
    if (!stateService.listsAreEmpty() && confirm('Are you sure you want to override current lists?')) {
        let selectedFile = (<HTMLInputElement>$('file-input')).files[0];
        stateService.importListFromFile(selectedFile, viewLists);
    }
}

export function init() {
    search((<HTMLInputElement>$('search_bar')).value);
    viewLists();
}