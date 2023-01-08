import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from './redux/reducer';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)
document.body.style.margin = 0


let html = document.getElementsByTagName("html")


//html.style.height = "100vh"
// Now we can render our application into it

const store = createStore(reducer);

render(
    // 만든 store를 앱 상위에 넣어줍니다.
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
);