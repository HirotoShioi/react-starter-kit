export async function createContact() {
  const id = Math.random().toString(36).substring(7);
  return {
    contactId: id,
    name: "New Contact",
  };
}

export async function getContact(contactId: string) {
  return {
    contactId,
    name: "Contact Name",
  };
}
