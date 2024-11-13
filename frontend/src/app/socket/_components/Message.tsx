export default function Message({ text }: { text: string }) {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <div>{text}</div>
      </div>
    </div>
  );
}
