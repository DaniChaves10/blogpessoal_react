import { createContext, useState, type ReactNode } from "react";
import type UsuarioLogin from "../models/UsuarioLogin";
import { login } from "../services/Service";
import axios from "axios";
import { ToastToastAlertaa } from "../utils/ToastAlerta";

// Definir os estados e funções disponibilizadas pela Context
interface AuthContextProps{
    usuario: UsuarioLogin
    handleLogin(usuario: UsuarioLogin): void
    handleLogout(): void
    isLoading: boolean
}

// Quem ira consumir a context
interface AuthProviderProps{
    children: ReactNode
}

// Criar o context usando a tipagem AuthContextProps
// O Contexto ira disponibilizar os estados e as funções globalmente
export const AuthContext = createContext({} as AuthContextProps)

// Inicializar o provedor AuthProvider
// O provedor ira implementar as funções e inicializar os estados
export function AuthProvider({ children }: AuthProviderProps){

    // Inicializar o estado usuario, que é do tipo UsuarioLogin
    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: "",
        usuario: "",
        senha: "",
        foto: "",
        token: "",
    })

    // Inicializar o estado isLoading
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Implementar a função handleLogin (autenticar usuario)
    async function handleLogin(usuarioLogin: UsuarioLogin){

        setIsLoading(true);

        try{
          await login(`/usuarios/logar`, usuarioLogin, setUsuario);
          ToastToastAlertaa("Usuario Autenticado com sucesso!", "Sucesso")  
        }catch(error){
            if (axios.isAxiosError(error) && error.response){
        ToastToastAlertaa(`Error ao autenticar o usuário: ${error.response.status}`, "Erro");
        console.log('Resposta da API: ', error.message)
      } else{
        ToastToastAlertaa("Erro ao autenticar o usuario! Verifique a conexão com a API!", "Erro");
      }
        }finally{
            setIsLoading(false);
        }
    }

     // Implementar a função handleLogin (desconectar o usuario)
    function handleLogout(){
        setUsuario({
            id: 0,
            nome: "",
            usuario: "",
            senha: "",
            foto: "",
            token: "",
        })
    }

    return(
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading}}>
            { children }
        </AuthContext.Provider>
    )
}