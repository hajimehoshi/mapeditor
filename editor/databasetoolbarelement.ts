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
    export class DatabaseToolbarElement {
        private createdCallback(): void {
            let template = <HTMLTemplateElement>document.getElementById('unagi-database-toolbar-template');
            let clone = document.importNode(template.content, true);
            let shadowRoot = (<HTMLElementES6><any>this).createShadowRoot();
            shadowRoot.appendChild(clone);

            let styleTemplate = <HTMLTemplateElement>document.getElementById('unagi-toolbar-style-template');
            let styleClone = document.importNode(styleTemplate.content, true);
            shadowRoot.appendChild(styleClone);

            let inputs = shadowRoot.querySelectorAll('input[type="radio"]');
            [].forEach.call(inputs, (node: Node) => {
                let input = <HTMLInputElement>node;
                input.addEventListener('change', (e) => {
                    let mode = {
                        'actors':  DatabaseMode.Actors,
                        'skills':  DatabaseMode.Skills,
                        'states':  DatabaseMode.States,
                        'items':   DatabaseMode.Items,
                        'enemies': DatabaseMode.Enemies,
                        'troops':  DatabaseMode.Troops,
                        'system':  DatabaseMode.System,
                    }[input.value];
                    Dispatcher.onDatabaseModeChanged(mode);
                });
            })
        }

        public updateMode(mode: DatabaseMode): void {
            let shadowRoot = (<HTMLElementES6><any>this).shadowRoot;
            let value = {
                [DatabaseMode.Actors]:  'actors',
                [DatabaseMode.Skills]:  'skills',
                [DatabaseMode.States]:  'states',
                [DatabaseMode.Items]:   'items',
                [DatabaseMode.Enemies]: 'enemies',
                [DatabaseMode.Troops]:  'troops',
                [DatabaseMode.System]:  'system',
            }[mode];
            let cond = `input[type=radio][name=databaseMode][value=${ value }]`;
            let radioButton = <HTMLInputElement>shadowRoot.querySelector(cond);
            if (radioButton) {
                radioButton.checked = true;
            }
        }
    }
}

(() => {
    (<any>editor.DatabaseToolbarElement.prototype).__proto__ = HTMLElement.prototype;
    (<editor.HTMLDocumentES6>document).registerElement('unagi-database-toolbar', editor.DatabaseToolbarElement);
})();
