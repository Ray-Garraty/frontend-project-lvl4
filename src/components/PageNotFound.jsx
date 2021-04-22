import React from 'react';
import i18next from 'i18next';

export default () => (
  <div className="d-flex flex-column h-100">
    <nav className="mb-3 navbar navbar-expand-lg navbar-light bg-light">
      <a className="mr-auto navbar-brand" href="/">Hexlet Chat</a>
    </nav>
    <h1>{i18next.t('404')}</h1>
  </div>
);
