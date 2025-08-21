import React from 'react';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TermsAndConditions from "@/components/TermsAndConditions";
import { useTermsScroll } from "@/hooks/useTermsScroll";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const { currentSessionStats, personalRecordStats, resetSession } = useTermsScroll();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        companyName="SynergyCorp™"
        tagline="Innovating Tomorrow's Solutions, Today. (Terms Apply. Always.)"
        onMenuClick={() => setIsSheetOpen(true)} // Open sheet on menu click
      />
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar
          currentSessionStats={currentSessionStats}
          personalRecordStats={personalRecordStats}
          onResetSession={resetSession}
          className="hidden lg:block" // Only visible on large screens
        />

        {/* Mobile Sidebar (Sheet) */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild className="hidden">
            {/* This trigger is hidden, the Header button will open the sheet */}
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar
              currentSessionStats={currentSessionStats}
              personalRecordStats={personalRecordStats}
              onResetSession={() => {
                resetSession();
                setIsSheetOpen(false); // Close sheet after reset
              }}
              className="w-full h-full border-none" // Adjust styling for sheet content
            />
          </SheetContent>
        </Sheet>

        <TermsAndConditions />
      </div>
    </div>
  );
};

export default Index;