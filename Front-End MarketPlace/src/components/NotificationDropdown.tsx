import { useNotifications } from "../hooks/useNotifications";

export function NotificationCenter() {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border overflow-hidden">
      <div className="p-3 font-semibold border-b">Notificações</div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 && (
          <p className="p-4 text-sm text-gray-500 text-center">
            Nenhuma notificação
          </p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              console.log("🧪 CLIQUEI NA NOTIFICAÇÃO:", n.id, n.read);
              markAsRead(n.id);
            }}
            className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
              !n.read && "bg-violet-50"
            }`}
          >
            <p className="font-medium text-sm">{n.title}</p>
            <p className="text-xs text-gray-600">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationCenter;
