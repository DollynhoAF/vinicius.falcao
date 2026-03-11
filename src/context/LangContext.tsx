import { createContext, useContext, useState } from 'react'

type Lang = 'pt-br' | 'en'

interface LangContextType {
    lang: Lang
    setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextType>({
    lang: 'pt-br',
    setLang: () => {},
})

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<Lang>('pt-br')
    return (
        <LangContext.Provider value={{ lang, setLang }}>
            {children}
        </LangContext.Provider>
    )
}

export const useLang = () => useContext(LangContext)
