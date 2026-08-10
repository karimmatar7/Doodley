export function getRoomCodeFromQr(
  value: string
): string | null {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  try {
    const parsedUrl = new URL(normalizedValue);
    const pathParts = parsedUrl.pathname
      .split("/")
      .filter(Boolean);

    const roomIndex = pathParts.findIndex(
      (part) => part.toLowerCase() === "room"
    );

    const roomCode = pathParts[roomIndex + 1];

    if (
      roomCode &&
      /^[A-Z0-9]{5}$/i.test(roomCode)
    ) {
      return roomCode.toUpperCase();
    }

    return null;
  } catch {
    const plainCode = normalizedValue.toUpperCase();

    return /^[A-Z0-9]{5}$/.test(plainCode)
      ? plainCode
      : null;
  }
}