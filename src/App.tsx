import store from "./redux/store";
import Router from "./routers";
import { Provider } from 'react-redux';
const App = () => {
  return (
    <Provider store={store}>
       <Router />
    </Provider>
  );
}

export default App;
