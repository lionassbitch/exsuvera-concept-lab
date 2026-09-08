import { getTotalLessons } from "../../content/academy/curriculum";
import { AcademyProvider } from "./AcademyProvider";
import "./academy.css";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AcademyProvider totalLessons={getTotalLessons()}>
      {children}
    </AcademyProvider>
  );
}
