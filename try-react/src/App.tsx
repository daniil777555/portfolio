import React, {useContext, useEffect} from 'react';
import { Route, Routes } from 'react-router-dom'
import './App.css';
import { NavBar } from './components/NavBar'
import { SnackBarAlert } from './components/SnackBarAlert'
import { SnackBarReload } from './components/SnackBarReload'
import { SnackBarWrapper } from './components/SnackBarWrapper'
import { SnackBarContext } from './context/snack-bar'
import { useAppSelector } from './hooks/store-hooks'
import { IndexPage } from './pages'
import { TodosPage } from './pages/todos'
import { UsersPage } from './pages/users'
import { ISnackBarEnum } from './types/ISnackBarEnum'

function App() {
  const { visibility, childType, setComponentType, open } = useContext(SnackBarContext)
  const { initialFetchRejected } = useAppSelector(state => state.todos)
  const components = {
    [ISnackBarEnum.ALERT]: () => <SnackBarAlert />,
    [ISnackBarEnum.RELOAD]: () => <SnackBarReload />
  }

  useEffect(() => {
    if (initialFetchRejected) {
      setComponentType(ISnackBarEnum.RELOAD)
      open()
    }
    // eslint-disable-next-line
  }, [initialFetchRejected])
  return (
    <div className="max-w-7xl px-5 py-5 mx-auto">
      <NavBar />
      <Routes>
        <Route path='/' element={<IndexPage />}/>
        <Route path='/todos' element={<TodosPage />}/>
        <Route path='/users' element={<UsersPage />}/>
      </Routes>
      {
        (visibility && childType) &&
        <SnackBarWrapper>
          { components[childType]() }
        </SnackBarWrapper>
      }
    </div>
  );
}

export default App;
