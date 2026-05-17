export default function DurumRozeti({
  children,
  tip = "mavi",
}) {
  return (
    <span className={`durum-rozeti durum-${tip}`}>
      {children}
    </span>
  );
}