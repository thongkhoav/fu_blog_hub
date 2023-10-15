interface ConfirmDeleteModalProps {
  onDelete: (id: string) => Promise<void>;
  id: string;
}

export default function ConfirmDeleteModal({ onDelete, id }: ConfirmDeleteModalProps) {
  return <div></div>;
}
