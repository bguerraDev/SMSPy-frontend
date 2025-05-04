import defaultImage from "../assets/placeholder-image.png"; // imagen gris si no hay imagen en el mensaje
import defaultAvatar from "../assets/default-avatar.png"; // avatar si el usuario no tiene avatar
import "../styles/messageCard.css"; // archivo de estilos personalizados opcional

function MessageCard({
  /* id,
  sender,
  receiver, */
  senderUsername,
  receiverUsername,
  content,
  image,
  sentAt,
  isSent,
  avatarUrl,
  onImageClick,
  expanded,
  onToggleExpand,
}) {
  const renderImage = () => {
    return (
      <img
        src={image ? image : defaultImage} // Si hay imagen, la muestra; si no, muestra la imagen por defecto
        alt="Adjunto"
        className="w-32 h-32 object-cover rounded-md shadow cursor-pointer"
        onClick={() => onImageClick && image && onImageClick(image)}
        style={{ cursor: image ? "pointer" : "default" }}
      />
    );
  };

  const renderAvatar = () => {
    if (!expanded) return null; // Si no está expandido, no muestra el avatar
    // Usa avatarUrl directamente, ya que viene completa desde el backend
    const imageToShow =
      avatarUrl && avatarUrl.startsWith("http") ? avatarUrl : defaultAvatar;

    return (
      <img
        src={imageToShow}
        alt="Avatar"
        className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
      />
    );
  };

  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-md p-4 mb-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex gap-4">
        <div className="flex items-center justify-center">{renderImage()}</div>
        <div className="flex-1 max-w-full overflow-hidden">
          <small className="text-gray-400 block mb-1">{sentAt}</small>
          <h5 className="text-lg font-semibold mb-1">
            {isSent
              ? `Mensaje enviado para ${receiverUsername}`
              : `Mensaje recibido de ${senderUsername}`} 
          </h5>
          {renderAvatar()}
          <p className="text-sm break-words max-w-full leading-relaxed">
            {expanded
              ? content.length > 500
                ? `${content.slice(0, 500)}...`
                : content
              : content.length > 100
              ? `${content.slice(0, 100)}...`
              : content}
          </p>
          <button
            className="mt-2 px-3 py-1 text-sm border border-white rounded hover:bg-white hover:text-gray-900 transition"
            onClick={onToggleExpand}
          >
            {expanded ? "Mostrar menos" : "Mostrar más"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageCard;
// El componente MessageCard es un componente de React que representa una tarjeta de mensaje.
