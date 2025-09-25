type Props = {
  name: string;
  address: string;
  phone: string | null;
  location: { x: number; y: number } | null;
};

export function DayhomeCard(props: Props) {
  return (
    <div className="border border-slate-400 rounded p-4">
      <div>{props.name}</div>
      <div className="text-slate-600 text-sm">{props.address}</div>
      <div className="text-slate-600 text-sm">{props.phone}</div>
      <div>{props.location?.x}, {props.location?.y}</div>
    </div>
  );
}
