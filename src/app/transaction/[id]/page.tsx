"use client";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useTrans } from "@/app/context/DataContext";
import TransactionForm from "@/app/components/TransactionForm";
import { useCookies } from "react-cookie";
export default function EditTransactionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { transactions, editTransaction, addTransaction } = useTrans();
  const isNew = id === "new";
  const txnIndex = Number(id) - 1;
  const txn = transactions[txnIndex];
  const [cookies] = useCookies(["name"]);
  const handleSubmit = (data: any) => {
    const newData = {
      name: user?.name || "",
      email: user?.email || "",
      ...data,
    };
    if (isNew) {
      addTransaction(newData);
    } else {
      editTransaction(txnIndex, newData);
    }

    setTimeout(() => {
      router.push("/transactions?page=1");
    }, 2000);
  };

  if (!isNew && !txn)
    return <p className="mt-10 text-center">Transaction not found</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <TransactionForm
        initialValues={isNew ? undefined : txn}
        mode={isNew ? "add" : "edit"}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
