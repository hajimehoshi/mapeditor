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

module editor {
    export class Store {
        private mainElement_: MainElement;
        private selectedTiles_: SelectedTiles;
        private tilesCursorX_: number;
        private tilesCursorY_: number;
        private tilesOffsetX_: number;
        private tilesOffsetY_: number;
        private map_: Map;
        private isPlayingGame_: boolean;

        public constructor(mapEditorMain: MainElement) {
            this.mainElement_ = mapEditorMain;
            this.tilesOffsetX_ = 16;
            this.tilesOffsetY_ = 16;
            this.mainElement_.updateTilesOffset(this.tilesOffsetX_, this.tilesOffsetY_);
            this.isPlayingGame_ = false;
        }

        public updateMap(map: Map): void {
            this.map_ = map;
            this.mainElement_.updateMap(map);
        }

        public updateSelectedTiles(s: SelectedTiles): void {
            this.selectedTiles_ = s;
            this.mainElement_.updateSelectedTiles(s);
        }

        public updateTilesCursorPosition(x: number, y: number): void {
            this.tilesCursorX_ = x;
            this.tilesCursorY_ = y;
            this.mainElement_.updateTilesCursorPosition(x, y);
        }

        public drawTiles(): void {
            if (!this.map_) {
                return;
            }
            if (!this.selectedTiles_) {
                return;
            }
            this.map_.replaceTiles(this.selectedTiles_, this.tilesCursorX_, this.tilesCursorY_);
            this.mainElement_.render();
        }

        public moveTilesOffset(x: number, y: number, scale: number, canvasWidth: number, canvasHeight: number): void {
            const ratio = window.devicePixelRatio;
            const marginX = 128;
            const marginY = 128;

            this.tilesOffsetX_ += x;
            this.tilesOffsetY_ += y;
            let minX = -(this.map_.xNum * MainElement.tileWidth * scale - canvasWidth / ratio) - marginX;
            let minY = -(this.map_.yNum * MainElement.tileHeight * scale - canvasHeight / ratio) - marginY;
            let maxX = marginX;
            let maxY = marginY;
            this.tilesOffsetX_ = Math.min(Math.max(this.tilesOffsetX_, minX), maxX);
            this.tilesOffsetY_ = Math.min(Math.max(this.tilesOffsetY_, minY), maxY);
            this.mainElement_.updateTilesOffset(this.tilesOffsetX_, this.tilesOffsetY_);
        }

        public playGame(): void {
            this.isPlayingGame_ = true;
            this.mainElement_.playGame();
        }

        public stopGame(): void {
            this.isPlayingGame_ = false;
            this.mainElement_.stopGame();
        }
    }

    export class Dispatcher {
        private static store_: Store;

        public static set store(store: Store) {
            Dispatcher.store_ = store;
        }

        public static onMapChanged(map: Map): void {
            Dispatcher.store_.updateMap(map);
        }

        public static onSelectedTilesChanged(s: SelectedTiles): void {
            Dispatcher.store_.updateSelectedTiles(s);
        }

        public static onTilesCursorPositionChanged(x: number, y: number): void {
            Dispatcher.store_.updateTilesCursorPosition(x, y);
        }

        public static onDrawingTiles(): void {
            Dispatcher.store_.drawTiles();
        }

        public static onTilesWheel(dx: number, dy: number, scale: number, canvasWidth: number, canvasHeight: number): void {
            Dispatcher.store_.moveTilesOffset(dx, dy, scale, canvasWidth, canvasHeight);
        }

        public static onPlayGame() {
            Dispatcher.store_.playGame();
        }

        public static onStopGame() {
            Dispatcher.store_.stopGame();
        }
    }
}