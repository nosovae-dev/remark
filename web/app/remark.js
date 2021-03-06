/* eslint-disable no-console */
/** @jsx h */
import loadPolyfills from 'common/polyfills';

import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import Root from './components/root';
import UserInfo from 'components/user-info';
import store from 'common/store';
import reduxStore from './store';

// eslint-disable-next-line no-unused-vars
import ListComments from './components/list-comments'; // TODO: temp solution for extracting styles

import { NODE_ID } from './common/constants';

loadPolyfills().then(() => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
});

const Main = () => (
  <Provider store={reduxStore}>
    <Root />
  </Provider>
);

function init() {
  const node = document.getElementById(NODE_ID);

  if (!node) {
    console.error("Remark42: Can't find root node.");
    return;
  }

  const params = window.location.search
    .replace(/^\?/, '')
    .split('&')
    .reduce((memo, value) => {
      const vals = value.split('=');
      if (vals.length === 2) {
        memo[vals[0]] = vals[1];
      }
      return memo;
    }, {});

  if (params.page === 'user-info') {
    const user = {
      id: params.id,
      name: params.name || '',
      isDefaultPicture: params.isDefaultPicture,
      picture: params.picture,
    };
    store.set('user', user);
    const onClose = () => {
      if (window.parent) {
        window.parent.postMessage(JSON.stringify({ isUserInfoShown: false }), '*');
      }
    };
    render(
      <div id={NODE_ID}>
        <div className="root root_user-info">
          <UserInfo user={user} onClose={onClose} />
        </div>
      </div>,
      node.parentElement,
      node
    );
  } else {
    render(<Main />, node.parentElement, node);
  }
}
