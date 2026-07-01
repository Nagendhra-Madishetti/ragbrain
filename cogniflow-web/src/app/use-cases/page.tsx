import type { Metadata } from "next";
import { PageStub } from "@/components/site/page-stub";

export const metadata: Metadata = { title: "Use cases" };

export default function UseCasesPage() {
  return (
    <PageStub
      eyebrow="Use cases"
      title="Where 'what did we believe, and when' is the whole job."
      intro="Cogniflow earns its place wherever an answer must be defensible after the fact — regulated, audited, or contested domains where the current answer isn't enough and you must prove what was known at a past moment."
      planned={[
        "Compliance & audit — reconstruct what the system knew at any prior date",
        "Financial & legal agents — cite the fact that was valid at decision time",
        "Support & ops knowledge — answer 'what was the policy in March?' correctly",
        "Agent memory that doesn't rewrite history when facts change",
        "In-VPC deployments where data cannot leave the customer environment",
      ]}
    />
  );
}
