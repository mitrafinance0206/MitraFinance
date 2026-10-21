import { EnquiryForm } from "@/components/rdk/enquiry-form";
export const metadata = {
  title: "Loan enquiry",
  description:
    "Enquire about personal loans, home loans, loans against property and OD / CC with Mitra Finance, Coimbatore.",
};
export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ loan?: string }>;
}) {
  const params = await searchParams;
  return (
    <EnquiryForm
      initialLoan={typeof params.loan === "string" ? params.loan : ""}
    />
  );
}
