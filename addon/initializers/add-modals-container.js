/*globals document */
import { getOwner } from '@ember/application';
import Ember from 'ember';

let hasDOM = typeof document !== 'undefined';

function appendContainerElement(rootElementOrId, id) {
  if (!hasDOM) {
    return;
  }

  if (document.getElementById(id)) {
    return;
  }

  let rootEl = rootElementOrId.appendChild ? rootElementOrId : document.querySelector(rootElementOrId);
  let modalContainerEl = document.createElement('div');
  modalContainerEl.id = id;
  rootEl.appendChild(modalContainerEl);
}

export default function(AppOrEngine) {
  // As there is only a single `Router` across the whole app, which is owned by the
  // root `App`, this reliably finds the root `App` from an `Engine`.
  let App = getOwner(getOwner(AppOrEngine).lookup('router:main'));

  let emberModalDialog = AppOrEngine.emberModalDialog ?? App.emberModalDialog ?? {};
  let modalContainerElId = emberModalDialog.modalRootElementId || 'modal-overlays';

  AppOrEngine.register(
    'config:modals-container-id',
    Ember.testing ? 'ember-testing' : modalContainerElId,
    { instantiate: false }
  );

  AppOrEngine.inject(
    'service:modal-dialog',
    'destinationElementId',
    'config:modals-container-id'
  );

  appendContainerElement(App.rootElement, modalContainerElId);
}
