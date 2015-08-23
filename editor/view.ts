// Copyright 2015 Hajime Hoshi
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

namespace editor {
    export class View {
        private toolbar_: Toolbar;
        private palette_: Palette;
        private tiles_: Tiles;
        private database_: Database;

        // TODO: Remove this
        private tileSetImage_: HTMLImageElement;

        constructor() {
            this.toolbar_ = new Toolbar(<HTMLElement>document.querySelector('#toolbar'));
            this.palette_ = new Palette(<HTMLElement>document.querySelector('#palette'));
            this.tiles_ = new Tiles(<HTMLElement>document.querySelector('#tiles'));
            this.database_ = new Database(<HTMLElement>document.querySelector('#database'));

            this.tileSetImage_ = new Image();
            this.tileSetImage_.src = defaultImages.filter(x => x.name === 'tileset')[0].data;

            window.addEventListener('message', (e: MessageEvent) => {
                if (e.data === 'quit') {
                    Store.instance.stopGame();
                }
            });

            let mapListElement = <HTMLElement><any>this.mapList;
            mapListElement.addEventListener('selectedItemChanged', (e: CustomEvent) => {
                Store.instance.updateCurrentMap(e.detail.id);
            });
        }

        private get mapList(): ListBoxElement {
            return <ListBoxElement><any>document.querySelector('unagi-listbox.maps');
        }

        public render(game: data.Game, info: RenderInfo): void {
            let editingMode = info.editingMode;
            this.database_.toggle(editingMode === EditingMode.Database);
            this.toolbar_.render(info);
            this.database_.render(game);

            let maps = game ? game.maps : [];
            let items = maps.map((map: data.Map): ListBoxItem => {
                return {
                    title: map.name,
                    id:    map.id,
                };
            });
            this.mapList.replaceItems(items);
            if (info.mapId) {
                this.mapList.select(info.mapId);
            }

            // TODO: Move this to store?
            info.tileSetImage = this.tileSetImage_;
            this.tiles_.render(game, info);
            this.palette_.render(info);
        }

        public updateSelectedTiles(s: SelectedTiles): void {
            this.palette_.selectedTiles = s;
        }

        public playGame(game: data.Game): void {
            this.toolbar_.playGame();

            let iframe = <HTMLIFrameElement>document.querySelector('iframe.player');
            iframe.src = './player.html';
            iframe.style.display = 'block';
            let f = (e) => {
                iframe.contentWindow.postMessage(game, '*');
                iframe.removeEventListener('load', f);
            };
            iframe.addEventListener('load', f);
        }

        public stopGame(): void {
            this.toolbar_.stopGame();

            let iframe = <HTMLIFrameElement>document.querySelector('iframe.player');
            iframe.src = 'about:blank';
            iframe.style.display = 'none';
        }

        public updateDatabaseMode(databaseMode: DatabaseMode): void {
            this.database_.updateMode(databaseMode);
        }
    }
}
