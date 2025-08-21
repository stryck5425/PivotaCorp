import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TermsAndConditions from "@/components/TermsAndConditions";
import { useTermsScroll } from "@/hooks/useTermsScroll";

const Index = () => {
  const { currentSessionStats, personalRecordStats, resetSession } = useTermsScroll();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        companyName="SynergyCorp™"
        tagline="Innovating Tomorrow's Solutions, Today. (Terms Apply. Always.)"
      />
      <div className="flex flex-1">
        <Sidebar
          currentSessionStats={currentSessionStats}
          personalRecordStats={personalRecordStats}
          onResetSession={resetSession}
        />
        <TermsAndConditions />
      </div>
    </div>
  );
};

export default Index;