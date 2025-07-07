export async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message); // Codifica la cadena a utf-8
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer); // Genera el hash SHA-256 del buffer de mensajes

    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convierte el hash buffer en un array de bytes
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""); // Convierte el array de bytes en una cadena hexadecimal return hashHex;
    return hashHex

}