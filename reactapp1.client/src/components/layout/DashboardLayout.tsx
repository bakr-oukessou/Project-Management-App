import type {ReactNode} from 'react'
import {useAuth} from '../../context/AuthContext'
import {LogOut, User} from 'lucide-react'

interface DashboardLayoutProps {
 children: ReactNode
 title: string
}

export default function DashboardLayout({children, title}: DashboardLayoutProps) {
 const {user, logout} = useAuth()

 return (
  <div className="layout">
   <header className="header">
    <div className="container flex justify-between items-center">
     <h1 className="header-title">{title}</h1>
     <div className="flex items-center gap-md">
      <div className="flex items-center gap-sm">
       <User className="icon-sm" />
       <span>{user?.name}</span>
      </div>
      <button className="btn btn-ghost btn-sm" onClick={logout}>
       <LogOut className="icon-sm mr-sm" />
       Déconnexion
      </button>
     </div>
    </div>
   </header>
   <main className="main">{children}</main>
   <footer className="footer">
    <div className="container text-center text-sm text-secondary">
     © {new Date().getFullYear()} Gestion de Projets Informatiques
    </div>
   </footer>
  </div>
 )
}
