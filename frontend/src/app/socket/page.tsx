import Messages from "./_components/Messages";
import MessageComposer from "./_components/MessageComposer";

export default function Page() {
  return (
    <div className="flex flex-col w-full h-full p-24 text-black bg-white">
      <Messages />
      <MessageComposer />
    </div>
  );
}
