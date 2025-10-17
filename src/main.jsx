import 'bootstrap-icons/font/bootstrap-icons.css'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import GlobalLoader from './components/utility/GlobalLoader.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GlobalLoader />
    <App />
  </Provider>
)
