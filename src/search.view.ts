import { loadProfile } from './main';
import { Villager } from './models/villager.model';
import { aBreakElement, clearElement } from './util';
import villagers from './villagers.json';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

export default class SearchView {
    public static updateView(resultList: Villager[] = villagers): void {
        let searchResultsElement = $('search_results');
        clearElement(searchResultsElement);

        for (let villager of resultList) {
            searchResultsElement.appendChild(this.aVillagerSearchResultButton(villager));
            searchResultsElement.appendChild(aBreakElement());
        }

        this.fadeTransition();
    }

    private static aVillagerSearchResultButton(villager: Villager): HTMLButtonElement {
        let villagersSearchResultButton: HTMLButtonElement = document.createElement('button');
        villagersSearchResultButton.onclick = () => { loadProfile(villager.id); };
        villagersSearchResultButton.className = 'result';
        villagersSearchResultButton.appendChild(this.aVillagersSearchResultImage(villager));
        villagersSearchResultButton.appendChild(this.aVillagersSearchResultNameElement(villager.name));
        return villagersSearchResultButton;
    }

    private static aVillagersSearchResultNameElement(villagerName: string): HTMLElement {
        let villagersSearchResultNameElement: HTMLElement = document.createElement('div');
        villagersSearchResultNameElement.innerHTML = villagerName;
        return villagersSearchResultNameElement;
    }

    private static aVillagersSearchResultImage(villager: Villager): HTMLImageElement {
        let villagersSearchResultImage: HTMLImageElement = document.createElement('img');
        villagersSearchResultImage.alt = villager.name;
        villagersSearchResultImage.style.cssFloat = 'left';
        villagersSearchResultImage.src = `./villager_icons/${villager.id}.gif`;
        return villagersSearchResultImage;
    }

    private static fadeTransition(): void {
        /*     // Transition:
    // Hide:
    document.querySelectorAll<HTMLElement>('.result')
        .forEach(result => result.style.opacity = '0');
    // Show:
    setTimeout(function () {
        document.querySelectorAll<HTMLElement>('.result')
            .forEach(result => result.style.opacity = '1');
    }, 100); */
    }
}