/**
 * Extrae el public ID de una URL de Cloudinary para poder eliminar la imagen después.
 */
const getPublicIdFromImageUrl = (imageUrl) => {
    // Expresión regular para extraer el nombre del archivo antes de la extensión
    const regex = /\/([^/]+)\.[^.]+$/;
    const match = imageUrl.match(regex);
    return match ? match[1] : null;
};

module.exports = { getPublicIdFromImageUrl };