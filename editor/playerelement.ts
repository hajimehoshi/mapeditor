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
    export class PlayerElement extends HTMLElement {
        private createdCallback(): void {
            let template = <HTMLTemplateElement>document.getElementById('unagi-player-template');
            let clone = document.importNode(template.content, true);
            let shadowRoot = (<HTMLElementES6><any>this).createShadowRoot();
            shadowRoot.appendChild(clone);

            this.addEventListener('click', () => {
                Dispatcher.onStopGame();
            });
        }

        public playGame() {
            this.style.display = 'block';
        }

        public stopGame() {
            this.style.display = 'none';
        }
    }
}

(() => {
    (<editor.HTMLDocumentES6>document).registerElement('unagi-player', editor.PlayerElement);
})();
