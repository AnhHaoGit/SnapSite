import { toast } from "react-toastify";

type User = {
  username?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
};

type Session = {
  user?: User;
};

const fetch_data = async (session: Session) => {
  try {
    const response = await fetch("/api/fetch_data", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session?.user?.id }),
    });

    console.log(session);

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    localStorage.setItem("pages", JSON.stringify(data));

    return data;
  } catch (error) {
    const errMsg =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : JSON.stringify(error);
    toast.error(`Failed to fetch data: ${errMsg}`);

    return null;
  }
};

export default fetch_data;
