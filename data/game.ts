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

namespace data {
    export const gridSize = 16;

    export declare type Position = {
        mapId: string,
        x: number,
        y: number,
    }

    export declare type Game = {
        title: string,
        maps: {[id: string]: Map},
        mapIds: string[],
        playerInitialPosition: Position,
        scripts: {[name: string]: string},
        scriptNames: string[],
    }

    export function createGame(title: string): Game {
        return {
            title: title,
            maps: {},
            mapIds: [],
            playerInitialPosition: {mapId: null, x: 0, y: 0},
            scripts: {},
            scriptNames: [],
        };
    }

    export function concatenatedScript(game: Game): string {
        let script = "";
        for (let name of game.scriptNames) {
            script += game.scripts[name];
        }
        return script;
    }
}
