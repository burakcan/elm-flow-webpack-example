//@flow

import 'normalize.css';
import Main from './Main.elm.js';


const app = Main.embed(
  document.getElementById('root'), {}
);
