import { UserDTO } from "@dtos/UserDTO";
import { createContext, useState, useEffect, ReactNode } from "react";
import yup from 'yup'
import { hash} from 'bcryptjs'
type AuthContextProviderProps = {
  children: ReactNode;
}

export type AuthContextDataProps ={
  user: UserDTO,
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () =>Promise<void>;
}

const userBody = yup.object({
  username: yup.string().required().min(3),
  password: 
  yup.string().required().min(6).matches(/(?=.*[A-Z])/, 'Deve conter pelo menos uma letra maiúscula').matches(/(?=.*[0-9])/, 'Deve conter pelo menos um número')
})
export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps)  {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  async function signIn(){
    try {
      const {username, password} = userBody.validateSync(user);
      const passwordHashed = hash(password, 8)
      
      
    } catch (error) {
      
    }
  }
}