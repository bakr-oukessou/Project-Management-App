import {useState} from 'react'
import {Bell} from 'lucide-react'
import {Button} from '../ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card'
import {Badge} from '../ui/badge'
import type {Notification} from '../../types'

interface NotificationsListProps {
 notifications: Notification[]
 onMarkAsRead: (id: string) => void
}

export default function NotificationsList({notifications, onMarkAsRead}: NotificationsListProps) {
 const [isOpen, setIsOpen] = useState(false)

 const unreadCount = notifications.filter(n => !n.read).length

 return (
  <div className="relative">
   <Button variant="outline" size="sm" className="relative" onClick={() => setIsOpen(!isOpen)}>
    <Bell className="h-4 w-4 mr-2" />
    Notifications
    {unreadCount > 0 && (
     <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
      {unreadCount}
     </Badge>
    )}
   </Button>

   {isOpen && (
    <Card className="absolute right-0 mt-2 w-80 z-50">
     <CardHeader className="pb-2">
      <CardTitle className="text-lg">Notifications</CardTitle>
     </CardHeader>
     <CardContent>
      {notifications.length === 0 ? (
       <p className="text-sm text-muted-foreground py-2">Aucune notification</p>
      ) : (
       <div className="space-y-2 max-h-80 overflow-auto">
        {notifications.map(notification => (
         <div key={notification.id} className={`p-3 text-sm border rounded-md ${notification.read ? 'bg-background' : 'bg-muted'}`}>
          <div className="flex justify-between items-start">
           <p>{notification.message}</p>
           {!notification.read && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => onMarkAsRead(notification.id)}>
             Marquer comme lu
            </Button>
           )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{new Date(notification.date).toLocaleDateString()}</p>
         </div>
        ))}
       </div>
      )}
     </CardContent>
    </Card>
   )}
  </div>
 )
}
