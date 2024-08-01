import { Params } from "react-router-dom";

export function contactLoader({ params }: { params: Params<string> }) {
  return {
    contact: {
      id: params.contactId,
      first: "Your",
      last: "Name",
      avatar: "",
      twitter: "https://twitter.com",
      notes: "This is a demo contact.",
      favorite: false,
    },
  };
}
