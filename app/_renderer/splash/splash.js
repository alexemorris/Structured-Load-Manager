import { ipcRenderer } from 'electron';
import './splash.global.css';

import {
  CREATE_EBUNDLE,
  OPEN_EBUNDLE
} from './constants';

document.getElementById('create-ebundle').onclick = () => {
  console.log('create');
  ipcRenderer.send(CREATE_EBUNDLE);
};

// document.getElementById('open-ebundle').onclick = () => {
//   ipcRenderer.send(OPEN_EBUNDLE);
// };
