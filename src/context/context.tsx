import { createSignal, createContext, useContext, JSX } from 'solid-js';
import { IUserApi } from '../interfaces/user';

interface ApplicationProviderProps
{
    children: JSX.Element;
}

const ApplicationContext = createContext();

export function ApplicationProvider ( props: ApplicationProviderProps )
{
    const [ user, setUser ] = createSignal();

    const store = [
        user,
        {
            addUser ( user: IUserApi )
            {
                setUser( () => user );
            }
        }
    ];

    return (
        <ApplicationContext.Provider value={store}>
            {props.children}
        </ApplicationContext.Provider>
    );
}

export function useApplicationContext ()
{
    return useContext( ApplicationContext );
}
