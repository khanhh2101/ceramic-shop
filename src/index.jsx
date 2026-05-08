import React from 'react';
import ReactDOM from 'react-dom/client';
import 'normalize.css';
import './components/GlobalStyles/GlobalStyles.scss';
import GlobalStyles from './components/GlobalStyles/GlobalStyles';
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GlobalStyles>
            <App />
        </GlobalStyles>
    </React.StrictMode>,
);
export default App;
